import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../Globals/AuthContext'
import { useUserContext } from '../../Routes/UserRoute'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { logoutUser } = useAuth()
  const { user } = useUserContext()

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Logout Successful')
    navigate('/')
  }

  return (
    <>
      <div className="flex flex-col">
        <h1>UID: {user?.qwe}</h1>
        <h2>Email: {user?.email}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  )
}

export default Dashboard
