import { FC, useEffect, useState, useRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'

declare class TimestampTrigger {
	constructor(time: number)
}

const App: FC = () => {
	const [NotificationPermission, SetNotificationPermission] =
		useState<PermissionState>('prompt')

	const ServiceWorkerRegistrationRef = useRef<ServiceWorkerRegistration>()

	useEffect(() => {
		const func = async () => {
			const permissionStatus = await navigator.permissions.query({
				name: 'notifications',
			})

			SetNotificationPermission(permissionStatus.state)

			permissionStatus.addEventListener('change', () => {
				SetNotificationPermission(permissionStatus.state)
			})
		}

		func()
	}, [])

	const RequestNotificationPermission = async () => {
		if (Notification.permission === 'granted') return

		if (Notification.permission === 'denied') {
			alert('Permission already denied')

			return
		}

		const permission = await Notification.requestPermission()

		alert(`Permission ${permission}`)
	}

	const TestNotification = () => {
		new Notification('Test Notification', {
			body: 'Test Notification Body',
		})
	}

	const TestDelayedNotification = () => {
		// Enable
		// https://developer.chrome.com/docs/web-platform/notification-triggers/#enabling-via-aboutflags

		ServiceWorkerRegistrationRef.current?.showNotification('x', {
			showTrigger: new TimestampTrigger(Date.now() + 1 * 5000),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any)
	}

	useRegisterSW({
		onRegisteredSW(_, registration) {
			ServiceWorkerRegistrationRef.current = registration
		},
	})

	return (
		<div>
			<h1>React PWA Scheduled Notification</h1>
			<button onClick={RequestNotificationPermission}>
				Request Notification Permission
			</button>
			<p>Notification Permission {NotificationPermission}</p>

			<button onClick={TestNotification}>Test Notification</button>
			<button onClick={TestDelayedNotification}>
				Test Delayed Notification
			</button>
		</div>
	)
}

export default App
