import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stepper, TextInput, PasswordInput, Button } from '@mantine/core'
import { useForm, UseFormReturnType } from '@mantine/form'
import {
  faUserPlus,
  faCircleCheck,
  faIdCard,
  faEnvelopeOpen
} from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../../Globals/AuthContext'
import { LinkCustom, FormWrapper } from '../../Globals/Components'
import StepperIcon from './StepperIcon'

type FormValuesType = {
  email: string
  password: string
  confirmPassword: string
}

interface EmailPasswordFormInterface {
  form: UseFormReturnType<FormValuesType>
  error: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  setStepperActive: React.Dispatch<React.SetStateAction<number>>
}

interface StepperNavigationInterface {
  error: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  setStepperActive: React.Dispatch<React.SetStateAction<number>>
}

const initialValues: FormValuesType = {
  email: '',
  password: '',
  confirmPassword: ''
}

const nextStep = (setAction: React.Dispatch<React.SetStateAction<number>>) => {
  setAction((current) => (current < 3 ? current + 1 : current))
}

const prevStep = (setAction: React.Dispatch<React.SetStateAction<number>>) =>
  setAction((current) => (current > 0 ? current - 1 : current))

const checkForFormErrors = (
  form: UseFormReturnType<FormValuesType>,
  setAction: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (Object.keys(form.errors).length === 0) {
    setAction(false)
  } else {
    setAction(true)
  }
}

const StepperNavigation: React.FC<StepperNavigationInterface> = ({
  error: [error, setError],
  setStepperActive
}) => {
  return (
    <div className="flex justify-center gap-x-4 p-2">
      <Button variant="default" onClick={() => prevStep(setStepperActive)}>
        Back
      </Button>
      <Button
        onClick={() => {
          setError(true)
          nextStep(setStepperActive)
        }}
        disabled={error}
      >
        Next Step
      </Button>
    </div>
  )
}

const EmailPasswordForm: React.FC<EmailPasswordFormInterface> = ({
  form,
  error: [error, setError],
  setStepperActive
}) => {
  useEffect(() => {
    checkForFormErrors(form, setError)
  }, [form.errors])

  return (
    <div className="space-y-4">
      <TextInput
        label="Email"
        placeholder="juandelacruz@gmail.com"
        classNames={{ label: 'px-3' }}
        required
        {...form.getInputProps('email')}
      />
      <div className="flex flex-col gap-y-4 sm:gap-x-4 md:flex-row lg:flex-col xl:flex-row">
        <PasswordInput
          label="Password"
          placeholder="********"
          classNames={{
            root: 'flex-1',
            label: 'px-3',
            description: 'px-3'
          }}
          required
          {...form.getInputProps('password')}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="********"
          classNames={{
            root: 'flex-1',
            label: 'px-3'
          }}
          required
          {...form.getInputProps('confirmPassword')}
        />
      </div>
      {/* <Button onClick={() => prevStep(setStepperActive)}>qwe</Button> */}
      <StepperNavigation
        error={[error, setError]}
        setStepperActive={setStepperActive}
      />
    </div>
  )
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const { createUser } = useAuth()
  const [error, setError] = useState<boolean>(true)
  const [stepperActive, setStepperActive] = useState<number>(0)

  const mantineEmailPasswordForm = useForm({
    initialValues,
    initialErrors: initialValues,

    validate: {
      email: (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value) ? null : 'Invalid email',
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords did not match'
    },

    validateInputOnChange: true
  })

  return (
    <form
      className="grid place-items-center lg:flex-1"
      onSubmit={mantineEmailPasswordForm.onSubmit(
        async ({ email, password }) => {
          try {
            await createUser(email, password)
            navigate('/dashboard')
          } catch (error) {}
        }
      )}
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
            <EmailPasswordForm
              form={mantineEmailPasswordForm}
              error={[error, setError]}
              setStepperActive={setStepperActive}
            />
          </Stepper.Step>

          {/* Stepper 2 */}
          <Stepper.Step
            icon={<StepperIcon icon={faIdCard} />}
            progressIcon={
              <StepperIcon icon={faIdCard} className="text-blue-500" />
            }
            allowStepSelect={stepperActive > 1}
          >
            <StepperNavigation
              error={[error, setError]}
              setStepperActive={setStepperActive}
            />
          </Stepper.Step>

          {/* Stepper 3 */}
          <Stepper.Step
            icon={<StepperIcon icon={faEnvelopeOpen} />}
            progressIcon={
              <StepperIcon icon={faEnvelopeOpen} className="text-blue-500" />
            }
            allowStepSelect={stepperActive > 2}
          >
            <StepperNavigation
              error={[error, setError]}
              setStepperActive={setStepperActive}
            />
          </Stepper.Step>

          {/* Stepper Last */}
          <Stepper.Completed>
            completed
            <StepperNavigation
              error={[error, setError]}
              setStepperActive={setStepperActive}
            />
          </Stepper.Completed>
        </Stepper>

        {/* Submit Button */}
        {/* <Button
          type="submit"
          bgColor="bg-blue-400"
          hoverColor="hover:bg-blue-600"
          focusColor="focus:outline-blue-600"
          value="Register"
          isLoading={isLoading}
        /> */}

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
