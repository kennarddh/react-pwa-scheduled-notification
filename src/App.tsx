import { FC, useEffect, useState } from 'react'

const App: FC = () => {
	const [NotificationPermission, SetNotificationPermission] =
		useState<PermissionState>('prompt')

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

	return (
		<div>
			<h1>React PWA Scheduled Notification</h1>
			<button onClick={RequestNotificationPermission}>
				Request Notification Permission
			</button>
			<p>Notification Permission {NotificationPermission}</p>

			<button onClick={TestNotification}>Test Notification</button>
		</div>
	)
}

export default App
