import React, { useEffect, useState } from 'react'
import { Button } from '@mantine/core'
import {
  faHourglassStart,
  faHourglassEnd
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { generateGreetings } from '../../Globals/Utilities'
import { useUserContext } from '../../Routes/UserRoute'
import { useFirestore } from '../../Globals/FirestoreContext'
import toast from 'react-hot-toast'
import { FirebaseError } from 'firebase/app'
import AsideCalendar from '../../Globals/Components/AsideCalendar'

const Dashboard: React.FC = () => {
  const { user, setIsLoading } = useUserContext()
  const { checkRecordIfExists, clockIn, clockOut } = useFirestore()
  const [showButton, setShowButton] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)

    const checkRecordToday = async () => {
      setShowButton(await checkRecordIfExists())
    }

    checkRecordToday()
    setIsLoading(false)
  }, [])

  return (
    <div className="flex h-full gap-x-4">
      <div className="flex flex-1 flex-col gap-y-4">
        <h1 className="text-4xl md:text-5xl xl:text-6xl">
          {`${generateGreetings()}, `}
          <span className="whitespace-nowrap font-bold">{`${user?.name.first}!`}</span>
        </h1>
        {showButton === 'in' && (
          <Button
            leftIcon={<FontAwesomeIcon icon={faHourglassStart} />}
            loading={loading}
            onClick={async () => {
              setLoading(true)
              try {
                await clockIn()
                setShowButton(await checkRecordIfExists())
                toast.success('Clocked in at {now}')
              } catch (error) {
                if (error instanceof FirebaseError) {
                  toast.error(`${error}`)
                }
              }
              setLoading(false)
            }}
          >
            Clock In
          </Button>
        )}
        {showButton === 'out' && (
          <Button
            variant="light"
            leftIcon={<FontAwesomeIcon icon={faHourglassEnd} />}
            loading={loading}
            onClick={async () => {
              setLoading(true)
              try {
                await clockOut()
                setShowButton(await checkRecordIfExists())
                toast.success('Clocked out at {now}')
              } catch (error) {
                if (error instanceof FirebaseError) {
                  toast.error(`${error}`)
                }
              }
              setLoading(false)
            }}
          >
            Clock Out
          </Button>
        )}
      </div>
      <AsideCalendar />
    </div>
  )
}

export default Dashboard
