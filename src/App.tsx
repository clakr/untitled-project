import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Route
import { InitialRoute, UserRoute } from './Routes'

// Components
import { Login, Register, Dashboard } from './Pages'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<InitialRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
