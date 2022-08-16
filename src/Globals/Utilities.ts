import moment from 'moment'

export const toSentenceCase = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  })
}

export const generateGreetings = (): string => {
  const hour = moment().hour()

  if (hour > 16) {
    return 'Good evening'
  }

  if (hour > 11) {
    return 'Good afternoon'
  }

  return 'Good morning'
}
