import tailwindcss from '@tailwindcss/vite';
// import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import adapter from '@jesterkit/exe-sveltekit';
import adapter from './sveltekit-compile/index.ts'

export default defineConfig({
	build: {
		rollupOptions: {
			external: [/^node:/, "sharp"] // Marks all "node:" prefixed modules as external
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			experimental: {
				remoteFunctions: true
			},
			compilerOptions: {
				experimental: {
					async: true
				},
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// adapter: adapter()
			adapter: adapter({
				binaryName: 'super-rocketboard'
			})
		})
	]
});
