<script>
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { Modal, Toast } from '@skeletonlabs/skeleton';
	import { isStreamView } from '$lib/client/helpers';
</script>

<Modal rounded="rounded-md" />
<Toast rounded="rounded-md" />
<main class="container mx-auto flex flex-col items-center w-full {!$isStreamView && 'mt-8'}">
	<slot />
</main>
