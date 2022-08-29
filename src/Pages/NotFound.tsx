import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSkull } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mantine/core'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col gap-y-4">
        <FontAwesomeIcon size="7x" icon={faSkull} />
        <h1 className="text-2xl">
          <span className="text-center text-3xl font-black">404:</span> Site Not
          Found
        </h1>
        <Button variant="subtle" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default NotFound
