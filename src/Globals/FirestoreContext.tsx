import React, { createContext, useContext } from 'react'
import dayjs from 'dayjs'
import {
  addDoc,
  collection,
  deleteDoc,
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
import { RecordType } from './Types'

interface ContextInferface {
  checkRecordIfExists: () => Promise<'in' | 'out'>
  clockIn: () => Promise<DocumentReference<DocumentData> | undefined>
  clockOut: ({
    breakDuration
  }: {
    breakDuration: Date[]
  }) => Promise<void> | undefined
  getUserRecords: () => Promise<DocumentData[] | null>
  addNewRecord: ({
    date,
    duration,
    breakDuration
  }: RecordType) => Promise<DocumentReference<DocumentData> | undefined>
  editRecord: ({
    docId,
    date,
    duration,
    breakDuration
  }: RecordType) => Promise<void>
  deleteRecord: (docId: string) => Promise<void>
}

const FirestoreContext = createContext<ContextInferface>({} as ContextInferface)

export const useFirestore = () => {
  return useContext(FirestoreContext)
}

const FirestoreProvider = ({ children }: { children: JSX.Element }) => {
  const { authedUser } = useAuth()
  const recordRef = collection(firestore, 'record')

  const findDocId = async () => {
    let docId = ''
    let max = 0

    const date = dayjs(new Date())
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate()

    const q = query(
      recordRef,
      where('userId', '==', authedUser?.uid),
      where('date', '==', date)
    )
    const qSnap = await getDocs(q)

    if (qSnap.empty) {
      return null
    }

    qSnap.forEach((doc) => {
      const recordIn = doc.data().recordIn

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

      if (data && data.recordOut != null) {
        return 'in'
      }

      return 'out'
    }

    return 'in'
  }

  const clockIn = async () => {
    if (authedUser) {
      const date = dayjs(new Date())
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate()
      const recordIn = new Date()

      return await addDoc(recordRef, {
        userId: authedUser.uid,
        date,
        recordIn,
        recordOut: null,
        breakIn: null,
        breakOut: null,
        renderedHrs: null
      })
    }
  }

  const clockOut = async ({ breakDuration }: { breakDuration: Date[] }) => {
    const docId = await findDocId()

    if (docId) {
      const docRef = doc(recordRef, docId)
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()

      if (data) {
        const recordIn = dayjs.unix(data.recordIn.seconds).toDate()
        const recordOut = dayjs().toDate()

        let breakIn: Date | null = null
        let breakOut: Date | null = null
        let renderedHrs = dayjs(recordOut).diff(dayjs(recordIn), 'hours')

        if (breakDuration.length > 0) {
          breakIn = breakDuration[0]
          breakOut = breakDuration[1]
          renderedHrs =
            dayjs(recordOut).diff(dayjs(recordIn), 'hour') -
            dayjs(breakOut).diff(dayjs(breakIn), 'hour')
        }

        return await updateDoc(docRef, {
          recordOut,
          breakIn,
          breakOut,
          renderedHrs
        })
      }
    }
  }

  const getUserRecords = async () => {
    const records: DocumentData[] | null = []
    const q = query(
      recordRef,
      where('userId', '==', authedUser?.uid),
      orderBy('recordIn', 'desc')
    )
    const qSnap = await getDocs(q)

    qSnap.forEach((doc) => {
      records.push({ docId: doc.id, ...doc.data() })
    })

    return records
  }

  const addNewRecord = async ({
    date,
    duration,
    breakDuration
  }: RecordType) => {
    if (authedUser) {
      const recordIn = duration[0]
      const recordOut = duration[1]

      let breakIn: Date | null = null
      let breakOut: Date | null = null
      let renderedHrs = dayjs(recordOut).diff(dayjs(recordIn), 'hours')

      if (breakDuration) {
        breakIn = breakDuration[0]
        breakOut = breakDuration[1]
        renderedHrs =
          dayjs(recordOut).diff(dayjs(recordIn), 'hour') -
          dayjs(breakOut).diff(dayjs(breakIn), 'hour')
      }

      return await addDoc(recordRef, {
        userId: authedUser.uid,
        date,
        recordIn,
        recordOut,
        breakIn: breakIn ?? null,
        breakOut: breakOut ?? null,
        renderedHrs
      })
    }
  }

  const editRecord = async ({
    docId,
    date,
    duration,
    breakDuration
  }: RecordType) => {
    const docRef = doc(recordRef, docId)

    const recordIn = duration[0]
    const recordOut = duration[1]

    let breakIn: Date | null = null
    let breakOut: Date | null = null
    let renderedHrs = dayjs(recordOut).diff(dayjs(recordIn), 'hours')

    if (breakDuration) {
      breakIn = breakDuration[0]
      breakOut = breakDuration[1]
      renderedHrs =
        dayjs(recordOut).diff(dayjs(recordIn), 'hour') -
        dayjs(breakOut).diff(dayjs(breakIn), 'hour')
    }

    return await updateDoc(docRef, {
      date,
      recordIn,
      recordOut,
      breakIn: breakIn ?? null,
      breakOut: breakOut ?? null,
      renderedHrs
    })
  }

  const deleteRecord = (docId: string) => {
    return deleteDoc(doc(recordRef, docId))
  }

  const value: ContextInferface = {
    checkRecordIfExists,
    clockIn,
    clockOut,
    getUserRecords,
    addNewRecord,
    editRecord,
    deleteRecord
  }

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  )
}

export default FirestoreProvider
