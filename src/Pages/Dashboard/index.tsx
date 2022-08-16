import React from 'react'
import { Button } from '@mantine/core'
import {
  faHourglassStart,
  faHourglassEnd
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { generateGreetings } from '../../Globals/Utilities'
import { useUserContext } from '../../Routes/UserRoute'

const Dashboard: React.FC = () => {
  const { user } = useUserContext()

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-4xl">
        {`${generateGreetings()}, `}
        <span className="whitespace-nowrap font-bold">{`${user?.name.first}!`}</span>
      </h1>
      <Button leftIcon={<FontAwesomeIcon icon={faHourglassStart} />}>
        Clock In
      </Button>
      <Button
        variant="light"
        leftIcon={<FontAwesomeIcon icon={faHourglassEnd} />}
      >
        Clock Out
      </Button>
    </div>
  )
}

export default Dashboard
