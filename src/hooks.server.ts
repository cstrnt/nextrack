import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_SECRET, GOOGLE_ID } from '$env/static/private';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

export const handle = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }) as any]
});
