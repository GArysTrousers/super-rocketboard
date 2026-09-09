<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	let result: null | string = $state(null);

	onMount(async () => {
		let res = await api<{ result: string }>('/logout');
		result = res.result;
	});
</script>

<div class="fixed -z-10 h-screen w-screen bg-linear-to-br from-fuchsia-600 to-orange-300"></div>
<div class="flex w-full flex-col items-center pt-5">
	<div>
		<div class="flex flex-col items-center">
			<div>{result}</div>
			<div>
				<a class="a" href="/login">Click Here to Login</a>
			</div>
		</div>
	</div>
</div>

<style>
</style>
