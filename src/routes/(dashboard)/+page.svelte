<script lang="ts">
	import LoadingSpinner from '$lib/comp/LoadingSpinner.svelte';
	import { getDashboardData } from './dashboard.remote';

	let dashboardData = getDashboardData();
</script>

<div class="flex flex-col">
	<div class="flex flex-row items-center gap-2 pb-10 text-2xl font-semibold">Dashboard</div>
	<div class="flex flex-row gap-3">
		<div
			class="flex w-64 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-green-500 bg-slate-800 p-5"
		>
			<div class="text-lg font-bold">Devices</div>
			{#await dashboardData}
				<div class="text-3xl"><LoadingSpinner /></div>
			{:then data}
				<div class="text-3xl">{data.connectedDevices.length} / {data.devices.length}</div>
			{/await}
			<div class="">Online</div>
		</div>
	</div>
</div>

<style>
</style>
