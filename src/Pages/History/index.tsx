import React, { useEffect, useState } from 'react'
import { Divider, ScrollArea, Table } from '@mantine/core'
import { DocumentData } from 'firebase/firestore'

import { useFirestore } from '../../Globals/FirestoreContext'
import AsideCalendar from '../../Globals/Components/AsideCalendar'
import { formatDateToWord, formatUnixToHours } from '../../Globals/Utilities'

const History = () => {
  const { getUserRecords } = useFirestore()
  const [records, setRecords] = useState<DocumentData[] | null>(null)

  const tableRows = (
    <>
      {records
        ? (
        <>
          {records.map(({ docId, date, in: recordIn, out, renderedHrs }) => (
            <tr key={docId}>
              <td>{formatDateToWord(date)}</td>
              <td>{formatUnixToHours(recordIn)}</td>
              <td>{formatUnixToHours(out)}</td>
              <td>{renderedHrs} hrs.</td>
            </tr>
          ))}
        </>
          )
        : (
        <tr>
          <td className="text-center" colSpan={4}>
            No data available.
          </td>
        </tr>
          )}
    </>
  )

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
          <h1 className="text-3xl font-semibold">History</h1>
          <Divider />
        </div>
        <ScrollArea className="h-[70vh] w-[85vw] xs:w-full">
          <Table
            horizontalSpacing="xl"
            verticalSpacing="md"
            fontSize="md"
            highlightOnHover
          >
            <thead className="sticky top-0 bg-gray-50">
              <tr className="w-fit">
                <th>Date</th>
                <th>In</th>
                <th>Out</th>
                <th className="whitespace-nowrap">Rendered Hours</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </Table>
        </ScrollArea>
      </div>
      <AsideCalendar />
    </div>
  )
}

export default History
