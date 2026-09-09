<script lang="ts">
	import { toasts } from '$lib/toast.svelte';
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
	import { fly } from 'svelte/transition';

</script>

<div class="fixed right-0 bottom-0 flex flex-col gap-3 p-3 w-full max-w-xs" style="z-index: 100;">
	{#each toasts as toast (toast.id)}
		<div animate:flip={{ duration: 500 }} transition:fly={{ x: 200 }}>
			<Toast {toast}></Toast>
		</div>
	{/each}
</div>

<style>
</style>
