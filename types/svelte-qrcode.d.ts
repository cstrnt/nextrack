declare module 'svelte-qrcode' {
	import type { SvelteComponentTyped } from 'svelte';
	interface QRcodeProps {
		errorCorrection?: string,
		background?: string,
		color?: string,
		size?: string,
		value: string,
		padding?: string,
		className?: string,
	}
	export default class QrCode extends SvelteComponentTyped<QRcodeProps> {}
}
