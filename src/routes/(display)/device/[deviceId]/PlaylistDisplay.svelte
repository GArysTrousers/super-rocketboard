<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { DeviceData } from './display.remote';
	import dayjs from 'dayjs';

	let { deviceData }: { deviceData: DeviceData } = $props();

	let curIndex = $state(0);
	let curTime = $state('');
	let curDate = $state('');
	let nextSlideTimer: number;
	let timeTimer: number;

	$effect(() => {
		if (nextSlideTimer === undefined) clearInterval(nextSlideTimer);
		nextSlideTimer = window.setInterval(() => {
			if (deviceData.playlist === null) return;
			if (deviceData.playlist.images.length < 1) return;
			curIndex = curIndex + 1;
			if (curIndex >= deviceData.playlist.images.length) {
				curIndex = 0;
			}
		}, deviceData.secondsPerSlide * 1000);
	});

	onMount(() => {
		updateDateTime();
		timeTimer = window.setInterval(updateDateTime, 5000);
	});

	onDestroy(() => {
		clearInterval(nextSlideTimer);
		clearInterval(timeTimer);
	});

	function updateDateTime() {
		curTime = dayjs().format('hh:mma');
		curDate = dayjs().format('DD MMM YYYY');
	}
</script>

<div class="grid h-screen w-screen grid-cols-1 bg-black">
	{#if deviceData.playlist && deviceData.playlist.images.length > 0}
		{#each deviceData.playlist.images as image, i (image.imageId)}
			{#if curIndex == i}
				<div
					class="div-image z-0 col-start-1 row-start-1 bg-black"
					in:fly={{ x: 20, y: 0, duration: 600 }}
					out:fly={{ x: -20, y: 0, duration: 600 }}
					style={`background-image: url(/content/img/${image.lg}`}
				></div>
				{#if deviceData.showTime}
					<div class="sr-shadow z-0 col-start-1 row-start-1 m-8 flex flex-col justify-end">
						<div class="sr-time font-bold">{curTime}</div>
						<div class="sr-date text-4xl font-semibold text-neutral-300">{curDate}</div>
					</div>
				{/if}
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

	.sr-shadow {
		text-shadow:
			-0.2rem 0 0.7rem black,
			0.2rem 0 0.7rem black,
			0 -0.2rem 0.7rem black,
			0 0.2rem 0.7rem black;
	}

	:root {
		--time-text-min: 1.8rem;
		--time-text-scale: 3vw;
		--time-text-max: 6rem;
		--date-text-min: calc(var(--time-text-min) * 0.65);
		--date-text-scale: calc(var(--time-text-scale) * 0.65);
		--date-text-max: calc(var(--time-text-max) * 0.65);
	}

	.sr-time {
		font-size: clamp(var(--time-text-min), var(--time-text-scale), var(--time-text-max));
	}
	.sr-date {
		font-size: clamp(var(--date-text-min), var(--date-text-scale), var(--date-text-max));
	}
</style>
