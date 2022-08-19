import React from 'react'
import ReactDOM from 'react-dom/client'

import AuthProvider from './Globals/AuthContext'
import App from './App'
import '@fontsource/poppins'
import './index.css'
import { createEmotionCache, MantineProvider } from '@mantine/core'

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
