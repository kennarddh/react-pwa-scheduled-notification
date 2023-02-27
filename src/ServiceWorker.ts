/* eslint-disable jest/require-hook */
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration'
import { StaleWhileRevalidate } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope
const wbManifest = self.__WB_MANIFEST

console.log('htllo', wbManifest)
precacheAndRoute(wbManifest)

self.skipWaiting()
clientsClaim()

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
	// Return false to exempt requests from being fulfilled by index.html.
	({ request, url }: { request: Request; url: URL }) => {
		// If this isn't a navigation, skip.
		if (request.mode !== 'navigate') return false

		// If this looks like a URL for a resource, because it contains
		// a file extension, skip.
		if (url.pathname.match(fileExtensionRegexp)) return false

		// Return true to signal that we want to use the handler.
		return true
	},
	createHandlerBoundToURL('index.html')
)

const imagesExtensionRegex = /.(ico|png|svg|jpeg)$/gi

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin resource requests like those from in public/
registerRoute(
	// Add in any other file extensions or routing criteria as needed.
	({ url }) =>
		url.origin === self.location.origin &&
		url.pathname.match(imagesExtensionRegex),
	// Customize this strategy as needed, e.g., by changing to CacheFirst.
	new StaleWhileRevalidate({
		cacheName: 'images',
		plugins: [
			// Ensure that once this runtime cache reaches a maximum size the
			// least-recently used images are removed.
			new ExpirationPlugin({ maxEntries: 50 }),
		],
	})
)
