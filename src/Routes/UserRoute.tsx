import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'react-hot-toast'

// Context
import { useAuth } from '../Globals/AuthContext'

//
import LoadingPageIcon from '../Globals/Assets/LoadingPage.svg'

interface LoadingContextInterface {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const UserRoute: React.FC = () => {
  const navigate = useNavigate()
  const { authedUser } = useAuth()
  const [isLogged, setIsLogged] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (authedUser === null || authedUser === undefined) {
      setIsLogged(false)
    }

    if (!isLogged) {
      toast.error('User Unauthenticated')
      navigate('/')
    }
  }, [isLogged])

  return (
    <>
      <div
        className={`${
          isLoading ? 'flex h-screen items-center justify-center' : 'hidden'
        }`}
      >
        <img src={LoadingPageIcon} alt="" className="w-80" />
      </div>
      <Outlet context={{ isLoading, setIsLoading }} />
    </>
  )
}

export const useLoading = () => {
  return useOutletContext<LoadingContextInterface>()
}

export default UserRoute
