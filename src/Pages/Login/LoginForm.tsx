import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PasswordInput, TextInput, Button, Checkbox } from '@mantine/core'
import { useForm } from '@mantine/form'

import { useAuth } from '../../Globals/AuthContext'
import { LinkCustom } from '../../Globals/Components'
import FormWrapper from '../../Globals/Components/FormWrapper'
import toast from 'react-hot-toast'

type EmailPasswordFormType = {
  email: string
  password: string
}

const emailPasswordInitialValues: EmailPasswordFormType = {
  email: '',
  password: ''
}

const emailPasswordInitialErrors: EmailPasswordFormType = {
  ...emailPasswordInitialValues
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<EmailPasswordFormType>({
    initialValues: emailPasswordInitialValues,
    initialErrors: emailPasswordInitialErrors,

    validate: {
      email: (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value) ? null : 'Invalid email'
    },

    validateInputOnChange: true
  })

  return (
    <>
      <form
        className="grid place-items-center lg:flex-1"
        onSubmit={form.onSubmit(async (values) => {
          setLoading(true)
          const { email, password } = values

          try {
            await loginUser(email, password)
            toast.success('Login Success')
            navigate('/dashboard')
          } catch (error) {
            toast.error(`${error}`)
            navigate('/register')
          }

          setLoading(false)
        })}
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
            <TextInput
              label="Email"
              placeholder="juandelacruz@gmail.com"
              classNames={{ label: 'px-3' }}
              autoComplete="on"
              required
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="********"
              classNames={{
                root: 'flex-1',
                label: 'px-3',
                description: 'px-3'
              }}
              autoComplete="on"
              required
              {...form.getInputProps('password')}
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between gap-4 text-sm">
            <Checkbox label="Remember Me" />
            <LinkCustom to="forgot" value="Forgot Password?" />
          </div>

          {/* Submit Button */}
          <Button type="submit" loading={loading}>
            Log In
          </Button>

          {/* Create an account */}
          <h3 className=" text-center">
            Don&apos;t have an account? <br />
            <LinkCustom to="register" value="Create an account." />
          </h3>
        </FormWrapper>
      </form>
    </>
  )
}

export default LoginForm
