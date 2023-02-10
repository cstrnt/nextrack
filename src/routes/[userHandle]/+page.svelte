<script lang="ts">
	export let data: import('./$types').PageData;
	export let form: import('./$types').ActionData;
</script>

<h1>{data.username}</h1>

{#if data.isAcceptingWishes}
	<p>Accepting wishes</p>
{:else}
	<p>Not accepting wishes</p>
{/if}

{#if data.isAcceptingWishes}
	<form method="POST" action="?/createWish">
		<label>
			Songname
			<input type="text" name="song" />
		</label>
		<label>
			Artist
			<input type="text" name="artist" />
		</label>
		<label>
			Link (optional)
			<input type="text" name="link" />
		</label>
		<button type="submit">Add wish</button>
	</form>
	{#if data.wishes.length}
		<ul>
			{#each data.wishes as wish}
				<li>{wish.title} | {wish.votes} Votes</li>
				<form method="POST" action="?/vote">
					<input type="hidden" name="wishId" value={wish.id} />
					<button>
						{#if wish.hasUpvoted}
							DOWNVOTE
						{:else}
							UPVOTE
						{/if}
					</button>
				</form>
			{/each}
		</ul>
	{:else}
		<p>No wishes yet</p>
	{/if}
{/if}
