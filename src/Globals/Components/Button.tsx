import React from 'react'

interface PropInterface {
  value: string
  type: 'submit' | 'reset' | 'button' | undefined
  bgColor: string
  hoverColor: string
  focusColor: string
  padding: string
}

const Button: React.FC<PropInterface> = ({
  value,
  type,
  bgColor,
  hoverColor,
  focusColor,
  padding
}) => {
  return (
    <button
      type={type}
      className={`rounded-md text-gray-50 transition-colors duration-200 ${bgColor} ${hoverColor} ${focusColor} ${padding}`}
    >
      {value}
    </button>
  )
}

export default Button
