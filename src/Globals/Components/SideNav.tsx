import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button, Divider, Navbar } from '@mantine/core'
import {
  faSignOutAlt,
  faChartLine,
  faHistory,
  faUserAlt
} from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../AuthContext'
import SideNavLink from './SideNavLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SideNav = ({ isOpened }: { isOpened: boolean }) => {
  const navigate = useNavigate()
  const { logoutUser } = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Logout Successful')
    navigate('/')
  }

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!isOpened}
      width={{ sm: 250, md: 300 }}
    >
      <div className="flex flex-col gap-y-2">
        <SideNavLink label="Dashboard" to="/u/dashboard" icon={faChartLine} />
        <SideNavLink label="History" to="/u/history" icon={faHistory} />
        <Divider />
        <SideNavLink label="Profile" to="/u/profile" icon={faUserAlt} />
        <SideNavLink label="404" to="/u/qwe" icon={faUserAlt} />
        <Divider />
        <Button
          color="red"
          variant="subtle"
          leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
          classNames={{ inner: 'gap-x-2', label: 'flex-1' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Navbar>
  )
}

export default SideNav
