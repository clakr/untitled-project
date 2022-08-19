import React, { ReactNode, useEffect, useState } from 'react'
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
              <td className="text-center">{renderedHrs} hours</td>
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

  const totalHours = (): ReactNode => {
    return records
      ?.map((doc) => doc.renderedHrs)
      .reduce((total, hrs) => total + hrs)
  }

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
        <ScrollArea className="h-[70vh] w-[85vw] xs:w-full">
          <Table
            horizontalSpacing="xl"
            verticalSpacing="md"
            fontSize="md"
            highlightOnHover
            className="table-auto"
          >
            <thead className="sticky top-0 bg-gray-50">
              <tr className="w-fit">
                <th>Date</th>
                <th>In</th>
                <th>Out</th>
                <th className="whitespace-nowrap !text-center">
                  Rendered Hours
                </th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
            {records && (
              <tfoot className="sticky bottom-0 bg-gray-50">
                <tr>
                  <th className="!text-right" colSpan={3}>
                    Total Hours:
                  </th>
                  <th className="!text-center">{totalHours()} hours</th>
                </tr>
              </tfoot>
            )}
          </Table>
        </ScrollArea>
      </div>
      <AsideCalendar />
    </div>
  )
}

export default History
