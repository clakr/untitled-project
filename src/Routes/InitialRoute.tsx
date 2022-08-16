import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { useAuth } from '../Globals/AuthContext'

const InitialRoute: React.FC = () => {
  const navigate = useNavigate()
  const { authedUser } = useAuth()
  const [isLogged, setIsLogged] = useState<boolean>(false)

  useEffect(() => {
    if (authedUser && authedUser.emailVerified) {
      setIsLogged(true)
    }

    if (isLogged) {
      toast.error('User already Authenticated; Redirecting to /u/dashboard')
      navigate('/u/dashboard')
    }
  }, [isLogged])

  return (
    <>
      <Outlet />
    </>
  )
}

export default InitialRoute
