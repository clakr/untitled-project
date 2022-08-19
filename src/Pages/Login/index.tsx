import React from 'react'

import LoginForm from './LoginForm'
import loginImage from './login.svg'

const Login: React.FC = () => {
  return (
    <div className="lg:flex-row flex min-h-screen flex-col justify-between gap-8 p-6">
      <div className="lg:flex-1 grid max-w-full place-items-center">
        <img src={loginImage} alt="" />
      </div>
      <LoginForm />
    </div>
  )
}

export default Login
