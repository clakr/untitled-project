import React, { createContext, useContext } from 'react'
import dayjs from 'dayjs'
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'

import { useAuth } from './AuthContext'
import { firestore } from './Firebase'
import { AddRecordType } from './Types'

interface ContextInferface {
  checkRecordIfExists: () => Promise<'in' | 'out'>
  clockIn: () => Promise<DocumentReference<DocumentData> | undefined>
  clockOut: () => Promise<void> | undefined
  getUserRecords: () => Promise<DocumentData[] | null>
  addNewRecord: ({
    date,
    duration
  }: AddRecordType) => Promise<DocumentReference<DocumentData> | undefined>
}

const FirestoreContext = createContext<ContextInferface>({} as ContextInferface)

export const useFirestore = () => {
  return useContext(FirestoreContext)
}

const FirestoreProvider = ({ children }: { children: JSX.Element }) => {
  const { authedUser } = useAuth()
  const recordRef = collection(firestore, 'record')
  const dateToday = dayjs().format('YYYY-MM-DD')

  const findDocId = async () => {
    let docId = ''
    let max = 0

    const q = query(
      recordRef,
      where('userId', '==', authedUser?.uid),
      where('date', '==', dateToday)
    )
    const qSnap = await getDocs(q)

    if (qSnap.empty) {
      return null
    }

    qSnap.forEach((doc) => {
      const recordIn = doc.data().in

      if (max <= recordIn) {
        docId = doc.id
        max = max <= recordIn ? recordIn : max
      }
    })

    return docId
  }

  const checkRecordIfExists = async () => {
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
      const now = dayjs().unix()

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
        const recordInHour = +dayjs.unix(data.in).format('H')
        const recordOut = dayjs()
        const renderedHrs = recordOut.subtract(recordInHour, 'hour').hour()

        return await updateDoc(docRef, {
          out: recordOut.unix(),
          renderedHrs
        })
      }
    }
  }

  const getUserRecords = async () => {
    const records: DocumentData[] = []
    const q = query(
      recordRef,
      where('userId', '==', authedUser?.uid),
      orderBy('in', 'desc')
    )
    const qSnap = await getDocs(q)

    qSnap.forEach((doc) => {
      records.push({ docId: doc.id, ...doc.data() })
    })

    if (records.length > 0) {
      return records
    }

    return null
  }

  const addNewRecord = async ({ date, duration }: AddRecordType) => {
    const recordInHour = +dayjs(duration[0]).format('H')
    const recordOut = dayjs(duration[1])
    const renderedHrs = recordOut.subtract(recordInHour, 'hour').hour()

    if (authedUser) {
      return await addDoc(recordRef, {
        userId: authedUser.uid,
        date: dayjs(date).format('YYYY-MM-DD'),
        in: dayjs(duration[0]).unix(),
        out: dayjs(duration[1]).unix(),
        renderedHrs
      })
    }
  }

  const value: ContextInferface = {
    checkRecordIfExists,
    clockIn,
    clockOut,
    getUserRecords,
    addNewRecord
  }

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  )
}

export default FirestoreProvider
