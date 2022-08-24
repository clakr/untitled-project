import React, { useEffect, useState } from 'react'

import { DocumentData } from 'firebase/firestore'

import { Button, Divider, ScrollArea, Timeline } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faCalendarCheck,
  faCalendarPlus,
  faSliders
} from '@fortawesome/free-solid-svg-icons'

import { useFirestore } from '../../Globals/FirestoreContext'
import { useUserContext } from '../../Routes/UserRoute'

import AsideCalendar from '../../Globals/Components/AsideCalendar'
import RecordModal from './RecordModal'
import DescList from './DescList'

import { formatDateToWord, formatUnixToHours } from '../../Globals/Utilities'

const RecordTimeline = () => {
  const { setIsLoading } = useUserContext()
  const { getUserRecords } = useFirestore()
  const [records, setRecords] = useState<DocumentData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const TimelineRecord = () => {
    const [timelineActive, setTimelineActive] = useState<number>(0)
    const [addOpen, setAddOpen] = useState<boolean>(false)
    const [editOpen, setEditOpen] = useState<boolean>(false)

    useEffect(() => {
      if (records) {
        setTimelineActive(
          records.filter((records) => records.out != null).length - 1
        )
      }
    }, [])

    return (
      <>
        <RecordModal
          loadingState={{ loading, setLoading }}
          opened={addOpen}
          onClose={() => {
            setAddOpen(false)
          }}
          title="Add New Record"
        />
        <RecordModal
          loadingState={{ loading, setLoading }}
          opened={editOpen}
          onClose={() => {
            setEditOpen(false)
          }}
          title="Edit Record"
        />

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
                  onClick={() => {
                    setAddOpen(true)
                  }}
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
                  <div className="flex flex-col gap-y-4 px-8 py-2 text-gray-400 2xl:flex-row 2xl:gap-x-20">
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
                    {out && (
                      <div className="flex items-center justify-center">
                        <Button
                          leftIcon={<FontAwesomeIcon icon={faSliders} />}
                          variant="subtle"
                          size="lg"
                          classNames={{ root: 'flex-1' }}
                          onClick={() => {
                            setEditOpen(true)
                            console.log(docId)
                          }}
                        >
                          Settings
                        </Button>
                      </div>
                    )}
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
                  onClick={() => setAddOpen(true)}
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
