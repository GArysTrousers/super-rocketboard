<script lang="ts">
	import Modal from '$lib/comp/Modal.svelte';
	import { addToast } from '$lib/toast.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import PlaylistEditor from './PlaylistEditor.svelte';
	import { createPlaylist, getPlaylists } from './playlists.remote';
	import Fa from 'svelte-fa';

	let selectedPlaylist: Playlist | null = $state(null);

	const playlists = getPlaylists();

	$effect(() => {
		if (playlists.current.length > 0) selectedPlaylist = playlists.current[0];
	});

	const newModal = $state({
		open: false,
		data: {
			name: ''
		}
	});

	function openNewModal() {
		newModal.data.name = '';
		newModal.open = true;
	}

	async function save() {
		await createPlaylist(newModal.data);
		playlists.refresh();
		addToast('success', 'Playlist created');
		newModal.open = false;
	}
</script>

<div class="flex w-full max-w-7xl flex-col gap-3">
	<div class="flex flex-row items-end justify-between">
		<div class="text-xl font-semibold">Playlists</div>
		<div class="flex flex-row gap-3"></div>
	</div>

	<div class="flex flex-row gap-3">
		<div class="flex w-64 flex-col gap-3">
			<div class="flex flex-col gap-1 rounded bg-slate-800 p-2">
				{#each await playlists as p (p.playlistId)}
					<button
						onclick={() => {
							selectedPlaylist = p;
						}}
						class="cursor-pointer px-3 py-1 text-left {selectedPlaylist !== null &&
						selectedPlaylist.playlistId === p.playlistId
							? 'rounded bg-sky-700 font-semibold'
							: ''}"
					>
						{p.name}
					</button>
				{/each}
			</div>
			<button class="btn mx-2 bg-slate-700 text-sm" onclick={openNewModal}
				><Fa icon={faPlus} />New</button
			>
		</div>

		<div class="flex w-full flex-col">
			{#if selectedPlaylist !== null}
				<PlaylistEditor
					bind:playlist={selectedPlaylist}
					onPlaylistDeleted={() => {
						playlists.refresh();
					}}
				></PlaylistEditor>
			{:else}
				<div class="text-gray-400 italic">Select a playlist to edit</div>
			{/if}
		</div>
	</div>
</div>

<Modal title="New Playlist" bind:open={newModal.open}>
	<div class="flex flex-col gap-3">
		<div class="flex flex-col gap-3">
			<input class="input" bind:value={newModal.data.name} placeholder="Playlist Name..." />
		</div>
		<div class="flex flex-row justify-end">
			<button class="btn bg-sky-700" onclick={save}>Create</button>
		</div>
	</div>
</Modal>

<style>
</style>
