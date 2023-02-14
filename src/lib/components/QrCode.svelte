<script>
import QrCode from "svelte-qrcode"

export const qrCodeData = 'https://nextrack.vercel.app/';
</script>

<div class="container">
    <QrCode value={qrCodeData} />
</div>