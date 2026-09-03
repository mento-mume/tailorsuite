// src/hooks/useFirestoreCollection.ts
import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useFirestoreCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[]

      setData(items)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [collectionName])

  return {data, isLoading}
}