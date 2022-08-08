import React from 'react'

import LoginForm from './LoginForm'
import loginImage from './login.svg'

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between gap-8 p-6 lg:flex-row">
      <div className="grid max-w-full place-items-center lg:flex-1">
        <img src={loginImage} alt="" />
      </div>
      <LoginForm />
    </div>
  )
}

export default Login
