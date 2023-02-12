import { UserService } from '$lib/server/UserService';
import { RequestService } from '$lib/server/RequestService';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoadEvent, Actions } from './$types';

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
