import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
  signOut
} from 'firebase/auth'
import { setDoc, doc, getDoc, DocumentData } from 'firebase/firestore'

import { auth, firestore, FirebaseError } from './Firebase'
interface propInterface {
  children: JSX.Element
}

interface contextInterface {
  authedUser: User | null | undefined
  createUser: (email: string, password: string) => Promise<void>
  loginUser: (email: string, password: string) => Promise<UserCredential>
  logoutUser: () => Promise<void>
  showError: (error: FirebaseError) => void
  getUser: () => Promise<DocumentData | undefined>
}

const AuthContext = createContext<contextInterface>({} as contextInterface)

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }: propInterface) => {
  //
  const [authedUser, setAuthedUser] = useState<User | null>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthedUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const createUser = (email: string, password: string) => {
    const promise = createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => {
        const docRef = doc(firestore, 'users', user.uid)
        setDoc(docRef, {
          email: user.email
        })
      }
    )

    toast.promise(promise, {
      loading: 'Loading...',
      success: 'Register Success',
      error: (error) => error.code
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

  const showError = (error: FirebaseError) => {
    toast.error(error.code, {
      duration: 2000
    })
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

  const value = {
    authedUser,
    createUser,
    loginUser,
    logoutUser,
    showError,
    getUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
