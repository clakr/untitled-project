import React from 'react'

// Components
import RegisterForm from './RegisterForm'

// Assets
import registerImage from './register.svg'

const Register = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between gap-8 p-6 lg:flex-row">
      <div className="grid max-w-full place-items-center lg:flex-1">
        <img src={registerImage} alt="" />
      </div>
      <RegisterForm />
    </div>
  )
}

export default Register
