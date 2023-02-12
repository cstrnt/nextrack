import { DefaultSession, DefaultUser } from '@auth/core/types';

declare module '@auth/sveltekit' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			username?: string;
		} & DefaultSession['user'];
	}
	interface User extends DefaultUser {
		username?: string;
	}
}
