<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Hello there!</h1>
<form method="POST" class="space-y-5" use:enhance>
	<label class="label">
		<span>Please enter your username</span>
		<input type="text" name="username" class="input" class:input-error={form?.message} />
		{#if form?.message}
			<p class="text-red-500 text-sm">{form.message}</p>
		{/if}
	</label>
	<button class="btn variant-filled-primary">Sign Up</button>
</form>
