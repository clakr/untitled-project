import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DocumentData } from 'firebase/firestore'

// Context
import { useAuth } from '../../Globals/AuthContext'

// Components
import { useLoading } from '../../Routes/UserRoute'

const Dashboard = () => {
  //
  const { logoutUser, getUser } = useAuth()

  //
  const [user, setUser] = useState<DocumentData | undefined>({})

  //
  const { loading, setLoading } = useLoading()

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
    setLoading(true)
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
      setLoading(false)
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
      {!loading && (
        <div className="flex flex-col">
          <h1>UID: {user?.qwe}</h1>
          <h2>Email: {user?.email}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  )
}

export default Dashboard
