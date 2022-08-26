import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Divider, ModalProps, Switch } from '@mantine/core'
import { useForm } from '@mantine/form'

import { RecordType } from '../../Globals/Types'
import { useFirestore } from '../../Globals/FirestoreContext'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDay,
  faClock,
  faMugHot
} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import { DocumentData } from 'firebase/firestore'
import CustomModal from '../../Globals/Components/CustomModal'

interface RecordModalInterface extends ModalProps {
  loadingState: {
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  }
  record?: DocumentData | null
}

const RecordModal: React.FC<RecordModalInterface> = ({
  loadingState: { loading, setLoading },
  record,
  ...rest
}) => {
  const { addNewRecord, editRecord } = useFirestore()
  const [switchChecked, setSwitchChecked] = useState<boolean>(true)

  const initialValues: RecordType = {
    date: '' as unknown as Date,
    duration: [],
    breakDuration: []
  }

  const initialDirty = {
    date: false,
    duration: false,
    breakDuration: false
  }

  const form = useForm<RecordType>({
    initialValues,
    initialErrors: {
      date: '',
      duration: '',
      breakDuration: ''
    },
    initialDirty
  })

  useEffect(() => {
    if (record) {
      const { date, recordIn, recordOut, breakIn, breakOut } = record
      const { seconds: dateUnix } = date
      const { seconds: recordInUnix } = recordIn
      const { seconds: recordOutUnix } = recordOut

      let breakInDate: Date = new Date()
      let breakOutDate: Date = new Date()

      setSwitchChecked(false)
      if (breakIn && breakOut) {
        breakInDate = dayjs.unix(breakIn.seconds).toDate()
        breakOutDate = dayjs.unix(breakOut.seconds).toDate()
        setSwitchChecked(true)
      }

      form.setValues({
        date: dayjs.unix(dateUnix).toDate(),
        duration: [
          dayjs.unix(recordInUnix).toDate(),
          dayjs.unix(recordOutUnix).toDate()
        ],
        breakDuration: [breakInDate, breakOutDate]
      })

      form.clearErrors()

      form.setDirty({
        date: true
      })
    }
  }, [record])

  return (
    <>
      <CustomModal {...rest}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.onSubmit(async (values) => {
            try {
              setLoading(true)
              record
                ? await editRecord({ docId: record.docId, ...values })
                : await addNewRecord({ ...values })
            } catch (error) {
              toast.error(`${error}`)
            } finally {
              setLoading(false)
            }
          })}
        >
          <DatePicker
            placeholder="January 1, 2022"
            label="Date"
            icon={<FontAwesomeIcon icon={faCalendarDay} />}
            firstDayOfWeek="sunday"
            classNames={{ label: 'px-3' }}
            required
            {...form.getInputProps('date')}
            onChange={(value) => {
              form.setFieldValue('duration', [
                dayjs(value).hour(9).second(0).toDate(),
                dayjs(value).hour(18).second(0).toDate()
              ])
              switchChecked &&
                form.setFieldValue('breakDuration', [
                  dayjs(value).hour(12).second(0).toDate(),
                  dayjs(value).hour(13).second(0).toDate()
                ])

              form.setFieldValue('date', value)
            }}
          />
          <TimeRangeInput
            label="Duration"
            icon={<FontAwesomeIcon icon={faClock} />}
            classNames={{ label: 'px-3' }}
            disabled={!form.isDirty('date')}
            {...form.getInputProps('duration')}
            onChange={(value) =>
              form.setFieldValue(
                'duration',
                value.map((time) =>
                  dayjs(form.values.date).hour(time.getHours()).toDate()
                )
              )
            }
          />
          <Switch
            label="Break Hours"
            checked={switchChecked}
            onChange={() => {
              form.setFieldValue('breakDuration', [])
              setSwitchChecked((prevState) => !prevState)
            }}
            classNames={{ root: 'my-2' }}
          />
          {switchChecked && (
            <>
              <Divider label="Miscellaneous" labelPosition="center" />
              <TimeRangeInput
                label="Break Hours"
                icon={<FontAwesomeIcon icon={faMugHot} />}
                classNames={{ label: 'px-3' }}
                disabled={!form.isDirty('date')}
                {...form.getInputProps('breakDuration')}
                onChange={(value) =>
                  form.setFieldValue(
                    'breakDuration',
                    value.map((time) =>
                      dayjs(form.values.date).hour(time.getHours()).toDate()
                    )
                  )
                }
              />
            </>
          )}
          <Button
            type="submit"
            classNames={{ root: 'my-2' }}
            loading={loading}
            disabled={Object.keys(form.errors).length !== 0}
          >
            {record ? 'Edit Record' : 'Add Record'}
          </Button>
        </form>
      </CustomModal>
    </>
  )
}

export default RecordModal
