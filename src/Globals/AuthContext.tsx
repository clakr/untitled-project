import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
  signOut,
  updateProfile
} from 'firebase/auth'
import { setDoc, doc, getDoc, DocumentData } from 'firebase/firestore'

import { auth, firestore, FirebaseError } from './Firebase'

interface EmailPasswordInterface {
  email: string
  password: string
}

interface FullNameInterface {
  first: string
  last: string
  middle: string
}

interface UpdateUserInterface extends FullNameInterface {
  user: User
}

interface ContextInferface {
  authedUser: User | null
  createUser: ({ email, password }: EmailPasswordInterface) => Promise<User>
  updateUserDisplayName: ({
    user,
    first,
    last,
    middle
  }: UpdateUserInterface) => Promise<void>
  userSetDoc: ({
    user,
    first,
    last,
    middle
  }: UpdateUserInterface) => Promise<void>
  loginUser: (email: string, password: string) => Promise<UserCredential>
  logoutUser: () => Promise<void>
  getUser: () => Promise<DocumentData | undefined>
  showError: (error: unknown) => void
}

const AuthContext = createContext<ContextInferface>({} as ContextInferface)

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [authedUser, setAuthedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthedUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const createUser = ({ email, password }: EmailPasswordInterface) => {
    const promise = createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => {
        return user
      }
    )

    return promise
  }

  const updateUserDisplayName = ({
    user,
    first,
    last,
    middle
  }: UpdateUserInterface) => {
    const promise = updateProfile(user, {
      displayName: `${first} ${middle}. ${last}`
    })

    return promise
  }

  const userSetDoc = ({ user, first, last, middle }: UpdateUserInterface) => {
    const docRef = doc(firestore, 'users', user.uid)

    const promise = setDoc(docRef, {
      name: {
        first,
        last,
        middle
      },
      email: user.email
    })

    return promise
  }

  const loginUser = (email: string, password: string) => {
    const promise = signInWithEmailAndPassword(auth, email, password)

    toast.promise(promise, {
      loading: 'Loading...',
      success: 'Login Success',
      error: (error) => error.code
    })

    return promise
  }

  const logoutUser = () => {
    return signOut(auth)
  }

  const getUser = async () => {
    const docRef = doc(firestore, 'users', (authedUser as User).uid)
    const docData = await getDoc(docRef).then(
      (data) => {
        return data.data()
      },
      () => {
        throw new Error('User ID does not exist')
      }
    )
    return docData
  }

  const showError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      toast.error(`${error.code}`)
      return
    }

    toast.error(`${error}`)
  }

  const value = {
    authedUser,
    createUser,
    updateUserDisplayName,
    userSetDoc,
    loginUser,
    logoutUser,
    getUser,
    showError
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
