import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Dynamically access the exposed 'send' function from preload
const send = (window as unknown as { [key: string]: ((channel: string, message: string) => Promise<unknown>) })[btoa('send')];

function App() {
  const [count, setCount] = useState(0)

  const handleRunPlaywrightTest = async () => {
    try {
      await send('run-playwright-test', '');
      alert('Playwright test started!');
    } catch (err) {
      alert('Failed to start Playwright test. ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button style={{ marginTop: 12 }} onClick={handleRunPlaywrightTest}>
          Run Playwright Test
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
