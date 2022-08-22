import { useEffect } from 'react'
import { useUserContext } from '../Routes/UserRoute'
import { useFirestore } from './FirestoreContext'

export const useFetchRecords = () => {
  const { setIsLoading } = useUserContext()
  const { getUserRecords } = useFirestore()

  useEffect(() => {
    setIsLoading(true)
    const getRecords = async () => {
      const data = await getUserRecords()
      setRecords(data)
    }

    getRecords()
    setIsLoading(false)
  }, [])
}
