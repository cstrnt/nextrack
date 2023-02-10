import type { SongWish } from '@prisma/client';
import { prisma } from './db';
import crypto from 'node:crypto';

export abstract class WishService {
	static hashIp(ip: string) {
		return crypto.createHash('sha256').update(ip).digest('hex');
	}

	private static async canVote({ ip, wishId }: { ip: string; wishId: string }) {
		const ipHash = WishService.hashIp(ip);
		return (
			(await prisma.blockList.count({
				where: {
					ipHash,
					user: {
						SongWishes: {
							some: {
								id: wishId
							}
						}
					}
				}
			})) === 0
		);
	}

	private static async canAddWish({ ip, userHandle }: { ip: string; userHandle: string }) {
		const ipHash = WishService.hashIp(ip);
		return (
			(await prisma.blockList.count({
				where: {
					ipHash,
					user: {
						username: userHandle
					}
				}
			})) === 0
		);
	}
	static async getUnplayedWishes(userId: string) {
		return prisma.songWish.findMany({
			where: {
				userId,
				playedAt: null
			}
		});
	}
	static async getPlayedWishes(userId: string) {
		return prisma.songWish.findMany({
			where: {
				userId,
				playedAt: {
					not: null
				}
			}
		});
	}
	static async addWish({
		ip,
		link,
		title,
		userHandle
	}: Pick<SongWish, 'title' | 'link'> & {
		ip: string;
		userHandle: string;
	}) {
		if (!(await WishService.canAddWish({ ip, userHandle }))) {
			throw new Error('You have been blocked from making wishes');
		}

		return prisma.songWish.create({
			data: {
				submitterIpHash: WishService.hashIp(ip),
				link,
				title,
				user: {
					connect: {
						username: userHandle
					}
				}
			}
		});
	}
	static async voteOnWish({ ip, wishId }: { wishId: string; ip: string }) {
		if (!(await WishService.canVote({ ip, wishId }))) {
			throw new Error('You have been blocked from voting');
		}
		const hasVoted = await prisma.vote.count({
			where: {
				voterIpHash: WishService.hashIp(ip),
				songWishId: wishId
			}
		});
		if (hasVoted) {
			await prisma.vote.delete({
				where: {
					songWishId_voterIpHash: {
						voterIpHash: WishService.hashIp(ip),
						songWishId: wishId
					}
				}
			});
			return false;
		} else {
			await prisma.vote.create({
				data: {
					voterIpHash: WishService.hashIp(ip),
					songWish: {
						connect: {
							id: wishId
						}
					}
				}
			});
			return true;
		}
	}

	static async markAsPlayed(wishId: string) {
		return prisma.songWish.update({
			where: {
				id: wishId
			},
			data: {
				playedAt: new Date()
			}
		});
	}
}
