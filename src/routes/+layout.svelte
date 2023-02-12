<script>
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppBar, Modal, Toast } from '@skeletonlabs/skeleton';
	import { isStreamView } from '$lib/client/helpers';
	import { signIn } from '@auth/sveltekit/client';
</script>

<Modal rounded="rounded-md" />
<Toast rounded="rounded-md" />
{#if !$isStreamView}
	<AppBar gridColumns="grid-cols-2" slotTrail="place-content-end">
		<h3 class="font-bold">NexTrack</h3>
		<svelte:fragment slot="trail"
			><button on:click={() => signIn('google')} class="btn-sm rounded-md variant-filled-primary"
				>Get Requests</button
			></svelte:fragment
		>
	</AppBar>
{/if}
<main class="container mx-auto flex flex-col items-center w-full {!$isStreamView && 'mt-8'}">
	<slot />
</main>
