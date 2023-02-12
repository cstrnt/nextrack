import { PUBLIC_ABLY_CLIENT_KEY } from '$env/static/public';
import type { SongRequestDTO } from '$lib/server/RequestService';
import Ably from 'ably';
import { onDestroy, onMount } from 'svelte';

const ably = new Ably.Realtime.Promise(PUBLIC_ABLY_CLIENT_KEY);

export enum LIVE_EVENT {
	VOTE = 'vote',
	ADD_REQUEST = 'add-request',
	MARK_AS_PLAYED = 'mark-as-played',
	REMOVE_REQUEST = 'remove-request'
}

export type VotePayload = {
	requestId: string;
	action: 'upvote' | 'downvote';
};

export type AddRequestPayload = SongRequestDTO;

type Handlers = {
	[LIVE_EVENT.VOTE]: (payload: VotePayload) => void;
	[LIVE_EVENT.ADD_REQUEST]: (payload: AddRequestPayload) => void;
	[LIVE_EVENT.MARK_AS_PLAYED]: (payload: { requestId: string }) => void;
	[LIVE_EVENT.REMOVE_REQUEST]: (payload: { requestId: string }) => void;
};

export async function listenToEvents(userHandle: string, handlers: Handlers) {
	let channel: Ably.Types.RealtimeChannelPromise | undefined;

	onMount(async () => {
		channel = ably.channels.get(userHandle);
		await Promise.all(
			Object.entries(handlers).map(([eventName, handler]) =>
				channel?.subscribe(eventName, (p) => handler(p.data))
			)
		);
	});

	onDestroy(() => {
		channel?.unsubscribe();
	});
}
