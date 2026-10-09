<script lang="ts">
	import { faCheck } from '@fortawesome/free-solid-svg-icons';
	import type { Snippet } from 'svelte';
	import Fa from 'svelte-fa';

	let { checked = $bindable(), children }: { checked: number; children?: Snippet } = $props();

  function toggleChecked() {
    checked = Number(!checked)
  }
</script>

<button class="flex flex-row gap-2" onclick={toggleChecked}>
	<div
		class="flex h-7 w-7 flex-row items-center justify-center rounded-lg border-2 border-white text-white bg-slate-800 hover:brightness-125 active:brightness-90"
	>
		{#if !!checked}
			<Fa icon={faCheck} />
		{/if}
	</div>
	{#if children}
		<div>{@render children()}</div>
	{/if}
</button>

<style>
</style>
