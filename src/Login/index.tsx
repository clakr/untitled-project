import React from 'react'

// Components
import LoginForm from './LoginForm'

// Assets
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

// Colors

// [ gray-50 ]
// [ gray-300 ]
// [ gray-400 ]
// [ blue-400 ]
// [ blue-500 ]

export default Login
