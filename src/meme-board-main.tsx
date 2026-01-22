import React from 'react'
import ReactDOM from 'react-dom/client'
import StandaloneApp from './app/StandaloneApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StandaloneApp
      router='memory'
      initialEntries={['/accelerator/meme-board']}
    />
  </React.StrictMode>
)
