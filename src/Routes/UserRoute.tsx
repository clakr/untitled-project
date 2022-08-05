import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'react-hot-toast'

// Context
import { useAuth } from '../Globals/AuthContext'

//
import LoadingPageIcon from '../Globals/Assets/LoadingPage.svg'

interface LoadingContextInterface {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const UserRoute = () => {
  //
  const { authedUser } = useAuth()

  //
  const [logged, setLogged] = useState(true)

  //
  const [loading, setLoading] = useState<boolean>(false)

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

  return (
    <>
      <div
        className={`${
          loading ? 'flex h-screen items-center justify-center' : 'hidden'
        }`}
      >
        <img src={LoadingPageIcon} alt="" className="w-80" />
      </div>
      <Outlet context={{ loading, setLoading }} />
    </>
  )
}

export const useLoading = () => {
  return useOutletContext<LoadingContextInterface>()
}

export default UserRoute
