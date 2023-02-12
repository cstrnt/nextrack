<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData, PageData } from './$types';
	import { ArrowLeftIcon } from '@rgossiaux/svelte-heroicons/solid';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

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
</script>

<a
	href="/{$page.params.userHandle}"
	class="btn-icon-sm variant-soft-primary w-8 h-8 self-start !text-white !bg-transparent"
>
	<ArrowLeftIcon />
</a>
<h1 class="font-bold">Request a Song for {data.user?.username}</h1>
<form method="POST" class="max-w-xl w-full mt-5 space-y-4" use:enhance>
	<label class="label">
		<span>Songname</span>
		<input
			class="input"
			type="text"
			name="song"
			placeholder="Sandstorm"
			class:input-error={form?.song}
			value={form?.song?.value ?? ''}
		/>
		{#if form?.song}
			<p class="text-red-500 text-sm">Required</p>
		{/if}
	</label>
	<label class="label">
		<span>Artist</span>
		<input
			class="input"
			type="text"
			name="artist"
			placeholder="Darude"
			class:input-error={form?.artist}
			value={form?.artist?.value ?? ''}
		/>
		{#if form?.artist}
			<p class="text-red-500 text-sm">Required</p>
		{/if}
	</label>
	<label class="label">
		<span>Link (optional)</span>
		<input
			class="input"
			type="url"
			name="link"
			placeholder="https://youtu.be/dQw4w9WgXcQ"
			class:input-error={form?.link}
			value={form?.link?.value ?? ''}
		/>
		{#if form?.link}
			<p class="text-red-500 text-sm">{form.link.message}</p>
		{/if}
	</label>
	<button type="submit" class="btn variant-filled-primary">Request Song</button>
</form>
