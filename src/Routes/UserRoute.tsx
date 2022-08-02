import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

// Context
import { useAuth } from '../Globals/AuthContext'

const UserRoute = () => {
  //
  const { authedUser } = useAuth()

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

  return (
    <>
      <Outlet />
    </>
  )
}

export default UserRoute
