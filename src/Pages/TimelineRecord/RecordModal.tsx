import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Divider, Modal, ModalProps, Switch } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'

import { AddRecordType } from '../../Globals/Types'
import { useFirestore } from '../../Globals/FirestoreContext'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDay,
  faClock,
  faMugHot
} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'

interface RecordModalInterface extends ModalProps {
  loadingState: {
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  }
}

const RecordModal: React.FC<RecordModalInterface> = ({
  loadingState: { loading, setLoading },
  ...rest
}) => {
  const { addNewRecord } = useFirestore()
  const [switchChecked, setSwitchChecked] = useState<boolean>(true)
  const isXS = useMediaQuery('(min-width: 450px)')

  const initialValues: AddRecordType = {
    date: '' as unknown as Date,
    duration: [],
    breakDuration: []
  }

  const initialDirty = {
    date: false,
    duration: false,
    breakDuration: false
  }

  const form = useForm<AddRecordType>({
    initialValues,
    initialDirty
  })

  return (
    <Modal
      overlayColor="gray"
      overlayOpacity={0.55}
      overlayBlur={3}
      title="Add New Record"
      size={isXS ? 440 : 300}
      classNames={{ modal: '!ml-0' }}
      {...rest}
    >
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.onSubmit(async (values) => {
          try {
            setLoading(true)
            await addNewRecord({ ...values })
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
          {...form.getInputProps('duration')}
          disabled={!form.isDirty('date')}
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
              {...form.getInputProps('breakDuration')}
              disabled={!form.isDirty('date')}
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
        <Button type="submit" classNames={{ root: 'my-2' }} loading={loading}>
          Add Record
        </Button>
      </form>
    </Modal>
  )
}

export default RecordModal
