import React from 'react'

// Helpers
import { toSentenceCase } from '../Utilities'

interface PropsInterface {
  inputName: string
  inputType: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}

const FormInput: React.FC<PropsInterface> = ({
  inputName,
  inputType,
  placeholder,
  onChange,
  value
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      <label htmlFor={inputName} className="px-3">
        {toSentenceCase(inputName)}
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
