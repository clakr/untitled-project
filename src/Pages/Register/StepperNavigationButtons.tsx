import React from 'react'
import { Button } from '@mantine/core'

interface PropInterface {
  error: boolean
  prevStep: () => void
  nextStep: () => void
}

const StepperNavigationButtons = ({
  error,
  prevStep,
  nextStep
}: PropInterface) => {
  return (
    <div className="flex justify-center gap-x-4 p-2">
      <Button variant="default" onClick={prevStep}>
        Back
      </Button>
      <Button onClick={nextStep} disabled={error}>
        Next Step
      </Button>
    </div>
  )
}

export default StepperNavigationButtons
