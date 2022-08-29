import { DocumentData } from 'firebase/firestore'

export interface User extends DocumentData {
  name: {
    first: string
    last: string
    middle: string
  }
  email: string
}

export interface Record extends DocumentData {
  docId?: string
  date: Date | null
  duration: Array<Date>
  breakDuration: Array<Date> | null
}
