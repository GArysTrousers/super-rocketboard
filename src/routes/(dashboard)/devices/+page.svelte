<script lang="ts">
	import Modal from '$lib/comp/Modal.svelte';
	import { addToast } from '$lib/toast.svelte';
	import {
		faArrowUpRightDots,
		faArrowUpRightFromSquare,
		faLink,
		faTrash
	} from '@fortawesome/free-solid-svg-icons';
	import {
		createDevice,
		getPlaylists,
		getDevices,
		updateDevice,
		removeDevice
	} from './devices.remote';
	import Fa from 'svelte-fa';

	const devices = getDevices();
	const playlists = getPlaylists();

	const newModal = $state({
		open: false,
		data: {
			name: '',
			ip: ''
		}
	});

	function openNewModal() {
		newModal.data.name = '';
		newModal.data.ip = '';
		newModal.open = true;
	}

	async function save() {
		await createDevice(newModal.data);
		devices.refresh();
		addToast('success', 'Device created');
		newModal.open = false;
	}

	async function update(device: Device) {
		await updateDevice(device);
		addToast('success', 'Device updated');
	}
</script>

<div class="flex w-full max-w-4xl flex-col gap-3">
	<div class="flex flex-row items-end justify-between">
		<div class="text-xl font-semibold">Devices</div>
		<div class="flex flex-row gap-3">
			<button class="btn bg-sky-700" onclick={openNewModal}>New</button>
		</div>
	</div>

	<div class="flex flex-col">
		<table class="table">
			<thead>
				<tr>
					<td>ID</td>
					<td>Name</td>
					<td>IP</td>
					<td>Playlist</td>
					<td>Open</td>
				</tr>
			</thead>
			<tbody>
				{#each await devices as d (d.deviceId)}
					<tr>
						<td>{d.deviceId}</td>
						<td><input class="w-full" bind:value={d.name} onchange={() => update(d)} /></td>
						<td><input class="w-full" bind:value={d.ip} onchange={() => update(d)} /></td>
						<td>
							<select class="input" bind:value={d.playlistId} onchange={() => update(d)}>
								<option value={null}>None</option>
								{#each await playlists as p (p.playlistId)}
									<option value={p.playlistId}>{p.name}</option>
								{/each}
							</select>
						</td>
						<td>
							<div class="flex flex-row gap-4 px-3">
								<a href="/device/{d.deviceId}"><Fa icon={faArrowUpRightFromSquare} /></a>
								<button
									onclick={async () => {
										await removeDevice({ deviceId: d.deviceId });
										devices.refresh();
                    addToast('info', 'Device deleted')
									}}><Fa icon={faTrash} /></button
								>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<Modal title="New Playlist" bind:open={newModal.open}>
	<div class="flex flex-col gap-3">
		<div class="flex flex-col gap-3">
			<input class="input" bind:value={newModal.data.name} placeholder="Device Name..." />
			<input class="input" bind:value={newModal.data.ip} placeholder="IP..." />
		</div>
		<div class="flex flex-row justify-end">
			<button class="btn bg-sky-700" onclick={save}>Create</button>
		</div>
	</div>
</Modal>

<style>
</style>
