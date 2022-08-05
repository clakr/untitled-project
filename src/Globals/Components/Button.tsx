import React from 'react'

import LoadingIcon from '../../Globals/Assets/Loading.svg'

interface PropInterface {
  value: string
  type: 'submit' | 'reset' | 'button' | undefined
  bgColor: string
  hoverColor: string
  focusColor: string
  padding: string
  loading?: boolean
}

const Button: React.FC<PropInterface> = ({
  value,
  type,
  bgColor,
  hoverColor,
  focusColor,
  padding,
  loading
}) => {
  return (
    <button
      type={type}
      className={`flex justify-center rounded-md text-gray-50 transition-colors duration-200 ${bgColor} ${hoverColor} ${focusColor} ${padding}`}
      disabled={loading}
    >
      <span className={`${loading ? 'hidden' : ''}`}>{value}</span>
      <img src={LoadingIcon} alt="" className={`${loading ? 'w-6' : 'w-0'}`} />
    </button>
  )
}

export default Button
