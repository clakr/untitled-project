import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { DocumentData } from 'firebase/firestore'

// Context
import { useAuth } from '../../Globals/AuthContext'

// Components
import { useLoading } from '../../Routes/UserRoute'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { logoutUser, getUser } = useAuth()
  const { isLoading, setIsLoading } = useLoading()
  const [error, setError] = useState<boolean>(false)
  const [user, setUser] = useState<DocumentData | undefined>({})

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Logout Successful')
    navigate('/')
  }

  useEffect(() => {
    setIsLoading(true)
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
      setIsLoading(false)
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
      {!isLoading && (
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
