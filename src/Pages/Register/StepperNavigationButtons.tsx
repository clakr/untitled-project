import React from 'react'
import { Button } from '../../Globals/Components'

interface PropInterface {
  prevStep: () => void
  nextStep: () => void
}

const StepperNavigationButtons = ({ prevStep, nextStep }: PropInterface) => {
  return (
    <div className="flex justify-center gap-x-4 p-2">
      <Button
        type="button"
        bgColor="bg-transparent"
        hoverColor="hover:bg-gray-400 hover:text-gray-50"
        focusColor="focus:outline-gray-400"
        className="min-w-[90px] max-w-[100px] flex-1 border border-gray-300 text-sm text-gray-500"
        value="Back"
        onClick={prevStep}
      />
      <Button
        type="button"
        bgColor="bg-blue-400"
        hoverColor="hover:bg-blue-600"
        focusColor="focus:outline-blue-600"
        className="min-w-[90px] max-w-[100px] flex-1 text-sm"
        value="Next Step"
        onClick={nextStep}
      />
    </div>
  )
}

export default StepperNavigationButtons
