import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface ButtonLinkInterface {
  value: string
  to: string
  icon: IconDefinition
}

const ButtonLink: React.FC<ButtonLinkInterface> = ({ value, icon, to }) => {
  return (
    <Button
      variant="subtle"
      leftIcon={<FontAwesomeIcon size="lg" icon={icon} />}
      size="sm"
      component={Link}
      to={to}
      classNames={{ inner: 'flex gap-x-2', label: 'flex-1' }}
    >
      {value}
    </Button>
  )
}

export default ButtonLink
