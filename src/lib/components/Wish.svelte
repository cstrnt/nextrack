<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SongRequestDTO } from '$lib/server/RequestService';

	import { ArrowUpIcon } from '@rgossiaux/svelte-heroicons/solid';

	export let wish: SongRequestDTO;
	export let isStream = false;
	export let isUpvoted = false;
</script>

<div class="card variant-glass-surface p-4 flex justify-between w-full items-center rounded-lg">
	<span class="{isStream ? 'text-3xl' : 'text-lg'} font-bold">{wish.title}</span>
	<form method="POST" action="?/vote" use:enhance>
		<input type="hidden" name="requestId" value={wish.id} />
		<button
			title={isUpvoted ? 'Remove your Vote' : 'Vote for this Track'}
			class="btn p-2 rounded-lg transition-all duration-200 ease-in-out {isUpvoted
				? 'variant-filled-primary'
				: 'variant-filled-secondary'}"
		>
			<span>{wish.votes.length}</span>
			<span class="w-5 h-5">
				<ArrowUpIcon />
			</span>
		</button>
	</form>
</div>
