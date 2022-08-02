import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, FirebaseError } from './Firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
  signOut
} from 'firebase/auth'
import toast from 'react-hot-toast'

interface propInterface {
  children: JSX.Element
}

interface contextInterface {
  authedUser: User | null | undefined
  createUser: (email: string, password: string) => Promise<UserCredential>
  loginUser: (email: string, password: string) => Promise<UserCredential>
  logoutUser: () => Promise<void>
  showError: (error: FirebaseError) => void
}

const AuthContext = createContext<contextInterface>({} as contextInterface)

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }: propInterface) => {
  //
  const [authedUser, setAuthedUser] = useState<User | null>()
  const [loading, setLoading] = useState(true)

  const createUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthedUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    authedUser,
    createUser,
    loginUser,
    logoutUser,
    showError
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
