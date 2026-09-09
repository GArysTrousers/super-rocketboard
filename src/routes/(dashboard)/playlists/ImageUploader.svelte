<script lang="ts">
	import { loadFiles, type ImageUploadData } from '$lib/client-files';
	import { addImageToPlaylist } from './playlists.remote';

	let {
		onUploadPressed = uploadImages,
		onUploadFinished = (newImages: number[]) => {},
		playlistId
	}: {
		onUploadPressed?: (images: ImageUploadData[], playlistId: number) => Promise<number[]>;
		onUploadFinished?: (newImages: number[]) => void;
		playlistId: null | number;
	} = $props();

	let files: FileList | undefined = $state(undefined);
	let filesData: ImageUploadData[] = $state([]);
	let loading = $state(false);
	let uploading = $state({
		state: false,
		progress: 0,
		total: 0
	});

	$effect(() => {
		if (files !== undefined) load(files);
	});

	async function load(filesList: FileList) {
		loading = true;
		filesData = await loadFiles(filesList);
		loading = false;
	}

	async function uploadImages(images: ImageUploadData[], playlistId: number) {
		uploading.state = true;
		uploading.total = images.length;
		uploading.progress = 0;
		const newIds = [];
		for (const i of images) {
			newIds.push(await addImageToPlaylist({ imageData: i.data, playlistId: playlistId }));
			uploading.progress += 1;
		}
		uploading.state = false;
		return newIds;
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-row gap-2">
		<input type="file" multiple bind:files class="input w-full" />
		<button
			class="btn w-32 bg-sky-700"
			disabled={uploading.state || files === undefined || files.length === 0}
			onclick={async () => {
				if (playlistId === null) return;
				const newIds = await onUploadPressed(filesData, playlistId);
				onUploadFinished(newIds);
			}}
		>
			Upload
		</button>
	</div>

	{#if uploading.state}
		<div
			class="grid h-8 w-full grid-cols-1 grid-rows-1 overflow-hidden rounded-lg border-2 border-slate-200"
		>
			<div
				class="z-0 col-start-1 row-start-1 bg-sky-600"
				style="width: {(100 * uploading.progress) / uploading.total}%"
			></div>
			<div
				class="z-10 col-start-1 row-start-1 flex w-full flex-col items-center justify-center text-slate-200"
			>
				({((100 * uploading.progress) / uploading.total).toFixed(0)}%) Uploading...
			</div>
		</div>
	{/if}

	{#if filesData && uploading.state === false}
		<div class="flex flex-wrap gap-2">
			{#each filesData as file (file)}
				<img src={file.data} alt="" class="h-24 w-24 rounded-lg" />
			{/each}
		</div>
	{/if}
</div>

<style>
</style>
