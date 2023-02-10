import { prisma } from './db';

export abstract class UserService {
	static getUserByHandle(handle: string) {
		return prisma.user.findUnique({
			where: {
				username: handle
			},
			include: {
				SongWishes: {
					include: {
						votes: true
					}
				}
			}
		});
	}
}
