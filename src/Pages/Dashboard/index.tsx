import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Context
import { useAuth } from '../../Globals/AuthContext'

// Components
import toast from 'react-hot-toast'

const Dashboard = () => {
  //
  const { authedUser, logoutUser } = useAuth()

  //
  const [logged, setLogged] = useState(true)

  //
  const navigate = useNavigate()

  useEffect(() => {
    if (authedUser === null || authedUser === undefined) {
      setLogged(!logged)
    }

    if (!logged) {
      toast.error('User Unauthenticated')
      navigate('/')
    }
  }, [logged])

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
