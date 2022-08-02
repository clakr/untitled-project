import React from 'react'
import { useNavigate } from 'react-router-dom'

// Context
import { useAuth } from '../../Globals/AuthContext'

// Components
import toast from 'react-hot-toast'

const Dashboard = () => {
  //
  const { authedUser, logoutUser } = useAuth()

  //
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Logout Successful')
    navigate('/')
  }

  return (
    <>
      {authedUser && (
        <div>
          Email: {authedUser.email}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  )
}

export default Dashboard
