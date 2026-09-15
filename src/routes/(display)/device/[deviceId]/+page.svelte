<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getDeviceData } from './display.remote';
	import { addToast } from '$lib/toast.svelte';
	import PlaylistDisplay from './PlaylistDisplay.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { source } from 'sveltekit-sse';

	let { params } = $props();
	let deviceId = $derived(Number(params.deviceId));

	// svelte-ignore state_referenced_locally
	let device = getDeviceData({ deviceId });

	let eventUnsub: Unsubscriber | undefined;

	onMount(async () => {
		// notificationAudio = new Audio('/audio/notification01.mp3');
		eventUnsub = source(`/device/${deviceId}/events`)
			.select('update')
			.subscribe((v) => {
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
	<div class="">Loading...</div>
{:then}
	{#if device.ready && device.current.playlist !== null}
		<PlaylistDisplay playlist={device.current.playlist}></PlaylistDisplay>
	{/if}
{/await}

<style>
</style>
