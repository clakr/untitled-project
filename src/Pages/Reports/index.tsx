import React, { useEffect, useState } from 'react'
import { Button, Divider, ScrollArea, Table } from '@mantine/core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useFirestore } from '../../Globals/FirestoreContext'
import { useUserContext } from '../../Routes/UserRoute'
import { DocumentData } from 'firebase/firestore'
import {
  checkIfNegative,
  formatUnixToDate,
  formatUnixToHours
} from '../../Globals/Utilities'

const Reports = () => {
  const { setIsLoading } = useUserContext()
  const { getTotalRecords, getUserRecords } = useFirestore()
  const [records, setRecords] = useState<DocumentData[] | null>(null)
  const INITIAL_LIMIT = 5
  const [limit, setLimit] = useState<number>(INITIAL_LIMIT)
  const [count, setCount] = useState<number>(0)
  const [totalRenderedHours, setTotalRenderedHours] = useState<number>(0)

  const getRecords = async (limit: number) => {
    const data = await getUserRecords(limit)
    setRecords(data)
  }

  const getCount = async () => {
    setCount((await getTotalRecords()).count)
  }

  const getTotalRenderedHours = async () => {
    setTotalRenderedHours((await getTotalRecords()).totalRenderedHours)
  }

  const RecordRow = () => {
    return (
      <>
        {records?.map((record) => {
          const { docId, date, recordIn, recordOut, breakIn, breakOut } = record
          const { seconds: dateUnix } = date
          const { seconds: recordInUnix } = recordIn

          return (
            <tr key={docId}>
              <td>{formatUnixToDate(dateUnix)}</td>
              <td>{formatUnixToHours(recordInUnix)}</td>
              <td>{formatUnixToHours(recordOut)}</td>
              <td>
                {breakIn && breakOut
                  ? (
                  <>
                    {`${formatUnixToHours(breakIn)} - ${formatUnixToHours(
                      breakOut
                    )}`}
                  </>
                    )
                  : (
                      'N/A'
                    )}
              </td>
              <td>{checkIfNegative(record.renderedHrs)}</td>
            </tr>
          )
        })}
      </>
    )
  }

  const RecordFooter = () => {
    return (
      <tfoot className="sticky bottom-0 bg-slate-50">
        <tr>
          <th colSpan={4} className="!text-right !text-xl">
            Total Rendered Hours:
          </th>
          <th className="!text-xl">{totalRenderedHours} Hours</th>
        </tr>
      </tfoot>
    )
  }

  useEffect(() => {
    setIsLoading(true)

    getRecords(limit)
    getCount()
    getTotalRenderedHours()
    setIsLoading(false)
  }, [limit])

  return (
    <div className="flex flex-col gap-y-1">
      <div className="mb-6 space-y-2">
        <h1 className="text-4xl font-semibold">Reports</h1>
        <Divider />
      </div>
      <ScrollArea className="h-[50vh]">
        <Table horizontalSpacing="xl" verticalSpacing="md" fontSize="md">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              <th>Date</th>
              <th>In</th>
              <th>Out</th>
              <th>Break Hours</th>
              <th>Rendered Hours</th>
            </tr>
          </thead>
          <tbody>
            <RecordRow />
            {records?.length !== count && (
              <tr>
                <td colSpan={5} className="text-center">
                  <Button
                    variant="light"
                    leftIcon={<FontAwesomeIcon icon={faSpinner} />}
                    onClick={() => setLimit((prev) => prev + INITIAL_LIMIT)}
                    classNames={{ root: '!w-full' }}
                  >
                    Load More
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
          <RecordFooter />
        </Table>
      </ScrollArea>
    </div>
  )
}

export default Reports
