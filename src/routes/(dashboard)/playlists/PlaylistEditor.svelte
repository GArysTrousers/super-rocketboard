<script lang="ts">
	import Modal from '$lib/comp/Modal.svelte';
	import { addToast } from '$lib/toast.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import ImageUploader from './ImageUploader.svelte';
	import {
		getPlaylistImages,
		removeImageFromPlaylist,
		removePlaylist,
		setPlaylistPositions
	} from './playlists.remote';
	import { flip } from 'svelte/animate';
	import Fa from 'svelte-fa';
	import {
		faImages,
		faMultiply,
		faTrash,
	} from '@fortawesome/free-solid-svg-icons';

	let {
		playlist = $bindable(),
		onPlaylistDeleted = () => {}
	}: { playlist: Playlist; onPlaylistDeleted: () => void } = $props();

	const images = $derived(getPlaylistImages({ playlistId: playlist.playlistId }));

	const imageUploader = $state({
		open: false
	});

	let items = $derived(images.current?.map((v) => ({ ...v, id: v.imageId })) || []);

	function handleDndConsider(e: any) {
		items = e.detail.items;
	}
	async function handleDndFinalize(e: any) {
		items = e.detail.items;
		await setPlaylistPositions({ playlistId: playlist.playlistId, imageIds: items.map((v) => v.imageId) });
		addToast('success', 'Order updated');
		images.refresh();
	}
</script>

<div class="flex flex-col gap-3">
	<div class="text-2xl font-semibold">{playlist.name}</div>
	<div class="flex flex-row justify-between">
		<div class="flex flex-row">
			<button class="btn bg-sky-700" onclick={() => (imageUploader.open = true)}
				><Fa icon={faImages} /> Upload</button
			>
		</div>
		<div class="flex flex-row">
			<button
				class="btn bg-slate-700"
				onclick={async () => {
					await removePlaylist({ playlistId: playlist.playlistId });
					addToast('info', 'Playlist deleted');
					onPlaylistDeleted();
				}}><Fa icon={faTrash} /> Delete Playlist</button
			>
		</div>
	</div>
	<div
		class="flex flex-wrap gap-2"
		use:dndzone={{ items, flipDurationMs: 300 }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as image (image.id)}
			<div
				class="image-tile flex aspect-square w-32 flex-row items-start justify-end p-1 lg:w-42"
				animate:flip={{ duration: 300 }}
				style="background-image: url('/content/img/{image.sm}');"
			>
				<button
					class="delete-button hidden h-6 w-6 flex-row items-center justify-center rounded-full border border-black bg-white text-black opacity-80"
					onclick={async () => {
						await removeImageFromPlaylist({ imageId: image.imageId });
						images.refresh();
						addToast('info', 'Image removed');
					}}><Fa icon={faMultiply} /></button
				>
			</div>
		{/each}
	</div>
</div>

<Modal bind:open={imageUploader.open} title="Image Uploader">
	<ImageUploader
		playlistId={playlist.playlistId}
		onUploadFinished={() => {
			addToast('success', 'Images added');
			imageUploader.open = false;
			images.refresh();
		}}
	></ImageUploader>
</Modal>

<style>
	.image-tile {
		background-position: 50%;
		background-size: cover;
	}
	.image-tile:hover .delete-button {
		display: flex;
	}
</style>
