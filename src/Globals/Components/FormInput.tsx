import React from 'react'

// Helpers
import { toSentenceCase } from '../Utilities'

interface PropInterface {
  labelName: string
  inputName: string
  inputType: string
  value: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormInput: React.FC<PropInterface> = ({
  labelName,
  inputName,
  inputType,
  placeholder,
  onChange,
  value
}) => {
  return (
    <div className="flex flex-1 flex-col gap-y-1">
      <label htmlFor={inputName} className="px-3 font-medium">
        {toSentenceCase(labelName)}
      </label>
      <input
        type={inputType}
        name={inputName}
        id={inputName}
        value={value}
        placeholder={placeholder}
        autoComplete="on"
        className="rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-blue-600 "
        onChange={onChange}
      />
    </div>
  )
}

export default FormInput
