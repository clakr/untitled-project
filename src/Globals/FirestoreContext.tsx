import moment from 'moment'
import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { firestore } from './Firebase'
import { doc, setDoc, updateDoc } from 'firebase/firestore'

interface ContextInferface {
  clockIn: () => Promise<void> | undefined
  clockOut: () => Promise<void> | undefined
}

const FirestoreContext = createContext<ContextInferface>({} as ContextInferface)

export const useFirestore = () => {
  return useContext(FirestoreContext)
}

const FirestoreProvider = ({ children }: { children: JSX.Element }) => {
  const { authedUser } = useAuth()

  const clockIn = () => {
    if (authedUser) {
      const docRef = doc(firestore, 'record', authedUser?.uid)

      const dateToday = moment().format('YYYY-MM-DD')
      const now = moment().unix()

      return setDoc(docRef, {
        [dateToday]: {
          in: now,
          out: ''
        }
      })
    }
  }

  const clockOut = () => {
    if (authedUser) {
      const docRef = doc(firestore, 'record', authedUser?.uid)

      const dateToday = moment().format('YYYY-MM-DD')
      const now = moment().unix()

      return updateDoc(docRef, {
        [`${dateToday}.out`]: now
      })
    }
  }

  const value: ContextInferface = {
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
