<script>
	import { isStreamView } from '$lib/client/helpers';
</script>

<main
	class="container mx-auto flex flex-col items-center w-full {!$isStreamView &&
		'mt-8'} h-full overflow-hidden"
>
	<slot />
</main>
