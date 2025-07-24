import { useState, useEffect } from 'react'
import { getOrFetchMedia } from '@/lib/storage/mediaCache'
import { useNetworkStatus } from '@/lib/network/networkService'

/**
 * Hook for handling offline-capable image loading with fallbacks
 * 
 * @param url The original image URL to load
 * @param options Additional options for caching
 * @returns Object containing the loaded image URL, loading state, and error state
 */
export function useOfflineImage(
  url: string | null | undefined,
  options?: {
    exerciseId?: string
    priority?: 'high' | 'medium' | 'low'
    placeholderUrl?: string
  }
) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!url)
  const [error, setError] = useState<Error | null>(null)
  const { isOnline } = useNetworkStatus()

  useEffect(() => {
    // Reset states when URL changes
    setLoading(!!url)
    setError(null)
    
    if (!url) {
      setImageUrl(options?.placeholderUrl || null)
      setLoading(false)
      return
    }

    const loadImage = async () => {
      try {
        const cachedUrl = await getOrFetchMedia(
          url,
          'image',
          {
            exerciseId: options?.exerciseId,
            priority: options?.priority || 'medium'
          }
        )
        
        if (cachedUrl) {
          setImageUrl(cachedUrl)
        } else if (isOnline) {
          // If not cached but online, use original URL
          setImageUrl(url)
        } else {
          // If offline and not cached, use placeholder
          setImageUrl(options?.placeholderUrl || null)
          setError(new Error('Image not available offline'))
        }
      } catch (err) {
        console.error('Failed to load image:', err)
        setError(err instanceof Error ? err : new Error('Failed to load image'))
        setImageUrl(options?.placeholderUrl || null)
      } finally {
        setLoading(false)
      }
    }

    loadImage()

    // Cleanup function to revoke object URLs
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [url, isOnline, options?.exerciseId, options?.priority, options?.placeholderUrl])

  return { imageUrl, loading, error }
}
