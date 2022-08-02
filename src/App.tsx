import React from 'react'
import { Route, Routes } from 'react-router-dom'

// Components
import { Login, Register, Dashboard } from './Pages'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
