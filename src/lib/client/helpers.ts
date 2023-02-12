import { page } from '$app/stores';
import { derived } from 'svelte/store';

export const isStreamView = derived(page, (s) => s.url.searchParams.get('view') === 'stream');
