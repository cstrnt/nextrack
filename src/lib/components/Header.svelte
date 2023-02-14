<script>
	import { AppBar } from '@skeletonlabs/skeleton';
	import { isStreamView } from '$lib/client/helpers';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';

	const buttonClass = 'btn-sm rounded-md variant-filled-primary';
</script>

{#if !$isStreamView}
	<AppBar gridColumns="grid-cols-2" slotTrail="place-content-end">
		<h3 class="font-bold">NexTrack</h3>
		<svelte:fragment slot="trail"
			>{#if $page.data.session}
				<a href="/me" class={buttonClass}>Profile</a>
			{:else}
				<button on:click={() => signIn('google')} class={buttonClass}>Get Requests</button>{/if}
		</svelte:fragment>
	</AppBar>
{/if}
