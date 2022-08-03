import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, firestore, FirebaseError } from './Firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
  signOut
} from 'firebase/auth'
import { setDoc, doc, getDoc, DocumentData } from 'firebase/firestore'
import toast from 'react-hot-toast'

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
    return createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => {
        const docRef = doc(firestore, 'users', user.uid)
        setDoc(docRef, {
          email: user.email,
          qwe: 'asd'
        })
      },
      (error) => {
        toast.error(error, {
          duration: 2000
        })
      }
    )
  }

  const loginUser = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
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
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const docData = docSnap.data()
      return docData
    } else {
      throw new Error('User ID does not exist')
    }
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
