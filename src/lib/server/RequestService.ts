import type { SongRequest } from '@prisma/client';
import { prisma } from '$lib/server/db';
import crypto from 'node:crypto';
import { LiveUpdateService } from './ably';

export type SongRequestDTO = Pick<SongRequest, 'id' | 'createdAt' | 'title' | 'link'> & {
	votes: number;
	hasUpvoted: boolean;
};

export abstract class RequestService {
	static hashIp(ip: string) {
		return crypto.createHash('sha256').update(ip).digest('hex');
	}

	private static async canVote({ ip, requestId }: { ip: string; requestId: string }) {
		const ipHash = RequestService.hashIp(ip);
		return (
			(await prisma.blockList.count({
				where: {
					ipHash,
					user: {
						songRequests: {
							some: {
								id: requestId
							}
						}
					}
				}
			})) === 0
		);
	}

	private static async canRequestSong({ ip, userHandle }: { ip: string; userHandle: string }) {
		const ipHash = RequestService.hashIp(ip);
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
	static async getUnplayedRequests(userId: string) {
		return prisma.songRequest.findMany({
			where: {
				userId,
				playedAt: null
			}
		});
	}
	static async getPlayedRequests(userId: string) {
		return prisma.songRequest.findMany({
			where: {
				userId,
				playedAt: {
					not: null
				}
			}
		});
	}
	static async addRequest({
		ip,
		link,
		title,
		userHandle
	}: Pick<SongRequest, 'title' | 'link'> & {
		ip: string;
		userHandle: string;
	}) {
		if (!(await RequestService.canRequestSong({ ip, userHandle }))) {
			throw new Error('You have been blocked from making wishes');
		}

		const songRequest = await prisma.songRequest.create({
			data: {
				submitterIpHash: RequestService.hashIp(ip),
				link,
				title,
				votes: {
					create: {
						voterIpHash: RequestService.hashIp(ip)
					}
				},
				user: {
					connect: {
						username: userHandle
					}
				}
			}
		});
		await LiveUpdateService.publishWish({
			handle: userHandle,
			createdAt: songRequest.createdAt,
			id: songRequest.id,
			link: songRequest.link,
			title: songRequest.title,
			votes: 1,
			hasUpvoted: false
		});
		return songRequest;
	}
	static async voteOnRequest({ ip, requestId }: { requestId: string; ip: string }) {
		if (!(await RequestService.canVote({ ip, requestId }))) {
			throw new Error('You have been blocked from voting');
		}

		const songRequest = await prisma.songRequest.findUnique({
			where: {
				id: requestId
			},
			select: {
				user: {
					select: {
						username: true
					}
				}
			}
		});

		if (!songRequest?.user.username) throw new Error('Invalid Vote');

		const hasVoted = await prisma.vote.findFirst({
			where: {
				voterIpHash: RequestService.hashIp(ip),
				songRequestId: requestId
			}
		});

		if (hasVoted != null) {
			await LiveUpdateService.publishVote({
				action: 'downvote',
				handle: songRequest.user.username,
				requestId
			});
			await prisma.vote.delete({
				where: {
					songRequestId_voterIpHash: {
						voterIpHash: RequestService.hashIp(ip),
						songRequestId: requestId
					}
				}
			});
			return false;
		}

		await LiveUpdateService.publishVote({
			action: 'upvote',
			handle: songRequest.user.username,
			requestId
		});

		await prisma.vote.create({
			data: {
				voterIpHash: RequestService.hashIp(ip),
				songRequest: {
					connect: {
						id: requestId
					}
				}
			}
		});
		return true;
	}

	static async markAsPlayed(requestId: string, userName: string) {
		const wish = await prisma.songRequest.findFirst({
			where: {
				id: requestId,
				user: { username: userName }
			}
		});
		if (!wish) throw new Error('Invalid Wish');

		await LiveUpdateService.markAsPlayed({ handle: userName, requestId });
		return prisma.songRequest.update({
			where: {
				id: requestId
			},
			data: {
				playedAt: new Date()
			}
		});
	}
	static async markAsUnplayed(requestId: string, userName: string) {
		const wish = await prisma.songRequest.findFirst({
			where: {
				id: requestId,
				user: { username: userName }
			}
		});
		if (!wish) throw new Error('Invalid Wish');

		return prisma.songRequest.update({
			where: {
				id: requestId
			},
			data: {
				playedAt: null
			}
		});
	}
	static async deleteRequest({
		requestId,
		shouldBlock,
		userName
	}: {
		requestId: string;
		userName: string;
		shouldBlock?: boolean;
	}) {
		const songRequest = await prisma.songRequest.findFirst({
			where: {
				id: requestId,
				user: { username: userName }
			}
		});
		if (!songRequest) throw new Error('Invalid Request');
		await LiveUpdateService.removeRequest({ handle: userName, requestId });
		await prisma.$transaction([
			prisma.vote.deleteMany({
				where: {
					songRequestId: requestId
				}
			}),
			prisma.songRequest.delete({
				where: {
					id: requestId
				}
			}),
			...(shouldBlock
				? [
						prisma.blockList.create({
							data: {
								ipHash: songRequest.submitterIpHash,
								userId: songRequest.userId
							}
						})
				  ]
				: [])
		]);
	}
}
