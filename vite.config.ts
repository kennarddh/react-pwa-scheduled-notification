import { defineConfig, loadEnv, PluginOption } from 'vite'

// Plugin
import eslintPlugin from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

import { resolve } from 'path'

export const relativeAlias: Record<string, string> = {
	Components: './src/Components',
	Contexts: './src/Contexts',
	Utils: './src/Utils',
	Hooks: './src/Hooks',
	Constants: './src/Constants',
	Api: './src/Api',
}

export const resolveAlias = Object.entries(relativeAlias).reduce(
	(prev: Record<string, string>, [key, path]) => {
		// eslint-disable-next-line security/detect-object-injection
		prev[key] = resolve(__dirname, path)

		return prev
	},
	{}
)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const envPrefix: string[] = ['APP_']

	const { PORT = 3000, OPEN_BROWSER = 'true' } = {
		...loadEnv(mode, process.cwd(), ''),
	}

	const appEnv = loadEnv(mode, process.cwd(), envPrefix)

	const plugins: PluginOption[] = [
		mkcert(),
		react(),
		VitePWA({
			devOptions: {
				enabled: mode === 'development',
				type: 'module',
				navigateFallback: 'index.html',
			},
			registerType: 'autoUpdate',
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'ServiceWorker.ts',
			injectRegister: null,
			manifest: {
				name: 'React JS Boilerplate',
				short_name: 'React JS Boilerplate',
				theme_color: '#ffffff',
				display: 'standalone',
				description: 'My Awesome App description',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'mask-icon.png',
						sizes: '930x930',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
		}),
		svgr(),
	]

	if (mode === 'development') {
		plugins.push(
			eslintPlugin({
				exclude: ['/dev-sw.js', '/workbox-*.js'],
			})
		)
	}

	return {
		plugins,
		resolve: {
			alias: resolveAlias,
		},
		server: {
			port: PORT || 3000,
			open: OPEN_BROWSER === 'true' ? true : false,
			https: true,
		},
		envPrefix,
		build: {
			outDir: 'build',
		},
		define: {
			env: { ...appEnv },
		},
	}
})
