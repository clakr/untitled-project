import React, { useState } from 'react'

// Database
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Globals/Firebase'

// Components
import { FormInput, Button, LinkCustom } from '../Globals/Components'

const initialState = {
  email: '',
  password: ''
}

const RegisterForm: React.FC = () => {
  //
  const [form, setForm] = useState(initialState)
  const { email, password } = form

  //

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      currentTarget: { name, value }
    } = event

    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.log('cause: ', error.cause)
        console.log('code: ', error.code)
        console.log('customData: ', error.customData)
        console.log('message: ', error.message)
        console.log('name: ', error.name)
        console.log('stack: ', error.stack)
        return
      }
    }

    setForm(initialState)
  }

  return (
    <form
      className="grid place-items-center lg:flex-1"
      onSubmit={(event) => handleSubmit(event)}
    >
      <div className="flex min-w-full flex-col justify-center gap-y-8 lg:min-w-[500px] lg:rounded-3xl lg:border lg:border-gray-50 lg:bg-white lg:p-6 lg:shadow-2xl lg:shadow-gray-300">
        <div className="lg:space-y-2">
          {/* Header */}
          <h1 className="font-serif text-3xl font-bold lg:text-4xl">
            Register Account
          </h1>

          {/* Subheader */}
          <h2 className="text-xs text-gray-400 lg:text-sm">
            Let&apos;s get you started. Please enter your details.
          </h2>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <FormInput
            inputName="email"
            inputType="email"
            placeholder="juandelacruz@gmail.com"
            onChange={handleChange}
            value={email}
          />
          <FormInput
            inputName="password"
            inputType="password"
            placeholder="********"
            onChange={handleChange}
            value={password}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          bgColor="bg-blue-400"
          hoverColor="hover:bg-blue-600"
          focusColor="focus:outline-blue-600"
          padding="py-2"
          value="Register"
        />

        {/* Create an account */}
        <h3 className=" text-center">
          Already have an account? <br />
          <LinkCustom
            to="/"
            hover="hover:bg-blue-600 hover:text-gray-50"
            focus="focus:outline-offset-[-2px] focus:outline-blue-600"
            padding="px-2 py-1"
            value="Log in."
          />
        </h3>
      </div>
    </form>
  )
}

export default RegisterForm
