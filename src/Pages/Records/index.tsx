import React, { ReactNode, useEffect, useState } from 'react'
import { Divider, ScrollArea, Timeline } from '@mantine/core'
import { DocumentData } from 'firebase/firestore'

import { useFirestore } from '../../Globals/FirestoreContext'
import AsideCalendar from '../../Globals/Components/AsideCalendar'
import { formatDateToWord, formatUnixToHours } from '../../Globals/Utilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

const History = () => {
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

    useEffect(() => {
      if (records) {
        setTimelineActive(
          records.filter((records) => records.out != null).length - 1
        )
      }
    }, [])

    return (
      <>
        {records
          ? (
          <Timeline
            bulletSize={30}
            classNames={{ itemTitle: '!text-xl px-4' }}
            active={timelineActive}
            reverseActive
          >
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
          <h1 className="text-4xl font-semibold">Records</h1>
          <Divider />
        </div>
        <ScrollArea className="h-[70vh] w-full lg:h-[74vh] 2xl:h-[78vh]">
          <TimelineRecord />
        </ScrollArea>
      </div>
      <AsideCalendar />
    </div>
  )
}

export default History
