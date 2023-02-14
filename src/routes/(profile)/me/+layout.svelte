<script>
	import { PlayIcon, CogIcon } from '@rgossiaux/svelte-heroicons/solid';

	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
</script>

<main class="flex h-full">
	<AppRail class="h-full">
		<AppRailTile tag="a" href="/me/tracks">
			<div class="flex flex-col items-center">
				<PlayIcon class="w-8 h-8" />
				Songs
			</div>
		</AppRailTile>
		<AppRailTile tag="a" href="/me/settings">
			<div class="flex flex-col items-center">
				<CogIcon class="w-8 h-8" />
				Settings	
			</div></AppRailTile
		>
	</AppRail>
	<div class="flex-1 py-3 px-8 h-full overflow-y-auto">
		<slot />
	</div>
</main>
