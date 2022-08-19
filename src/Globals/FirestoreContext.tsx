import React, { createContext, useContext } from 'react'
import moment from 'moment'
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where
} from 'firebase/firestore'

import { useAuth } from './AuthContext'
import { firestore } from './Firebase'

interface ContextInferface {
  checkDateIfExists: () => Promise<'in' | 'out'>
  clockIn: () => Promise<DocumentReference<DocumentData> | undefined>
  clockOut: () => Promise<void> | undefined
}

const FirestoreContext = createContext<ContextInferface>({} as ContextInferface)

export const useFirestore = () => {
  return useContext(FirestoreContext)
}

const FirestoreProvider = ({ children }: { children: JSX.Element }) => {
  const { authedUser } = useAuth()
  const recordRef = collection(firestore, 'record')
  const dateToday = moment().format('YYYY-MM-DD')

  const findDocId = async () => {
    let docId = ''
    const q = query(
      recordRef,
      where('userId', '==', authedUser?.uid),
      where('date', '==', dateToday),
      limit(1)
    )
    const qSnap = await getDocs(q)

    if (qSnap.empty) {
      return null
    }

    qSnap.forEach((doc) => {
      docId = doc.id
    })

    return docId
  }

  const checkDateIfExists = async () => {
    const docId = await findDocId()

    if (docId) {
      const docRef = doc(recordRef, docId)
      const docSnap = getDoc(docRef)
      const data = (await docSnap).data()

      if (data && data.out != null) {
        return 'in'
      }

      return 'out'
    }

    return 'in'
  }

  const clockIn = async () => {
    if (authedUser) {
      const now = moment().unix()

      return await addDoc(recordRef, {
        userId: authedUser.uid,
        date: dateToday,
        in: now,
        out: null,
        renderedHrs: null
      })
    }
  }

  const clockOut = async () => {
    const docId = await findDocId()
    if (authedUser && docId) {
      const docRef = doc(recordRef, docId)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()

      if (data) {
        const recordInHour = moment.unix(data.in).format('H')
        const recordOut = moment()
        const rendered = recordOut.subtract(recordInHour, 'hour')

        return await updateDoc(docRef, {
          out: recordOut.unix(),
          renderedHrs: rendered.hours()
        })
      }
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
