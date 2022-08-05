import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stepper } from '@mantine/core'
import {
  faUserPlus,
  faCircleCheck,
  faIdCard,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../Globals/AuthContext'
import { FormInput, Button, LinkCustom } from '../../Globals/Components'
import StepperIcon from './StepperIcon'
import StepperNavigationButtons from './StepperNavigationButtons'

const initialState = {
  email: '',
  password: '',
  confirmPassword: ''
}

const RegisterForm: React.FC = () => {
  // AuthContext.tsx
  const { createUser } = useAuth()

  // Form States
  const [form, setForm] = useState(initialState)
  const { email, password, confirmPassword } = form
  const [stepperActive, setStepperActive] = useState(0)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const nextStep = () =>
    setStepperActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () =>
    setStepperActive((current) => (current > 0 ? current - 1 : current))

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
      await createUser(email, password)
      navigate('/dashboard')
      setForm(initialState)
    } catch (error) {}

    setLoading(false)
  }

  return (
    <form
      className="grid place-items-center lg:flex-1"
      onSubmit={(event) => handleSubmit(event)}
    >
      <div className="flex min-w-full flex-col justify-center gap-y-6 lg:min-w-[500px] lg:rounded-3xl lg:border lg:border-gray-50 lg:bg-white lg:p-6 lg:shadow-2xl lg:shadow-gray-300">
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

        <Stepper
          active={stepperActive}
          onStepClick={setStepperActive}
          orientation="vertical"
          contentPadding="xs"
          completedIcon={
            <StepperIcon
              icon={faCircleCheck}
              size="lg"
              className="text-white"
            />
          }
          classNames={{
            root: 'flex gap-x-6',
            content: 'p-0 flex-1 flex flex-col justify-center'
          }}
        >
          <Stepper.Step
            icon={<StepperIcon icon={faUserPlus} />}
            progressIcon={
              <StepperIcon icon={faUserPlus} className="text-blue-500" />
            }
          >
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
              <FormInput
                labelName="confirm password"
                inputName="confirmPassword"
                inputType="password"
                placeholder="********"
                onChange={handleChange}
                value={confirmPassword}
              />
              <StepperNavigationButtons
                prevStep={prevStep}
                nextStep={nextStep}
              />
            </div>
          </Stepper.Step>
          <Stepper.Step
            icon={<StepperIcon icon={faIdCard} />}
            progressIcon={
              <StepperIcon icon={faIdCard} className="text-blue-500" />
            }
          >
            <StepperNavigationButtons prevStep={prevStep} nextStep={nextStep} />
          </Stepper.Step>
          <Stepper.Step
            icon={<StepperIcon icon={faEnvelopeOpen} />}
            progressIcon={
              <StepperIcon icon={faEnvelopeOpen} className="text-blue-500" />
            }
          >
            <StepperNavigationButtons prevStep={prevStep} nextStep={nextStep} />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        {/* Submit Button */}
        <Button
          type="submit"
          bgColor="bg-blue-400"
          hoverColor="hover:bg-blue-600"
          focusColor="focus:outline-blue-600"
          value="Register"
          loading={loading}
        />

        {/* Create an account */}
        <h3 className=" text-center">
          Already have an account? <br />
          <LinkCustom
            to="/"
            hover="hover:bg-blue-600 hover:text-gray-50"
            focus="focus:outline-offset-[-2px] focus:outline-blue-600"
            padding="px-2 py-1"
            value="Sign in an account."
          />
        </h3>
      </div>
    </form>
  )
}

export default RegisterForm
