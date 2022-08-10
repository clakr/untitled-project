import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { DocumentData } from 'firebase/firestore'

import { useAuth } from '../Globals/AuthContext'

import LoadingPageIcon from '../Globals/Assets/LoadingPage.svg'

interface UserContextInterface {
  user: DocumentData | undefined
}

const UserRoute: React.FC = () => {
  const navigate = useNavigate()
  const { authedUser, getUser } = useAuth()
  const [user, setUser] = useState<DocumentData | undefined>({})
  const [isVerified, setIsVerified] = useState<boolean>(true)
  const [isLogged, setIsLogged] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    const getUserData = async () => {
      const data = await getUser()
      setUser((prevState) => ({
        ...prevState,
        ...data
      }))
      setIsLoading(false)
    }

    getUserData()
  }, [])

  useEffect(() => {
    if (authedUser === null || authedUser === undefined) {
      setIsLogged(false)
    }

    if (authedUser && !authedUser?.emailVerified) {
      setIsVerified(false)
    }

    if (!isLogged) {
      toast.error('User is not authenticated.')
      navigate('/')
    }

    if (!isVerified) {
      toast.error('User email not verified yet.')
      navigate('/register')
    }
  }, [isLogged, isVerified])

  return (
    <>
      <div
        className={`${
          isLoading ? 'flex h-screen items-center justify-center' : 'hidden'
        }`}
      >
        <img src={LoadingPageIcon} alt="" className="w-80" />
      </div>
      <Outlet context={{ user }} />
    </>
  )
}

export const useUserContext = () => {
  return useOutletContext<UserContextInterface>()
}

export default UserRoute
