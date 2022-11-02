import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import dynamicImport from 'vite-plugin-dynamic-import'

const srcDir = resolve(__dirname, 'src')
const pagesDir = resolve(srcDir, 'pages')

// https://vitejs.dev/config/
export default defineConfig(({command, mode})  => {
	return {
	resolve: {
		alias: {
			src: srcDir,
			'@': srcDir,
		},
	},
	envDir: 'src',
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
			onwarn: (warning, handler) => {
				const { code, frame } = warning
				if (code === "css-unused-selector")
					return

				handler(warning)
			},
		}),
		dynamicImport({
		}),

	],


	build: {
		rollupOptions: {
			input: {
				background: resolve(pagesDir, 'background', 'index.ts'),
				content: resolve(pagesDir, 'content', 'index.ts'),
				options: resolve(pagesDir, 'options', 'index.html'),
				popup: resolve(pagesDir, 'popup', 'index.html'),
			},
			output: {
				entryFileNames: chunk => `src/pages/${chunk.name}/index.js`,
			},

		},
	},
}
})
