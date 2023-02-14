<script>
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Modal, Toast } from '@skeletonlabs/skeleton';

	import Header from '$lib/components/Header.svelte';
</script>

<Modal rounded="rounded-md" />
<Toast rounded="rounded-md" />
<div class="flex flex-col h-screen">
	<Header />
	<main class="flex-1 h-full overflow-hidden">
		<slot />
	</main>
</div>
