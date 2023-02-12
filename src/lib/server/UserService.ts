import { prisma } from '$lib/server/db';

export abstract class UserService {
	static async isHandleFree(handle: string) {
		return (
			(await prisma.user.findFirst({
				where: {
					username: {
						equals: handle.toLowerCase(),
						mode: 'insensitive'
					}
				}
			})) == null
		);
	}
	static assignUserHandle(handle: string, userId: string) {
		return prisma.user.update({
			where: {
				id: userId
			},
			data: {
				username: handle
			}
		});
	}
	static getUserByHandle(handle: string) {
		return prisma.user.findFirst({
			where: {
				username: {
					equals: handle,
					mode: 'insensitive'
				}
			},
			include: {
				songRequests: {
					include: {
						votes: true
					}
				}
			}
		});
	}
	static getProfileData(userId: string) {
		return prisma.user.findFirst({
			where: {
				id: userId
			},
			include: {
				songRequests: {
					include: {
						votes: true
					}
				}
			}
		});
	}
	static setIsAcceptingRequests(userId: string, isAcceptingRequests: boolean) {
		return prisma.user.update({
			where: {
				id: userId
			},
			data: {
				isAcceptingRequests
			}
		});
	}
}
