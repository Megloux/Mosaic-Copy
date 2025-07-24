import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { getFromStore, saveToStore } from '@/lib/storage/db'
import { isOffline } from '@/lib/supabase/client'
import { ApiError } from '@/lib/supabase/api'

export function useOfflineData<T>(
  key: QueryKey,
  storeName: 'categories' | 'exercises' | 'blocks' | 'templates',
  fetchFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      try {
        // Try to get from IndexedDB first
        const cached = await getFromStore(storeName, key.join(':'))
        if (cached) return cached as T

        // If offline and no cache, throw error
        if (isOffline()) {
          throw new ApiError('No cached data available while offline')
        }

        // Fetch fresh data
        const data = await fetchFn()

        // Cache the results
        await saveToStore(storeName, {
          id: key.join(':'),
          ...data
        })

        return data
      } catch (err) {
        console.error(`Failed to fetch ${storeName}:`, err)
        throw err
      }
    },
    ...options,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
  })
}
