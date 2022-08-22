import React, { ReactNode, useEffect, useState } from 'react'
import { Button, Divider, Modal, ScrollArea, Timeline } from '@mantine/core'
import { DocumentData } from 'firebase/firestore'

import { useFirestore } from '../../Globals/FirestoreContext'
import AsideCalendar from '../../Globals/Components/AsideCalendar'
import { formatDateToWord, formatUnixToHours } from '../../Globals/Utilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faCalendarCheck,
  faCalendarDay,
  faCalendarPlus,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useForm } from '@mantine/form'
import { useUserContext } from '../../Routes/UserRoute'
import { AddRecordType } from '../../Globals/Types'
import toast from 'react-hot-toast'

const initialValues: AddRecordType = {
  date: new Date(),
  duration: []
}

const initialDirty = {
  date: false,
  duration: false
}

const RecordTimeline = () => {
  const { setIsLoading } = useUserContext()
  const { getUserRecords, addNewRecord } = useFirestore()
  const [records, setRecords] = useState<DocumentData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const DescList = ({ label, value }: { label: string; value: ReactNode }) => {
    return (
      <dl className="flex gap-x-2">
        <dl className="min-w-[140px] xs:min-w-[200px]">{label}</dl>

        <dd className="whitespace-nowrap font-bold text-gray-500">
          {value ?? 'N/A'}
        </dd>
      </dl>
    )
  }

  const TimelineRecord = () => {
    const [timelineActive, setTimelineActive] = useState<number>(0)
    const [opened, setOpened] = useState<boolean>(false)

    const form = useForm<AddRecordType>({
      initialValues,
      initialDirty
    })

    useEffect(() => {
      if (records) {
        setTimelineActive(
          records.filter((records) => records.out != null).length - 1
        )
      }
    }, [])

    return (
      <>
        <Modal
          opened={opened}
          onClose={() => {
            setOpened(false)
            form.reset()
          }}
          overlayColor="gray"
          overlayOpacity={0.55}
          overlayBlur={3}
          title="Add New Record"
        >
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.onSubmit(async (values) => {
              setLoading(true)
              try {
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
              classNames={{ label: 'px-3' }}
              {...form.getInputProps('date')}
              onChange={(value) => {
                form.setFieldValue('duration', [
                  dayjs(value).hour(9).second(0).toDate(),
                  dayjs(value).hour(18).second(0).toDate()
                ])
                form.setFieldValue('date', value)
              }}
            />
            <TimeRangeInput
              label="Duration"
              icon={<FontAwesomeIcon icon={faClock} />}
              classNames={{ label: 'px-3' }}
              {...form.getInputProps('duration')}
              onChange={(value) => console.log(value)}
              disabled={!form.isDirty('date')}
            />
            <Button
              type="submit"
              classNames={{ root: 'my-2' }}
              loading={loading}
            >
              Add Record
            </Button>
          </form>
        </Modal>

        {records
          ? (
          <Timeline
            bulletSize={40}
            classNames={{ itemTitle: '!text-3xl px-4' }}
            active={timelineActive}
            reverseActive
          >
            <Timeline.Item
              title="Add Record"
              lineVariant="dotted"
              bullet={<FontAwesomeIcon icon={faCalendarPlus} />}
            >
              <div className="flex h-[150px] px-8 py-4">
                <Button
                  onClick={() => setOpened(true)}
                  color="dark"
                  variant="subtle"
                  classNames={{
                    root: 'flex-1 !h-full group',
                    label:
                      'flex flex-col justify-center gap-y-2 group-hover:text-slate-50 text-gray-400'
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarPlus} size="3x" />
                  <h3 className="text-xs">Add new record for specific date</h3>
                </Button>
              </div>
            </Timeline.Item>
            {records.map(({ docId, date, in: recordIn, out, renderedHrs }) => {
              return (
                <Timeline.Item
                  key={docId}
                  title={formatDateToWord(date)}
                  lineVariant={out ? 'solid' : 'dashed'}
                  bullet={
                    out
                      ? (
                      <FontAwesomeIcon icon={faCalendarCheck} />
                        )
                      : (
                      <FontAwesomeIcon icon={faCalendar} />
                        )
                  }
                >
                  <div className="flex flex-col gap-y-8 px-8 py-2 text-gray-400 2xl:flex-row 2xl:gap-x-20">
                    <div className="flex flex-col gap-y-2">
                      <DescList
                        label="In: "
                        value={formatUnixToHours(recordIn)}
                      />
                      <DescList label="Out: " value={formatUnixToHours(out)} />
                      <DescList
                        label="Rendered Hours: "
                        value={
                          renderedHrs != null ? `${renderedHrs} hours` : null
                        }
                      />
                    </div>
                    <div className="flex flex-1 items-center text-center">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Repellendus explicabo aut itaque nesciunt aliquid
                      voluptate ratione, quis at distinctio repellat!
                    </div>
                  </div>
                </Timeline.Item>
              )
            })}
          </Timeline>
            )
          : (
          <Timeline
            bulletSize={40}
            classNames={{ itemTitle: '!text-3xl px-4' }}
            reverseActive
          >
            <Timeline.Item
              title="Add Record"
              lineVariant="dotted"
              bullet={<FontAwesomeIcon icon={faCalendarPlus} />}
            >
              <div className="flex h-[150px] px-8 py-4">
                <Button
                  onClick={() => setOpened(true)}
                  color="dark"
                  variant="subtle"
                  classNames={{
                    root: 'flex-1 !h-full group',
                    label:
                      'flex flex-col justify-center gap-y-2 group-hover:text-slate-50 text-gray-400'
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarPlus} size="3x" />
                  <h3 className="text-xs">Add new record for specific date</h3>
                </Button>
              </div>
            </Timeline.Item>
          </Timeline>
            )}
      </>
    )
  }

  useEffect(() => {
    setIsLoading(true)
    const getRecords = async () => {
      const data = await getUserRecords()
      setRecords(data)
    }

    getRecords()
    setIsLoading(false)
  }, [loading])

  return (
    <div className="flex h-full gap-x-4">
      <div className="flex flex-1 flex-col gap-y-1">
        <div className="mb-6 space-y-2">
          <h1 className="text-4xl font-semibold">Timeline</h1>
          <Divider />
        </div>
        <ScrollArea className="h-[75vh] w-full">
          <TimelineRecord />
        </ScrollArea>
      </div>
      <AsideCalendar />
    </div>
  )
}

export default RecordTimeline
