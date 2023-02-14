<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import UserHeader from '$lib/components/UserHeader.svelte';
	import { CheckIcon, TrashIcon, XCircleIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { ArrowLeftIcon } from '@rgossiaux/svelte-heroicons/solid';
	import { Avatar, modalStore, Tab, TabGroup, type ModalSettings } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	let tabSet: 'played' | 'unplayed' = 'unplayed';

	let acceptingRequestsForm: HTMLFormElement;

	function onBlockClick(requestId: string) {
		const confirm = {
			type: 'confirm',
			title: 'Block and Remove',
			body: "Are you sure you wish to block this user? The user won't be able to request songs anymore or vote on them.",
			response: (isConfirmed: boolean) => {
				if (!isConfirmed) return;
				const formData = new FormData();
				formData.append('requestId', requestId);
				formData.append('shouldBlock', 'true');
				fetch('?/remove', {
					method: 'POST',
					body: formData
				}).then((res) => {
					if (res.ok) {
						invalidateAll();
					}
				});
			},
			buttonTextCancel: 'Cancel',
			buttonTextConfirm: 'Confirm'
		} satisfies ModalSettings;
		modalStore.trigger(confirm);
	}

	$: playedSongs = data.user.songRequests.filter((song) => song.playedAt != null);
	$: unplayedSongs = data.user.songRequests.filter((song) => song.playedAt == null);
</script>

<UserHeader image={data.user.image ?? undefined} username={data.user.username ?? undefined} />
<form
	method="POST"
	action="?/isAcceptingRequests"
	use:enhance
	class="my-6"
	bind:this={acceptingRequestsForm}
>
	<label class="label">
		<input
			type="checkbox"
			class="checkbox"
			name="isAcceptingRequests"
			checked={data.user.isAcceptingRequests}
			on:change={() => {
				acceptingRequestsForm.submit();
			}}
		/>
		<span>I am accepting Requests</span>
	</label>
</form>

<h2 class="text-left w-full">Your Requests</h2>
<TabGroup class="w-full">
	<Tab bind:group={tabSet} name="Unplayed Songs" value="unplayed" rounded="rounded-t-md"
		>Unplayed</Tab
	>
	<Tab bind:group={tabSet} name="Played Songs" value="played" rounded="rounded-t-md">Played</Tab>
	<svelte:fragment slot="panel">
		<ul class="space-y-4 h-full overflow-y-auto">
			{#each tabSet === 'played' ? playedSongs : unplayedSongs as request (request.id)}
				<div
					class="card variant-glass-surface p-4 flex justify-between w-full items-center rounded-lg"
					in:fade
				>
					<span class="font-bold block">{request.title}</span>
					<div class="flex space-x-2 items-baseline">
						<form
							method="POST"
							action="?/{tabSet === 'played' ? 'markAsUnplayed' : 'markAsPlayed'}"
							use:enhance
						>
							<input type="hidden" name="requestId" value={request.id} />
							<button
								class="btn-icon-sm variant-filled-success rounded-lg flex items-center justify-center"
							>
								{#if tabSet === 'played'}
									<ArrowLeftIcon class="w-5 h-5" />
								{:else}
									<CheckIcon class="w-5 h-5" />
								{/if}</button
							>
						</form>
						<form method="POST" action="?/remove">
							<input type="hidden" name="requestId" value={request.id} />
							<button
								title="Remove Request"
								class="btn-icon-sm variant-filled-error rounded-lg flex items-center justify-center"
								><TrashIcon class="w-5 h-5" /></button
							>
						</form>
						<button
							title="Remove and Block"
							class="btn-icon-sm variant-filled-warning rounded-lg flex items-center justify-center"
							on:click={() => onBlockClick(request.id)}><XCircleIcon class="w-5 h-5" /></button
						>
					</div>
				</div>
			{/each}
		</ul>
	</svelte:fragment>
</TabGroup>
