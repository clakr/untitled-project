import React from 'react'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'

const StepperIcon = ({ icon, size, className }: FontAwesomeIconProps) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      size={`${size ?? 'sm'}`}
      className={className}
    />
  )
}

export default StepperIcon
