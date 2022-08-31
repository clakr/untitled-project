import React, { useEffect, useState } from 'react'

import { DocumentData } from 'firebase/firestore'

import { Button, Divider, Menu, ScrollArea, Timeline } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faCalendarCheck,
  faCalendarPlus,
  faPenToSquare,
  faSliders,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'

import { useFirestore } from '../../Globals/FirestoreContext'
import { useUserContext } from '../../Routes/UserRoute'

import RecordModal from './RecordModal'
import DeleteModal from './DeleteModal'
import DescList from './DescList'

import {
  checkIfNegative,
  formatUnixToDate,
  formatUnixToHours
} from '../../Globals/Utilities'

const RecordTimeline = () => {
  const { setIsLoading } = useUserContext()
  const { getUserRecords } = useFirestore()
  const [records, setRecords] = useState<DocumentData[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const TimelineRecord = () => {
    const [timelineActive, setTimelineActive] = useState<number>(0)
    const [addOpen, setAddOpen] = useState<boolean>(false)
    const [editOpen, setEditOpen] = useState<boolean>(false)
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
    const [record, setRecord] = useState<DocumentData | null>(null)

    const ShowRecords = () => {
      return (
        <Timeline
          bulletSize={40}
          classNames={{
            itemTitle: '!text-2xl md:!text-3xl xl:!text-4xl pl-4 !text-gray-700'
          }}
          active={timelineActive}
          reverseActive
        >
          <Timeline.Item
            title="Add Record"
            lineVariant="dotted"
            bullet={<FontAwesomeIcon icon={faCalendarPlus} />}
          >
            <div className="flex h-[150px] py-4 2xl:px-8">
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

          {records?.map((record) => {
            const { docId, date, recordIn, recordOut, breakIn, breakOut } =
              record
            const { seconds: dateUnix } = date
            const { seconds: recordInUnix } = recordIn

            return (
              <Timeline.Item
                key={docId}
                title={formatUnixToDate(dateUnix)}
                lineVariant={recordOut ? 'solid' : 'dashed'}
                bullet={
                  recordOut
                    ? (
                    <FontAwesomeIcon icon={faCalendarCheck} />
                      )
                    : (
                    <FontAwesomeIcon icon={faCalendar} />
                      )
                }
              >
                <div className="flex flex-col justify-between gap-y-4 py-4 text-gray-400 sm:flex-row md:flex-col lg:flex-row 2xl:gap-x-8 2xl:px-8">
                  <div className="flex flex-col gap-y-2 2xl:flex-row 2xl:gap-x-20">
                    <div className="flex flex-col gap-y-2 2xl:min-w-[365px]">
                      <DescList
                        label="In: "
                        value={formatUnixToHours(recordInUnix)}
                      />
                      <DescList
                        label="Out: "
                        value={formatUnixToHours(recordOut)}
                      />
                      {breakIn && breakOut && (
                        <DescList
                          label="Break Time: "
                          value={`${formatUnixToHours(
                            breakIn
                          )} - ${formatUnixToHours(breakOut)}`}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <DescList label="Break Hour: " value="1 hour" />
                      <DescList
                        label="Rendered Hours: "
                        value={checkIfNegative(record.renderedHrs)}
                      />
                    </div>
                  </div>

                  {recordOut && (
                    <div className="flex items-center justify-center">
                      <Menu
                        shadow="md"
                        width={200}
                        classNames={{ item: 'gap-x-2' }}
                      >
                        <Menu.Target>
                          <Button
                            leftIcon={<FontAwesomeIcon icon={faSliders} />}
                            variant="subtle"
                            size="lg"
                            classNames={{
                              root: 'flex-1'
                            }}
                          >
                            Settings
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Settings</Menu.Label>
                          <Menu.Item
                            icon={
                              <FontAwesomeIcon
                                color="orange"
                                icon={faPenToSquare}
                              />
                            }
                            onClick={() => {
                              setEditOpen(true)
                              setRecord(record)
                            }}
                          >
                            Edit Record
                          </Menu.Item>
                          <Menu.Item
                            icon={
                              <FontAwesomeIcon color="red" icon={faTrashCan} />
                            }
                            onClick={() => {
                              setDeleteOpen(true)
                              setRecord(record)
                            }}
                          >
                            Delete Record
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  )}
                </div>
              </Timeline.Item>
            )
          })}
        </Timeline>
      )
    }

    const ShowAddRecord = () => {
      return (
        <Timeline
          bulletSize={40}
          classNames={{
            itemTitle: '!text-2xl md:!text-3xl xl:!text-4xl pl-4 !text-gray-700'
          }}
          reverseActive
        >
          <Timeline.Item
            title="Add Record"
            lineVariant="dotted"
            bullet={<FontAwesomeIcon icon={faCalendarPlus} />}
          >
            <div className="flex h-[150px]">
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
      )
    }

    useEffect(() => {
      if (records) {
        setTimelineActive(
          records.filter((records) => records.recordOut != null).length - 1
        )
      }
    }, [])

    return (
      <>
        <RecordModal
          loadingState={{ loading, setLoading }}
          opened={addOpen}
          onClose={() => {
            setRecord(null)
            setAddOpen(false)
          }}
          title="Add New Record"
        />

        <RecordModal
          loadingState={{ loading, setLoading }}
          opened={editOpen}
          onClose={() => {
            setRecord(null)
            setEditOpen(false)
          }}
          title="Edit Record"
          record={record}
        />

        <DeleteModal
          loadingState={{ loading, setLoading }}
          opened={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          record={record}
          setDeleteOpen={setDeleteOpen}
        />

        {records ? <ShowRecords /> : <ShowAddRecord />}
      </>
    )
  }

  useEffect(() => {
    setIsLoading(true)
    const getRecords = async () => {
      const data = await getUserRecords(0)
      setRecords(data)
    }

    getRecords()
    setIsLoading(false)
  }, [loading])

  return (
    <div className="flex flex-col gap-y-1">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-semibold">Timeline</h1>
        <Divider />
      </div>
      <ScrollArea className="h-full w-full 2xl:h-[75vh]">
        <TimelineRecord />
      </ScrollArea>
    </div>
  )
}

export default RecordTimeline
