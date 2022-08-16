import React from 'react'
import { Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface ButtonOnClickInterface {
  value: string
  onClick: () => Promise<void>
  icon: IconDefinition
}

const ButtonOnClick: React.FC<ButtonOnClickInterface> = ({
  value,
  onClick,
  icon
}) => {
  return (
    <Button
      color="red"
      variant="subtle"
      leftIcon={<FontAwesomeIcon size="lg" icon={icon} />}
      size="sm"
      onClick={onClick}
      classNames={{ inner: 'flex gap-x-2', label: 'flex-1' }}
    >
      {value}
    </Button>
  )
}

export default ButtonOnClick
