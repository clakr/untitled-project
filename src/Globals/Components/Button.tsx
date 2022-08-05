import React from 'react'

import LoadingIcon from '../../Globals/Assets/Loading.svg'

interface PropInterface {
  value: string
  type: 'submit' | 'reset' | 'button' | undefined
  bgColor: string
  hoverColor: string
  focusColor: string
  className?: string
  loading?: boolean
  onClick?: () => void
}

const Button: React.FC<PropInterface> = ({
  value,
  type,
  bgColor,
  hoverColor,
  focusColor,
  className,
  loading,
  onClick
}) => {
  return (
    <button
      type={type}
      className={`flex justify-center rounded-md py-2 text-gray-50 transition-colors duration-200 ${bgColor} ${hoverColor} ${focusColor} ${className}`}
      disabled={loading}
      onClick={onClick}
    >
      <span className={`${loading ? 'hidden' : ''}`}>{value}</span>
      <img src={LoadingIcon} alt="" className={`${loading ? 'w-6' : 'w-0'}`} />
    </button>
  )
}

export default Button
