<script lang="ts">
	import type { Snippet } from 'svelte';
	type ModelSize = 'w-xs' | 'w-sm' | 'w-md' | 'w-lg' | 'w-xl' | 'w-2xl';

	let {
		open = $bindable(),
		title,
		children,
		size = 'w-lg'
	}: { open: boolean; title: string; children: Snippet; size?: ModelSize } = $props();

	async function closeModal() {
		open = false;
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed top-0 left-0 {size} flex h-screen w-screen flex-col items-center justify-start p-5"
		style="background-color: #0008;"
		onclick={closeModal}
	>
		<div
			class="flex w-lg flex-col gap-2 rounded-xl border-2 border-gray-700 bg-gray-800 px-3 py-4"
			onclick={(e) => {
				e.stopPropagation();
			}}
		>
			<div class="flex flex-row items-start justify-between border-b border-gray-700 py-1">
				<div class="text-lg">{title}</div>
				<button class="mx-3 -mt-2 pb-3 text-3xl" onclick={closeModal}>&times;</button>
			</div>
			<div class="">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
</style>
