import { FC, useState } from 'react'
import ReloadPrompt from './ReloadPrompt'

const App: FC = () => {
	const [count, setCount] = useState(0)

	return (
		<main className='App'>
			<img src='favicon.ico' alt='PWA Logo' width='60' height='60' />
			<h1 className='App-title'>PWA React!</h1>
			<p>
				<button
					type='button'
					onClick={() => setCount(count => count + 1)}
				>
					count is: {count}
				</button>
			</p>
			<ReloadPrompt />
		</main>
	)
}

export default App
