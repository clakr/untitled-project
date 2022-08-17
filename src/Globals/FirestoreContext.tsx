import React, { createContext, useContext } from 'react'
import moment from 'moment'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

import { useAuth } from './AuthContext'
import { firestore } from './Firebase'
import { User } from 'firebase/auth'

interface ContextInferface {
  checkDateIfExists: () => Promise<'in' | 'out'>
  clockIn: () => Promise<void> | undefined
  clockOut: () => Promise<void> | undefined
}

const FirestoreContext = createContext<ContextInferface>({} as ContextInferface)

export const useFirestore = () => {
  return useContext(FirestoreContext)
}

const FirestoreProvider = ({ children }: { children: JSX.Element }) => {
  const { authedUser } = useAuth()
  const docRef = doc(firestore, 'record', (authedUser as User).uid)
  const dateToday = moment().format('YYYY-MM-DD')

  const checkDateIfExists = async () => {
    const docSnap = getDoc(docRef)
    const data = (await docSnap).data()

    if (data) {
      if (dateToday in data && data[dateToday].out == null) {
        return 'out'
      }
    }

    return 'in'
  }

  const clockIn = async () => {
    if (authedUser) {
      const now = moment().unix()

      try {
        setDoc(docRef, {})
        updateDoc(docRef, {
          [dateToday]: {
            in: now,
            out: null
          }
        })
      } catch (error) {
        toast.error(`${error}`)
      }
    }
  }

  const clockOut = () => {
    if (authedUser) {
      const docRef = doc(firestore, 'record', authedUser?.uid)

      const now = moment().unix()

      return updateDoc(docRef, {
        [`${dateToday}.out`]: now
      })
    }
  }

  const value: ContextInferface = {
    checkDateIfExists,
    clockIn,
    clockOut
  }

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  )
}

export default FirestoreProvider
