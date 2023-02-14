import { UserService } from '$lib/server/UserService';
import { RequestService } from '$lib/server/RequestService';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoadEvent, Actions } from './$types';
import { NODE_ENV } from '$env/static/private';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const baseCache = new Map();

const ALLOWED_DOMAINS = ['youtube.com', 'youtu.be', 'open.spotify.com', 'soundcloud.com'].flatMap(
	(domain) => [domain, `www.${domain}`]
);

const addWishSchema = z.object({
	song: z.string().min(1),
	artist: z.string().min(1),
	link: z.string().optional().or(z.string().url())
});

type AddWishInput = z.infer<typeof addWishSchema>;

export async function load({ params }: PageServerLoadEvent) {
	const user = await UserService.getUserByHandle(params.userHandle);
	return { user };
}

export const actions: Actions = {
	default: async ({ request, params, getClientAddress }) => {
		const userHandle = params.userHandle.toLowerCase();
		const formData = await request.formData();

		// we don't want to rate limit in dev
		if (NODE_ENV === 'production') {
			const ratelimit = new Ratelimit({
				ephemeralCache: baseCache,
				redis: Redis.fromEnv(),
				limiter: Ratelimit.slidingWindow(1, '10 s')
			});

			const canVote = await ratelimit.limit(getClientAddress());

			if (!canVote) {
				return fail(429, {
					message: 'You can only request a song once every 10 seconds.'
				});
			}
		}

		const validationResult = addWishSchema.safeParse(Object.fromEntries(formData.entries()));
		if (!validationResult.success) {
			return fail(
				400,
				validationResult.error.issues.reduce(
					(acc, issue) => ({
						...acc,
						[issue.path[0]]: {
							value: formData.get(issue.path[0] as string),
							message: issue.message
						}
					}),
					{}
				) as Partial<Record<keyof AddWishInput, { value: string; message: string }>>
			);
		}
		const { artist, song, link } = validationResult.data;

		if (!!link && !ALLOWED_DOMAINS.includes(new URL(link).hostname)) {
			return fail(400, {
				link: {
					value: link,
					message: 'Please Insert a Link from SoundCloud, Youtube or Spotify'
				}
			});
		}
		try {
			await RequestService.addRequest({
				ip: getClientAddress(),
				link: link || null,
				title: `${artist} - ${song}`,
				userHandle
			});
		} catch (e) {
			console.error(e);
			console.error(`Blocked request`);
		}
		throw redirect(302, `/${userHandle}`);
	}
};
