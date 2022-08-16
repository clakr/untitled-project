import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { DocumentData } from 'firebase/firestore'

import { useAuth } from '../Globals/AuthContext'

import LoadingPageIcon from '../Globals/Assets/LoadingPage.svg'
import { AppShell, Burger, Header, MediaQuery, Text } from '@mantine/core'
import SideNav from '../Globals/Components/SideNav'

interface UserContextInterface {
  user: DocumentData | undefined
}

const UserRoute: React.FC = () => {
  const navigate = useNavigate()
  const { authedUser, getUser } = useAuth()
  const [user, setUser] = useState<DocumentData | undefined>({})
  const [isVerified, setIsVerified] = useState<boolean>(true)
  const [isLogged, setIsLogged] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const getUserData = async () => {
      const data = await getUser()
      setUser((prevState) => ({
        ...prevState,
        ...data
      }))
      setIsLoading(false)
    }

    getUserData()
  }, [])

  useEffect(() => {
    if (authedUser === null || authedUser === undefined) {
      setIsLogged(false)
    }

    if (authedUser && !authedUser?.emailVerified) {
      setIsVerified(false)
    }

    if (!isLogged) {
      toast.error('User is not authenticated.')
      navigate('/')
    }

    if (!isVerified) {
      toast.error('User email not verified yet.')
      navigate('/register')
    }
  }, [isLogged, isVerified])

  return (
    <>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={<SideNav isOpened={isOpened} />}
        header={
          <Header height={75} p="md">
            <div className="flex h-full items-center gap-x-4">
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={isOpened}
                  onClick={() => setIsOpened((prevState) => !prevState)}
                  size="sm"
                />
              </MediaQuery>

              <Text>this is app name</Text>
            </div>
          </Header>
        }
      >
        {isLoading
          ? (
          <div className="grid h-full w-full place-items-center">
            <img src={LoadingPageIcon} alt="" className="w-80" />
          </div>
            )
          : (
          <Outlet context={{ user }} />
            )}
      </AppShell>
    </>
  )
}

export const useUserContext = () => {
  return useOutletContext<UserContextInterface>()
}

export default UserRoute
