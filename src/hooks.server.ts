import { getSession, SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_SECRET, GOOGLE_ID } from '$env/static/private';
import { PrismaClient, type User } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Handle } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const authConfig: SvelteKitAuthConfig = {
	adapter: PrismaAdapter(prisma),
	providers: [Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }) as any],
	callbacks: {
		session: async ({ session, user }) => {
			if (session.user && user) {
				(session.user as User).username = (user as User).username;
				(session.user as User).id = (user as User).id;
			}
			return session;
		}
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	const session = await getSession(event.request, authConfig);

	if (session && (session.user as User).username == null && event.url.pathname !== '/new-user') {
		return new Response('', {
			headers: {
				Location: '/new-user'
			},
			status: 302
		});
	}
	return SvelteKitAuth(authConfig)({ event, resolve });
};
