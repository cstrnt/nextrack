import { UserService } from '$lib/server/UserService';
import { RequestService } from '$lib/server/RequestService';
import { getSession } from '@auth/sveltekit';
import type { User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { authConfig } from '../../hooks.server';
import type { Actions, PageServerLoadEvent } from './$types';

export async function load({ request }: PageServerLoadEvent) {
	const session = await getSession(request, authConfig);
	if (!session || !session.user) {
		throw redirect(302, '/login');
	}
	const user = await UserService.getProfileData((session.user as User).id);

	if (!user) {
		throw redirect(302, '/login');
	}

	return { user };
}

export const actions: Actions = {
	isAcceptingRequests: async ({ request }) => {
		const session = await getSession(request, authConfig);
		if (!session || !session.user) {
			throw redirect(302, '/login');
		}
		const user = await UserService.getProfileData((session.user as User).id);
		if (!user) {
			throw redirect(302, '/login');
		}
		const formData = await request.formData();

		await UserService.setIsAcceptingRequests(user.id, formData.get('isAcceptingRequests') === 'on');
	},
	markAsPlayed: async ({ request }) => {
		const session = await getSession(request, authConfig);
		if (!session || !session.user) {
			throw redirect(302, '/login');
		}
		const user = await UserService.getProfileData((session.user as User).id);
		if (!user || !user.username) {
			throw redirect(302, '/login');
		}
		const formData = await request.formData();
		const requestId = formData.get('requestId');
		if (typeof requestId !== 'string') {
			throw error(500, 'Invalid request');
		}
		await RequestService.markAsPlayed(requestId, user.username);
	},
	markAsUnplayed: async ({ request }) => {
		const session = await getSession(request, authConfig);
		if (!session || !session.user) {
			throw redirect(302, '/login');
		}
		const user = await UserService.getProfileData((session.user as User).id);
		if (!user || !user.username) {
			throw redirect(302, '/login');
		}
		const formData = await request.formData();
		const requestId = formData.get('requestId');
		if (typeof requestId !== 'string') {
			throw error(500, 'Invalid request');
		}
		await RequestService.markAsUnplayed(requestId, user.username);
	},
	remove: async ({ request }) => {
		const session = await getSession(request, authConfig);
		if (!session || !session.user) {
			throw redirect(302, '/login');
		}
		const user = await UserService.getProfileData((session.user as User).id);
		if (!user || !user.username) {
			throw redirect(302, '/login');
		}
		const formData = await request.formData();
		const requestId = formData.get('requestId');
		const shouldBlock = formData.get('shouldBlock');

		if (typeof requestId !== 'string') {
			throw error(500, 'Invalid request');
		}

		await RequestService.deleteRequest({
			requestId,
			shouldBlock: !!shouldBlock,
			userName: user.username
		});
	}
};
