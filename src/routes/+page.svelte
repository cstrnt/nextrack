<script>
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { Avatar } from '@skeletonlabs/skeleton';
</script>

<h1 class="font-bold">Welcome to NexTrack</h1>
<p class="mt-4">
	NexTrack is an online Platform for Musicians, DJs and Radio Stations that want to be able to
	easily get song requests.
	<br />
	You can see an example here:
</p>
<iframe src={'/djr8der'} height="600" width="500" title="Preview" />
