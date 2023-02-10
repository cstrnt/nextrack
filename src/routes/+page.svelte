<script>
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { Avatar } from '@skeletonlabs/skeleton';
</script>

<h1>SvelteKit Auth Example</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<Avatar src={$page.data.session.user.image} />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</span>
		<button on:click={() => signOut()} class="btn variant-filled-primary">Sign out</button>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<button class="btn variant-filled-primary" on:click={() => signIn('google')}
			>Sign In with GitHub</button
		>
	{/if}
</p>
