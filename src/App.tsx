import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { InitialRoute, UserRoute } from './Routes'
import { Login, Register, Dashboard, NotFound, Records, Profile } from './Pages'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<InitialRoute />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/u" element={<UserRoute />}>
          <Route path="*" element={<NotFound />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
