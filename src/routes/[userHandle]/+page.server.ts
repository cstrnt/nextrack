import { error, fail } from '@sveltejs/kit';
import { UserService } from '$lib/server/UserService';
import type { Actions, PageServerLoadEvent } from './$types';
import { RequestService, type SongRequestDTO } from '$lib/server/RequestService';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NODE_ENV } from '$env/static/private';

const baseCache = new Map();

export async function load({ params, getClientAddress }: PageServerLoadEvent) {
	const user = await UserService.getUserByHandle(params.userHandle);

	if (user) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { email, emailVerified, name, songRequests, ...rest } = user;

		return {
			...rest,
			requests: songRequests
				.filter((request) => request.playedAt == null)
				.map(
					(request) =>
						({
							id: request.id,
							createdAt: request.createdAt,
							title: request.title,
							link: request.link,
							votes: request.votes.length,
							hasUpvoted: request.votes.some(
								(vote) => vote.voterIpHash === RequestService.hashIp(getClientAddress())
							)
						} satisfies SongRequestDTO)
				)
		};
	}

	throw error(404, 'Not found');
}

export const actions: Actions = {
	vote: async ({ request, getClientAddress }) => {
		const requestId = (await request.formData()).get('requestId');
		// we don't want to rate limit in dev
		if (NODE_ENV === 'production') {
			const ratelimit = new Ratelimit({
				ephemeralCache: baseCache,
				redis: Redis.fromEnv(),
				limiter: Ratelimit.slidingWindow(3, '10 s')
			});

			const canVote = await ratelimit.limit(getClientAddress() + requestId);

			if (!canVote) {
				return fail(429, {
					message: "Please don't spam the vote button"
				});
			}
		}

		if (typeof requestId !== 'string') {
			throw error(400, 'Invalid data');
		}

		const hasVoted = await RequestService.voteOnRequest({
			ip: getClientAddress(),
			requestId
		});

		return { hasVoted };
	}
};
