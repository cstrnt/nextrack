<script lang="ts">
	export let username: string | undefined;
	export let image: string | undefined;
</script>

<img src={image} class="rounded-full w-32 h-32 border-4 border-surface-500" alt={username} />
<h1 class="text-xl font-bold mt-4">This is: {username?.toUpperCase()}</h1>
