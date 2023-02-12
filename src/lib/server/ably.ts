import { ABLY_SERVER_KEY } from '$env/static/private';
import { LIVE_EVENT, type VotePayload } from '$lib/client/ably';
import Ably from 'ably';
import type { SongRequestDTO } from './RequestService';

const ably = new Ably.Realtime.Promise(ABLY_SERVER_KEY);

export abstract class LiveUpdateService {
	static publishVote({ handle, requestId: requestId, action }: VotePayload & { handle: string }) {
		const channel = ably.channels.get(handle);
		return channel.publish(LIVE_EVENT.VOTE, { requestId, action });
	}
	static publishWish({ handle, ...songWish }: SongRequestDTO & { handle: string }) {
		const channel = ably.channels.get(handle);
		return channel.publish(LIVE_EVENT.ADD_REQUEST, songWish);
	}
	static markAsPlayed({ handle, requestId }: { handle: string; requestId: string }) {
		const channel = ably.channels.get(handle);
		return channel.publish(LIVE_EVENT.MARK_AS_PLAYED, { requestId });
	}
	static removeRequest({ handle, requestId }: { handle: string; requestId: string }) {
		const channel = ably.channels.get(handle);
		return channel.publish(LIVE_EVENT.REMOVE_REQUEST, { requestId });
	}
}
