import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Database
import { useAuth } from '../../Globals/AuthContext'

// Components
import { FormInput, Button, LinkCustom } from '../../Globals/Components'
import FormWrapper from '../../Globals/Components/FormWrapper'

const initialState = {
  email: '',
  password: ''
}

const LoginForm: React.FC = () => {
  //
  const { loginUser } = useAuth()

  //
  const navigate = useNavigate()

  //
  const [form, setForm] = useState(initialState)
  const { email, password } = form

  //
  const [loading, setLoading] = useState(false)

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
    setLoading(true)

    try {
      await loginUser(email, password)
      navigate('/dashboard')
      setForm(initialState)
    } catch (error) {}

    setLoading(false)
  }

  return (
    <>
      <form
        className="grid place-items-center lg:flex-1"
        onSubmit={(event) => handleSubmit(event)}
      >
        <FormWrapper>
          <div className="lg:space-y-2">
            {/* Header */}
            <h1 className="font-serif text-3xl font-bold lg:text-4xl">
              Login Account
            </h1>

            {/* Subheader */}
            <h2 className="text-xs text-gray-400 lg:text-sm">
              Let&apos;s get you started. Please enter your details.
            </h2>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <FormInput
              labelName="email"
              inputName="email"
              inputType="email"
              placeholder="juandelacruz@gmail.com"
              onChange={handleChange}
              value={email}
            />
            <FormInput
              labelName="password"
              inputName="password"
              inputType="password"
              placeholder="********"
              onChange={handleChange}
              value={password}
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberme"
                id="rememberme"
                className="bg-transparent focus:outline-blue-600"
              />
              <label htmlFor="rememberme" className="select-none">
                Remember Me
              </label>
            </div>
            <LinkCustom
              to="forgot"
              hover="hover:bg-blue-600 hover:text-gray-50"
              focus="focus:outline-blue-600"
              padding="px-2 py-1"
              value="Forgot Password?"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            bgColor="bg-blue-400"
            hoverColor="hover:bg-blue-600"
            focusColor="focus:outline-blue-600"
            value="Log in"
            loading={loading}
          />

          {/* Create an account */}
          <h3 className=" text-center">
            Don&apos;t have an account? <br />
            <LinkCustom
              to="register"
              hover="hover:bg-blue-600 hover:text-gray-50"
              focus="focus:outline-offset-[-2px] focus:outline-blue-600"
              padding="px-2 py-1"
              value="Create an account."
            />
          </h3>
        </FormWrapper>
      </form>
    </>
  )
}

export default LoginForm
