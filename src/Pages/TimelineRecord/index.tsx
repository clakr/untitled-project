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

const RecordTimeline = () => {
  const { getUserRecords } = useFirestore()
  const [records, setRecords] = useState<DocumentData[] | null>(null)

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

    const recordFrom = dayjs().hour(9).minute(0).toDate()
    const recordTo = dayjs(recordFrom).add(9, 'hours').toDate()
    const [recordTime, setRecordTime] = useState<[Date, Date]>([
      recordFrom,
      recordTo
    ])
    const [opened, setOpened] = useState<boolean>(false)

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
          onClose={() => setOpened(false)}
          overlayColor="gray"
          overlayOpacity={0.55}
          overlayBlur={3}
          title="Add New Record"
          classNames={{ body: 'flex flex-col gap-y-4' }}
        >
          <DatePicker
            placeholder="January 1, 2022"
            label="Date"
            icon={<FontAwesomeIcon icon={faCalendarDay} />}
            classNames={{ label: 'px-3' }}
          />
          <TimeRangeInput
            label="Duration"
            value={recordTime}
            icon={<FontAwesomeIcon icon={faClock} />}
            classNames={{ label: 'px-3' }}
          />
          {/* TODO
            > date
            > in
            > out */}
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
          <h1>wala</h1>
            )}
      </>
    )
  }

  // const totalHours = (): ReactNode => {
  //   return records
  //     ?.map((doc) => doc.renderedHrs)
  //     .reduce((total, hrs) => total + hrs)
  // }

  useEffect(() => {
    const getRecords = async () => {
      const data = await getUserRecords()
      setRecords(data)
    }

    getRecords()
  }, [])

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
