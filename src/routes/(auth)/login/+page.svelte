<script lang="ts">
	import { addToast } from '$lib/toast.svelte';
	import Fa from 'svelte-fa';
  import '../../layout.css'
	import { login } from './login.remote';
	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

	let username = $state('');
	let password = $state('');

	async function attemptLogin() {
		if (await login({username, password})) {
      location.replace('/')
    } else {
      addToast('error', "Username or password incorrect")
    }
	}

	function keypressLogin(e: KeyboardEvent) {
		if (e.key == 'Enter') attemptLogin();
	}
</script>

<div class="fixed -z-10 h-screen w-screen bg-linear-to-br from-fuchsia-600 to-orange-300"></div>
<div class="flex h-screen flex-col items-center justify-center">
	<div class="px-10 py-12 bg-gray-800 border-2 border-gray-700 rounded-2xl">
		<div class="flex flex-col gap-3">
			<h1 class="pb-5 text-center text-2xl font-bold">Super Rocketboard</h1>
			<input class="input" bind:value={username} type="text" placeholder="Username" />
			<input class="input"
				bind:value={password}
				type="password"
				placeholder="Password"
				onkeypress={keypressLogin}
			/>
			<button class="btn bg-orange-500" onclick={attemptLogin}>Login <Fa icon={faArrowRight}/></button>
		</div>
	</div>
</div>

<style>
</style>
