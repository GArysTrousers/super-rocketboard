<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getDeviceData } from '../display.remote';
	import { addToast } from '$lib/toast.svelte';
	import PlaylistDisplay from '../PlaylistDisplay.svelte';
	import LoadingSpinner from '$lib/comp/LoadingSpinner.svelte';

	let { params } = $props();
	let deviceId = $derived(Number(params.deviceId));

	// svelte-ignore state_referenced_locally
	let device = $state(await getDeviceData({ deviceId }));

  let refreshTimer: number | undefined;

	onMount(async () => {
		refreshTimer = window.setInterval(async () => {
      let newDeviceData = await getDeviceData({ deviceId, rng: Math.random() })
      if (JSON.stringify(device) !== JSON.stringify(newDeviceData)) {
				addToast('success', 'Updated!');
        device = newDeviceData
      }
    }, 10000)
	});

	onDestroy(() => {
		clearInterval(refreshTimer)
	});
</script>

{#await device}
	<div class="flex h-screen w-screen flex-row items-center justify-center text-5xl">
		<LoadingSpinner />
	</div>
{:then}
	{#if device && device.playlist !== null}
		<PlaylistDisplay deviceData={device}></PlaylistDisplay>
	{/if}
{/await}

<style>
</style>
