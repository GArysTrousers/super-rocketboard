<script lang="ts">
	import { page } from '$app/state';
	import { faDoorOpen, faHome, faImages, faTelevision } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { children } = $props();

	const menuItems = [
		{
			label: 'Home',
			url: '/',
			icon: faHome
		},
		{
			label: 'Playlists',
			url: '/playlists',
			icon: faImages
		},
		{
			label: 'Devices',
			url: '/devices',
			icon: faTelevision
		}
	];
</script>

<div class="flex flex-row gap-3">
	<div class="fixed flex flex-col justify-between h-screen bg-slate-700 px-3 pt-5">
		<div class="flex w-80 flex-col gap-4">
			<div class="px-3 py-3 text-2xl font-bold">Super Rocketboard</div>
			<div class="flex flex-col gap-2">
				{#each menuItems as item (item.label)}
					<a
						class="flex w-full flex-row items-center gap-3 rounded-lg px-3 py-2 {page.url
							.pathname === item.url
							? 'bg-sky-700'
							: 'bg-slate-700 hover:bg-slate-800'}"
						href={item.url}
					>
						<Fa icon={item.icon} />
						<div>{item.label}</div>
					</a>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-3 py-3">
			<a class="flex w-full flex-row items-center gap-3 rounded-lg px-3 py-2 bg-slate-700 hover:bg-slate-800" href="/logout">
				<Fa icon={faDoorOpen} />
				<div>Logout</div>
			</a>
		</div>
	</div>
	<div class="ml-80 flex w-full flex-col px-7 py-5">
		{@render children()}
	</div>
</div>

<style>
</style>
