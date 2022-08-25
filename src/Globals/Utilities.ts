import dayjs from 'dayjs'
import { ReactNode } from 'react'

type NameType = string | undefined | null

export const toSentenceCase = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  })
}

export const getAcronym = (name: NameType): NameType => {
  if (name) {
    name = name
      ?.split(' ')
      .reduce((accumulator, word) => accumulator + word.charAt(0), '')

    return `${name[0] + name[name.length - 1]}`
  }

  return null
}

export const generateGreetings = (): string => {
  const hour = dayjs().hour()

  if (hour > 16) {
    return 'Good evening'
  }

  if (hour > 11) {
    return 'Good afternoon'
  }

  return 'Good morning'
}

export const formatUnixToDate = (date: number): ReactNode => {
  return dayjs.unix(date).format('MMMM DD, YYYY')
}

export const formatUnixToHours = (unix: number | null): ReactNode => {
  if (unix) {
    return dayjs.unix(unix).format('hh:mm A')
  }

  return 'N/A'
}

// const totalHours = (): ReactNode => {
//   return records
//     ?.map((doc) => doc.renderedHrs)
//     .reduce((total, hrs) => total + hrs)
// }
