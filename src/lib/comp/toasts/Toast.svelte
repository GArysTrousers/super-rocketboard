<script lang="ts">
	import { removeToast, type Toast } from '$lib/toast.svelte';
	import { faCheck, faInfo, faWarning } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { toast }: { toast: Toast; } = $props();
	const styles = {
		success: {
			body: 'border-green-600 bg-green-200 text-green-700',
			icon: faCheck
		},
		error: {
			body: 'border-red-600 bg-red-200 text-red-700',
			icon: faWarning
		},
		info: {
			body: 'border-blue-600 bg-blue-200 text-blue-700',
			icon: faInfo
		}
	};
</script>

<button
	class="flex flex-row items-center gap-2 rounded-xl border px-4 py-3 whitespace-nowrap w-full {styles[
		toast.type
	].body}"
	onclick={() => toast.onClick(toast.id)}
>
	<div class="rounded-lg bg-white p-2 w-8 h-8 flex flex-col items-center justify-center"><Fa icon={styles[toast.type].icon} /></div>
	<div>{toast.body}</div>
</button>

<style>
</style>
