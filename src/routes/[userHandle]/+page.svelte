<script lang="ts">
	import { page } from '$app/stores';
	import { listenToEvents } from '$lib/client/ably';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import Wish from '$lib/components/Wish.svelte';
	import { Avatar, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import { isStreamView } from '$lib/client/helpers';
	import { get } from 'svelte/store';

	export let data: PageData;
	export let form: ActionData;

	$: {
		if (form?.message) {
			const t: ToastSettings = {
				message: form.message,
				preset: 'primary',
				autohide: true,
				timeout: 2000
			};
			toastStore.trigger(t);
		}
	}

	listenToEvents($page.params.userHandle, {
		vote: ({ action, requestId }) => {
			const wishIndex = data.requests.findIndex((request) => request.id === requestId);
			if (wishIndex === -1) return;

			data.requests[wishIndex].votes =
				action === 'upvote'
					? data.requests[wishIndex].votes + 1
					: data.requests[wishIndex].votes - 1;
		},
		'add-request': (wish) => {
			data.requests = data.requests.concat(wish);
		},
		'mark-as-played': ({ requestId }) => {
			data.requests = data.requests.filter((request) => request.id !== requestId);
		},
		'remove-request': ({ requestId }) => {
			data.requests = data.requests.filter((request) => request.id !== requestId);
		}
	});

	onMount(() => {
		if (get(isStreamView)) {
			document.body.classList.add('!bg-transparent');
		}
	});

	$: wishes = [...data.requests]
		.sort((a, b) => b.votes - a.votes)
		.slice(0, $isStreamView ? 3 : data.requests.length);
</script>

{#if !$isStreamView}
	<Avatar
		src={data.image ?? undefined}
		rounded="rounded-full"
		width="48"
		border="border-4 border-surface-500"
		class="mt-8"
	/>
	<h1 class="text-xl font-bold">This is: {data.username?.toUpperCase()}</h1>
{/if}
{#if !data.isAcceptingRequests}
	<p>Not accepting wishes</p>
{:else}
	{#if !$isStreamView}
		<a href={$page.params.userHandle + '/request'} class="text-lg font-semibold py-4 cursor-pointer"
			>Request a Song</a
		>
	{/if}
	{#if wishes.length}
		<ul
			class="space-y-6 w-full pt-3 {$isStreamView
				? 'absolute top-1/2 transform -translate-y-1/2'
				: 'max-w-xl'}"
		>
			{#each wishes as wish (wish.id)}
				<div class="w-full" animate:flip in:fade>
					<Wish {wish} isStream={$isStreamView} />
				</div>
			{/each}
		</ul>
	{:else}
		<p>No wishes yet</p>
	{/if}
{/if}
