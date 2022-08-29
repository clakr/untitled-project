import React, { SetStateAction, useEffect, useState } from 'react'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { DocumentData } from 'firebase/firestore'
import {
  AppShell,
  Avatar,
  Burger,
  Header,
  Loader,
  MediaQuery,
  Text
} from '@mantine/core'

import { useAuth } from '../Globals/AuthContext'
import FirestoreProvider from '../Globals/FirestoreContext'
import SideNav from '../Globals/Components/SideNav'
import { getAcronym } from '../Globals/Utilities'
import { User } from '../Globals/Types'

interface UserContextInterface {
  user: DocumentData | undefined
  isLoading: boolean
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
}

const UserRoute: React.FC = () => {
  const navigate = useNavigate()
  const { authedUser, getUser } = useAuth()
  const [user, setUser] = useState<User | undefined>({
    name: {
      first: '',
      last: '',
      middle: ''
    },
    email: ''
  })
  const [isVerified, setIsVerified] = useState<boolean>(true)
  const [isLogged, setIsLogged] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const getUserData = async () => {
      if (authedUser) {
        const data = await getUser(authedUser?.uid)
        setUser(data)
      }
      setIsLoading(false)
    }

    getUserData()

    return () => {
      setIsLoading(true)
    }
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
    <FirestoreProvider>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        padding="xl"
        navbar={<SideNav isOpened={isOpened} />}
        header={
          <Header height={75} p="md">
            <div className="flex h-full items-center gap-x-4">
              <div className="flex flex-1 gap-x-4">
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger
                    opened={isOpened}
                    onClick={() => setIsOpened((prevState) => !prevState)}
                    size="sm"
                  />
                </MediaQuery>
                <Text>untitled-project</Text>
              </div>
              <Avatar radius="xl">{getAcronym(authedUser?.displayName)}</Avatar>
            </div>
          </Header>
        }
      >
        {isLoading
          ? (
          <div className="grid h-full w-full place-items-center">
            <Loader size="xl" />
          </div>
            )
          : (
          <Outlet context={{ user, isLoading, setIsLoading }} />
            )}
      </AppShell>
    </FirestoreProvider>
  )
}

export const useUserContext = () => {
  return useOutletContext<UserContextInterface>()
}

export default UserRoute
