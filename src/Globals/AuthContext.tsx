import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  updateProfile,
  sendEmailVerification
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
  sendEmailVerificationToUser: (user: User) => Promise<void>
  checkUserIfVerified: () => Promise<boolean | undefined>
  loginUser: (email: string, password: string) => Promise<void>
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

  const createUser = async ({ email, password }: EmailPasswordInterface) => {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => {
        return user
      }
    )
  }

  const updateUserDisplayName = ({
    user,
    first,
    last,
    middle
  }: UpdateUserInterface) => {
    return updateProfile(user, {
      displayName: `${first} ${middle}. ${last}`
    })
  }

  const userSetDoc = ({ user, first, last, middle }: UpdateUserInterface) => {
    const docRef = doc(firestore, 'users', user.uid)

    return setDoc(docRef, {
      name: {
        first,
        last,
        middle
      },
      email: user.email
    })
  }

  const sendEmailVerificationToUser = (user: User) => {
    return sendEmailVerification(user)
  }

  const checkUserIfVerified = async () => {
    await authedUser?.reload()

    return authedUser?.emailVerified
  }

  const loginUser = (email: string, password: string) => {
    const promise = signInWithEmailAndPassword(auth, email, password).then(
      ({ user }) => {
        if (!user.emailVerified) {
          throw new Error('User email not verified')
        }
      }
    )

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
    sendEmailVerificationToUser,
    checkUserIfVerified,
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
