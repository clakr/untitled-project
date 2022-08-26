import React, { useEffect, useState } from 'react'
import { Button, Divider, Switch } from '@mantine/core'
import {
  faHourglassStart,
  faHourglassEnd,
  faCalendarDay,
  faMugHot
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { generateGreetings, getHourNow } from '../../Globals/Utilities'
import { useUserContext } from '../../Routes/UserRoute'
import { useFirestore } from '../../Globals/FirestoreContext'
import toast from 'react-hot-toast'
import { FirebaseError } from 'firebase/app'
import AsideCalendar from '../../Globals/Components/AsideCalendar'
import CustomModal from '../../Globals/Components/CustomModal'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'

const Dashboard: React.FC = () => {
  const { user, setIsLoading } = useUserContext()
  const { checkRecordIfExists, clockIn, clockOut } = useFirestore()
  const [showButton, setShowButton] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [check, setCheck] = useState<boolean>(true)

  const breakInDefault = dayjs()
    .hour(12)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate()
  const breakOutDefault = dayjs()
    .hour(13)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate()

  const form = useForm({
    initialValues: {
      breakDuration: [breakInDefault, breakOutDefault]
    }
  })

  useEffect(() => {
    setIsLoading(true)

    const checkRecordToday = async () => {
      setShowButton(await checkRecordIfExists())
    }

    checkRecordToday()
    setIsLoading(false)
  }, [])

  return (
    <>
      <CustomModal
        opened={open}
        onClose={() => setOpen(false)}
        title="Clock Out"
      >
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.onSubmit(async (values) => {
            try {
              setLoading(true)
              await clockOut({ ...values })
              toast.success(`Clocked out at ${getHourNow()}`)
            } catch (error) {
              if (error instanceof FirebaseError) {
                toast.error(`${error}`)
              }
            } finally {
              setOpen(false)
              setShowButton(await checkRecordIfExists())
              setLoading(false)
            }
          })}
        >
          <DatePicker
            disabled
            label="Date"
            firstDayOfWeek="sunday"
            value={new Date()}
            icon={<FontAwesomeIcon icon={faCalendarDay} />}
            classNames={{ label: 'px-3' }}
          />
          <Switch
            label="Break Hours"
            checked={check}
            onChange={() => {
              check
                ? form.setFieldValue('breakDuration', [])
                : form.setFieldValue('breakDuration', [
                  breakInDefault,
                  breakOutDefault
                ])
              setCheck((prevState) => !prevState)
            }}
            classNames={{ root: 'my-2' }}
          />
          {check && (
            <>
              <Divider label="Miscellaneous" labelPosition="center" />
              <TimeRangeInput
                label="Break Hours"
                icon={<FontAwesomeIcon icon={faMugHot} />}
                classNames={{ label: 'px-3' }}
                {...form.getInputProps('breakDuration')}
              />
            </>
          )}
          <Button type="submit">Clock Out</Button>
        </form>
      </CustomModal>

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
                  toast.success(`Clocked in at ${getHourNow()}`)
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
              onClick={() => setOpen(true)}
            >
              Clock Out
            </Button>
          )}
        </div>
        <AsideCalendar />
      </div>
    </>
  )
}

export default Dashboard
