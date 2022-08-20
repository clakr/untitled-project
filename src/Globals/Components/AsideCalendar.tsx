import React, { useState } from 'react'
import { Aside, Divider } from '@mantine/core'
import { Month } from '@mantine/dates'

const AsideCalendar = () => {
  const [month, setMonth] = useState(new Date())

  return (
    <Aside
      hidden
      hiddenBreakpoint="lg"
      width={{ lg: 300 }}
      classNames={{ root: 'flex flex-col gap-y-2 p-4' }}
    >
      <h2 className="text-2xl font-bold">Calendar</h2>
      <Divider />
      <Month month={month} value={month} firstDayOfWeek="sunday" />
    </Aside>
  )
}

export default AsideCalendar
