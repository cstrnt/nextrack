import { PUBLIC_ABLY_CLIENT_KEY } from '$env/static/public';
import type { SongRequestDTO } from '$lib/server/RequestService';
import Ably from 'ably';
import { onDestroy, onMount } from 'svelte';

const ably = new Ably.Realtime.Promise(PUBLIC_ABLY_CLIENT_KEY);

export enum LIVE_EVENT {
	VOTE = 'vote',
	ADD_REQUEST = 'add-request'
}

export type VotePayload = {
	requestId: string;
	action: 'upvote' | 'downvote';
};

export type AddRequestPayload = SongRequestDTO;

type Handlers = {
	[LIVE_EVENT.VOTE]: (payload: VotePayload) => void;
	[LIVE_EVENT.ADD_REQUEST]: (payload: AddRequestPayload) => void;
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
