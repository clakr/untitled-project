import React from 'react'
import ReactDOM from 'react-dom/client'
import { createEmotionCache, MantineProvider } from '@mantine/core'
import '@fontsource/poppins'

import AuthProvider from './Globals/AuthContext'
import App from './App'
import './index.css'

const cache = createEmotionCache({ key: 'mantine', prepend: false })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <MantineProvider emotionCache={cache}>
        <App />
      </MantineProvider>
    </AuthProvider>
  </React.StrictMode>
)
