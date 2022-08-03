import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Context
import { useAuth } from '../../Globals/AuthContext'

// Components
import toast from 'react-hot-toast'
import { DocumentData } from 'firebase/firestore'

const Dashboard = () => {
  //
  const { logoutUser, getUser } = useAuth()

  //
  const [user, setUser] = useState<DocumentData | undefined>({})

  //
  const [error, setError] = useState(false)

  //
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Logout Successful')
    navigate('/')
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getUser()
        setUser((prevState) => ({
          ...prevState,
          ...data
        }))
      } catch (error: unknown) {
        setError(true)
      }
    }

    getUserData()
  }, [])

  useEffect(() => {
    if (error) {
      toast.error('User does not exist')
      setError(false)
    }
  }, [error])

  return (
    <>
      {user && (
        <div className="flex flex-col">
          <h1>UID: {user.qwe}</h1>
          <h2>Email: {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  )
}

export default Dashboard
