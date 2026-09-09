<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getDeviceData, getDeviceFreshness } from './display.remote';
	import { addToast } from '$lib/toast.svelte';
	import PlaylistDisplay from './PlaylistDisplay.svelte';

	let { params } = $props();
	let deviceId = $derived(Number(params.deviceId));

	// svelte-ignore state_referenced_locally
	let device = getDeviceData({ deviceId });
	let freshness: number;

	onMount(async () => {
		freshness = window.setInterval(async () => {
			if (device.ready) {
				const freshnessData = {
					deviceId,
					deviceFreshness: device.current.updated,
					playlistFreshness: device.current.playlist?.updated || 0
				};
        try {
          if (await getDeviceFreshness(freshnessData)) {
					device.refresh();
					addToast('success', 'Updated!');
				}
        } catch (e) {
					addToast('error', 'Failed to refresh data');
        }
				
			}
		}, 3000);
	});

	onDestroy(() => {
		clearInterval(freshness);
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
