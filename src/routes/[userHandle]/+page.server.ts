import { error } from '@sveltejs/kit';
import { UserService } from '../../server/UserService';
import type { Actions, PageServerLoadEvent } from './$types';
import { z } from 'zod';
import { WishService } from '../../server/WishService';

const addWishSchema = z.object({
	song: z.string(),
	artist: z.string(),
	link: z.string().optional()
});

export async function load({ params, getClientAddress }: PageServerLoadEvent) {
	const user = await UserService.getUserByHandle(params.userHandle.toLowerCase());

	if (user) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { email, emailVerified, name, SongWishes, ...rest } = user;
		console.log({
			hip: WishService.hashIp(getClientAddress()),
			SongWishes
		});
		return {
			...rest,
			wishes: SongWishes.map((wish) => ({
				...wish,
				votes: wish.votes.length,
				hasUpvoted: wish.votes.some(
					(vote) => vote.songWishId === WishService.hashIp(getClientAddress())
				)
			}))
		};
	}

	throw error(404, 'Not found');
}

export const actions: Actions = {
	createWish: async ({ request, params, getClientAddress }) => {
		const userHandle = params.userHandle.toLowerCase();
		const formData = await request.formData();

		const validationResult = addWishSchema.safeParse(Object.fromEntries(formData.entries()));
		if (!validationResult.success) {
			throw error(400, 'Invalid data');
		}
		const { artist, song, link } = validationResult.data;
		await WishService.addWish({
			ip: getClientAddress(),
			link: link || null,
			title: `${artist} - ${song}`,
			userHandle
		});
		return { success: true };
	},
	vote: async ({ request, getClientAddress }) => {
		const wishId = (await request.formData()).get('wishId');
		if (typeof wishId !== 'string') {
			throw error(400, 'Invalid data');
		}

		const hasVoted = await WishService.voteOnWish({
			ip: getClientAddress(),
			wishId
		});

		return { hasVoted };
	}
};
