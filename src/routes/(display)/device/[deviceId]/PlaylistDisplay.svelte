<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { PlaylistWithImages } from './display.remote';

	let { playlist }: { playlist: PlaylistWithImages } = $props();

	let curIndex = $state(0);
	let nextSlideTimer: number;

	onMount(async () => {
		nextSlideTimer = window.setInterval(() => {
			if (playlist.images.length < 1) return;
			curIndex = curIndex + 1;
			if (curIndex >= playlist.images.length) {
				curIndex = 0;
			}
		}, 8000);
	});

	onDestroy(() => {
		clearInterval(nextSlideTimer);
	});
</script>

<div class="h-screen w-screen bg-black">
	{#if playlist && playlist.images.length > 0}
		{#each playlist.images as image, i (image.imageId)}
			{#if curIndex == i}
				<div
					class="div-image bg-black"
					in:fly={{ x: 20, y: 0, duration: 500 }}
					out:fly={{ x: -20, y: 0, duration: 500 }}
					style={`background-image: url(/content/img/${image.lg}`}
				></div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.div-image {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-position: 50% 50%;
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>
