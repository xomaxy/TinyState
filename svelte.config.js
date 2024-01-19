import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
			adapter: adapter({
				fallback: '404.html'
			}),
			paths: {
				base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
			},
			alias: {
				$D3: "src/lib/d3",
				$data: "src/data",
			},
		},
	preprocess: vitePreprocess()
};

console.log(JSON.stringify(config));
export default config;