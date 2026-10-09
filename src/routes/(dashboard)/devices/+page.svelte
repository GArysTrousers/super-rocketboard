<script lang="ts">
	import Modal from '$lib/comp/Modal.svelte';
	import { addToast } from '$lib/toast.svelte';
	import { faArrowUpRightFromSquare, faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
	import {
		createDevice,
		getPlaylists,
		getDevices,
		updateDevice,
		removeDevice
	} from './devices.remote';
	import Fa from 'svelte-fa';
	import Checkbox from '$lib/comp/Checkbox.svelte';

	const devices = getDevices();
	const playlists = getPlaylists();

	const newModal = $state({
		open: false,
		data: {
			name: '',
			ip: ''
		},
		openModal: () => {
			newModal.data.name = '';
			newModal.data.ip = '';
			newModal.open = true;
		},
		saveDevice: async () => {
			await createDevice(newModal.data);
			devices.refresh();
			addToast('success', 'Device created');
			newModal.open = false;
		}
	});

	const editModal: {
		open: boolean;
		data: { device: Device | null };
		openModal: (device: Device) => void;
		updateDevice: (device: Device | null) => Promise<void>;
	} = $state({
		open: false,
		data: {
			device: null
		},
		openModal: (device: Device) => {
			editModal.data.device = device;
			editModal.open = true;
		},
		updateDevice: async (device: Device | null) => {
			if (device === null) return;
			await update(device);
			devices.refresh();
			editModal.open = false;
		}
	});

	async function update(device: Device) {
		await updateDevice(device);
		addToast('success', 'Device updated');
	}
</script>

<div class="flex w-full max-w-4xl flex-col gap-3">
	<div class="flex flex-row items-end justify-between pb-7">
		<div class="flex flex-row items-center gap-2 text-2xl font-semibold">Devices</div>
		<div class="flex flex-row gap-3">
			<button class="btn bg-sky-700" onclick={newModal.openModal}>New</button>
		</div>
	</div>

	<div class="flex flex-col">
		<table class="table w-full">
			<thead>
				<tr class="font-bold">
					<td>ID</td>
					<td>Name</td>
					<td>IP</td>
					<td>Playlist</td>
					<td class="w-0">Actions</td>
				</tr>
			</thead>
			<tbody>
				{#each await devices as d (d.deviceId)}
					<tr>
						<td>{d.deviceId}</td>
						<td>{d.name}</td>
						<td>{d.ip}</td>
						<td>
							<select class="input" bind:value={d.playlistId} onchange={() => update(d)}>
								<option value={null}>None</option>
								{#each await playlists as p (p.playlistId)}
									<option value={p.playlistId}>{p.name}</option>
								{/each}
							</select>
						</td>
						<td>
							<div class="flex flex-row gap-4 px-3 w-0">
								<a href="/device/{d.deviceId}" title="Open Display Page" target="_blank"
									><Fa icon={faArrowUpRightFromSquare} /></a
								>

								<button
									class=""
									title="Edit Device"
									onclick={() => {
										editModal.openModal(d);
									}}><Fa icon={faCog} /></button
								>

								<button
									class="transition-colors hover:text-red-500"
									title="Delete Device"
									onclick={async () => {
										await removeDevice({ deviceId: d.deviceId });
										devices.refresh();
										addToast('info', 'Device deleted');
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

<Modal title="New Device" bind:open={newModal.open}>
	<div class="flex flex-col gap-3">
		<div class="flex flex-col gap-3">
			<input class="input" bind:value={newModal.data.name} placeholder="Device Name..." />
			<input class="input" bind:value={newModal.data.ip} placeholder="IP..." />
		</div>
		<div class="flex flex-row justify-end">
			<button class="btn bg-sky-700" onclick={newModal.saveDevice}>Create</button>
		</div>
	</div>
</Modal>

<Modal title="Edit Device" bind:open={editModal.open}>
	{#if editModal.data.device !== null}
		<div class="flex flex-col gap-3">
			<div class="flex flex-col gap-3">
				<table class="table-edit-modal">
					<tbody>
          <tr>
							<td>ID</td>
							<td>
								{editModal.data.device.deviceId}
							</td>
						</tr>
						<tr>
							<td>Name</td>
							<td>
								<input class="input" bind:value={editModal.data.device.name} />
							</td>
						</tr>
						<tr>
							<td>IP Address</td>
							<td>
								<input class="input" bind:value={editModal.data.device.ip} />
							</td>
						</tr>
						<tr>
							<td>Seconds Per Slide</td>
							<td>
								<input
									class="input"
									type="number"
									bind:value={editModal.data.device.secondsPerSlide}
								/>
							</td>
						</tr>
						<tr>
							<td>Display Time</td>
							<td>
								<Checkbox bind:checked={editModal.data.device.showTime}></Checkbox>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="flex flex-row justify-end">
				<button class="btn bg-sky-700" onclick={() => editModal.updateDevice(editModal.data.device)}
					>Save</button
				>
			</div>
		</div>
	{/if}
</Modal>

<style>
	.table-edit-modal td {
		padding: 4px 8px;
	}
</style>
