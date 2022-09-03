import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { sass } from 'svelte-preprocess-sass';
import AutoImport from 'unplugin-auto-import/vite';

const srcDir = resolve(__dirname, 'src');
const pagesDir = resolve(srcDir, 'pages');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: srcDir,
    },
  },
  plugins: [
    svelte({
        preprocess: {
            style: sass(
				{
					includePaths: ['src'],
				},
				{
					name: 'sass',
					// this is the important part
					// it will be used to match the lang="scss" attribute
					// in your Svelte components
					// you can use any name you want
					lang: 'sass',
				}
			),
        },
        compilerOptions: {
            dev: true,
        },
    }),
    AutoImport({
      imports: [
        {
          'webextension-polyfill': [
            ['*', 'browser'],
          ],
        },
      ],
      dts: resolve('src/auto-imports.d.ts'),
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        background: resolve(pagesDir, 'background', 'index.ts'),
        content: resolve(pagesDir, 'content', 'index.ts',),
        options: resolve(pagesDir, 'options', 'index.html'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
    },
  },
});
