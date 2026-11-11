import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/base.css'
import './styles/atmosphere.css'
import App from './App.jsx'
import { bootApp } from './lib/boot.js'

const boot = bootApp()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App boot={boot} />
  </StrictMode>,
)
