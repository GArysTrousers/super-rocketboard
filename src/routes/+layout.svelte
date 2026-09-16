<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import ToastManager from '$lib/comp/toasts/ToastManager.svelte';

	let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Super Rocketboard</title>
</svelte:head>
{@render children()}

<ToastManager></ToastManager>
