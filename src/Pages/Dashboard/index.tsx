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

const Dashboard: React.FC = () => {
  const { user, setIsLoading } = useUserContext()
  const { checkDateIfExists, clockIn, clockOut } = useFirestore()
  const [showButton, setShowButton] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)

    const checkRecordToday = async () => {
      setShowButton(await checkDateIfExists())
    }

    checkRecordToday()
    setIsLoading(false)
  }, [])

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-4xl">
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
              setShowButton(await checkDateIfExists())
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
              setShowButton(await checkDateIfExists())
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
  )
}

export default Dashboard
