<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getDeviceData } from './display.remote';
	import { addToast } from '$lib/toast.svelte';
	import PlaylistDisplay from './PlaylistDisplay.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { source } from 'sveltekit-sse';
	import LoadingSpinner from '$lib/comp/LoadingSpinner.svelte';

	let { params } = $props();
	let deviceId = $derived(Number(params.deviceId));

	// svelte-ignore state_referenced_locally
	let device = getDeviceData({ deviceId });

	let eventUnsub: Unsubscriber | undefined;
	// let reconnectTimer: number | undefined;

	onMount(async () => {
		const connection = source(`/device/${deviceId}/events`, {
			onclose({ connect }) {
				// reconnectTimer = window.setInterval(connect, 3000);
        setTimeout(connect, 3000)
        console.log('onclose triggered');
        addToast('error', "Reconnecting...")
			}
		});

		const select = connection.select('update')
    eventUnsub = select.subscribe((v) => {
			try {
				let data = JSON.parse(v);
				device.refresh();
				addToast('success', 'Updated!');
			} catch (e) {}
		});
	});
	onDestroy(() => {
		if (eventUnsub) eventUnsub();
	});
</script>

{#await device}
	<div class="flex h-screen w-screen flex-row items-center justify-center text-5xl">
		<LoadingSpinner />
	</div>
{:then}
	{#if device.ready && device.current.playlist !== null}
		<PlaylistDisplay deviceData={device.current}></PlaylistDisplay>
	{/if}
{/await}

<style>
</style>
