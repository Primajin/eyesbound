// Classic script (CSP: script-src 'self'). Registration is best effort: any failure leaves the site working without a worker.
if ('serviceWorker' in navigator && globalThis.isSecureContext) {
	navigator.serviceWorker.register('/sw.js', {scope: '/'}).catch(() => {});
}
