import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stepper, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  faUserPlus,
  faCircleCheck,
  faIdCard,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../Globals/AuthContext'
import {
  FormInput,
  Button,
  LinkCustom,
  FormWrapper
} from '../../Globals/Components'
import StepperIcon from './StepperIcon'
import StepperNavigationButtons from './StepperNavigationButtons'

type FormValuesType = {
  email: string
  password: string
  confirmPassword: string
}

const initialValues: FormValuesType = {
  email: '',
  password: '',
  confirmPassword: ''
}

const RegisterForm: React.FC = () => {
  const { createUser } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [form, setForm] = useState<FormValuesType>(initialState)
  // const { email, password, confirmPassword } = form
  const [stepperActive, setStepperActive] = useState<number>(0)

  const mForm = useForm({
    initialValues,

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 8 ? 'must be atleast 8 characters' : null
    },

    validateInputOnChange: true
  })

  const navigate = useNavigate()

  const nextStep = () =>
    setStepperActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () =>
    setStepperActive((current) => (current > 0 ? current - 1 : current))

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   const {
  //     currentTarget: { name, value }
  //   } = event

  //   setForm({
  //     ...form,
  //     [name]: value
  //   })
  // }

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   // setIsLoading(true)

  //   // try {
  //   //   await createUser(email, password)
  //   //   navigate('/dashboard')
  //   //   setForm(initialState)
  //   // } catch (error) {}

  //   // setIsLoading(false)
  // }

  return (
    <form
      className="grid place-items-center lg:flex-1"
      onSubmit={mForm.onSubmit((values) => console.log(values))}
    >
      <FormWrapper>
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
            root: 'flex gap-x-8',
            content: 'p-0 flex-1 flex flex-col justify-center'
          }}
        >
          {/* Stepper 1 */}
          <Stepper.Step
            icon={<StepperIcon icon={faUserPlus} />}
            progressIcon={
              <StepperIcon icon={faUserPlus} className="text-blue-500" />
            }
            allowStepSelect={stepperActive > 0}
          >
            {/* Inputs */}
            <div className="space-y-4">
              <TextInput
                label="Email"
                placeholder="Email"
                {...mForm.getInputProps('email')}
              />
              <TextInput
                label="Password"
                placeholder="Password"
                {...mForm.getInputProps('password')}
              />

              {/* <FormInput
                labelName="email"
                inputName="email"
                inputType="email"
                placeholder="juandelacruz@gmail.com"
                onChange={handleChange}
                value={email}
              />
              <div className="flex flex-col gap-y-4 sm:gap-x-4 md:flex-row lg:flex-col xl:flex-row">
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
              </div> */}
              <StepperNavigationButtons
                prevStep={prevStep}
                nextStep={nextStep}
              />
            </div>
          </Stepper.Step>

          {/* Stepper 2 */}
          <Stepper.Step
            icon={<StepperIcon icon={faIdCard} />}
            progressIcon={
              <StepperIcon icon={faIdCard} className="text-blue-500" />
            }
            allowStepSelect={stepperActive > 1}
          >
            <StepperNavigationButtons prevStep={prevStep} nextStep={nextStep} />
          </Stepper.Step>

          {/* Stepper 3 */}
          <Stepper.Step
            icon={<StepperIcon icon={faEnvelopeOpen} />}
            progressIcon={
              <StepperIcon icon={faEnvelopeOpen} className="text-blue-500" />
            }
            allowStepSelect={stepperActive > 2}
          >
            <StepperNavigationButtons prevStep={prevStep} nextStep={nextStep} />
          </Stepper.Step>

          {/* Stepper Last */}
          <Stepper.Completed>
            completed
            <StepperNavigationButtons prevStep={prevStep} nextStep={nextStep} />
          </Stepper.Completed>
        </Stepper>

        {/* Submit Button */}
        <Button
          type="submit"
          bgColor="bg-blue-400"
          hoverColor="hover:bg-blue-600"
          focusColor="focus:outline-blue-600"
          value="Register"
          isLoading={isLoading}
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
      </FormWrapper>
    </form>
  )
}

export default RegisterForm
