import { getSession } from '@auth/sveltekit';
import type { User } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { authConfig } from '../../hooks.server';
import { UserService } from '$lib/server/UserService';
import type { Actions, PageServerLoadEvent } from './$types';
import { isValidUrlSlug } from '$lib/shared/helpers';

export async function load({ request }: PageServerLoadEvent) {
	const session = await getSession(request, authConfig);
	const userName = (session?.user as User | undefined)?.username;
	if (userName) {
		throw redirect(302, `/${userName}`);
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const session = await getSession(request, authConfig);
		const user = session?.user as User | undefined;
		if (!user) {
			throw error(400, 'User not found');
		}

		const formData = await request.formData();
		const userName = formData.get('username');
		if (typeof userName !== 'string' || !isValidUrlSlug(userName)) {
			return fail(400, {
				message: 'The username can only contain letters, numbers, hyphens (-) and underscores (_)'
			});
		}
		const isFree = await UserService.isHandleFree(userName);
		if (!isFree) {
			return fail(400, { message: 'Username is already taken' });
		}

		await UserService.assignUserHandle(userName, user.id);
		throw redirect(302, `/${userName}`);
	}
};
