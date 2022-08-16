import React from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface SideNavLinkInterface {
  label: string
  to: string
  icon: IconDefinition
}

const SideNavLink: React.FC<SideNavLinkInterface> = ({ label, to, icon }) => {
  return (
    <NavLink
      label={label}
      component={Link}
      to={to}
      icon={<FontAwesomeIcon icon={icon} />}
      active={location.pathname === to}
      classNames={{ root: 'gap-x-2 rounded-[4px]' }}
    />
  )
}

export default SideNavLink
