import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

// Context
import { useAuth } from '../Globals/AuthContext'

// Components
import { toast } from 'react-hot-toast'

const InitialRoute = () => {
  //
  const { authedUser } = useAuth()

  //
  const [logged, setLogged] = useState(false)

  //
  const navigate = useNavigate()

  useEffect(() => {
    if (authedUser) {
      setLogged(!logged)
    }

    if (logged) {
      toast.error('User already Authenticated; Redirecting to /dashboard')
      navigate('/dashboard')
    }
  }, [logged])

  return (
    <>
      <Outlet />
    </>
  )
}

export default InitialRoute
