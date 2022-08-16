import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Divider, Navbar, NavLink } from '@mantine/core'
import {
  faSignOutAlt,
  faChartLine,
  faHistory
} from '@fortawesome/free-solid-svg-icons'

import { useAuth } from '../AuthContext'
import ButtonLink from './ButtonLink'
import ButtonOnClick from './ButtonOnClick'
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
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!isOpened} width={{ sm: 300 }}>
      <div className="flex flex-col gap-y-2">
        <ButtonLink value="Dashboard" to="/u/dashboard" icon={faChartLine} />
        <ButtonLink value="History" to="/u/history" icon={faHistory} />
        <Divider />
        <ButtonLink value="Profile" to="/u/history" icon={faHistory} />
        <Divider />
        <ButtonOnClick
          value="Logout"
          icon={faSignOutAlt}
          onClick={handleLogout}
        />
      </div>
    </Navbar>
  )
}

export default SideNav
