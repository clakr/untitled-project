import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button, Divider, Navbar } from '@mantine/core'
import {
  faSignOutAlt,
  faChartLine,
  faUserAlt,
  faFileLines,
  faTimeline
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
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-y-2">
          <SideNavLink label="Dashboard" to="/u/dashboard" icon={faChartLine} />
          <SideNavLink label="Timeline" to="/u/timeline" icon={faTimeline} />
          <SideNavLink label="Reports" to="/u/reports" icon={faFileLines} />
          <Divider />
          <SideNavLink label="Profile" to="/u/profile" icon={faUserAlt} />
        </div>
        <div className="flex flex-col gap-y-2">
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
      </div>
    </Navbar>
  )
}

export default SideNav
