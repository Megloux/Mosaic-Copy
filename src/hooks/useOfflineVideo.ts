import { useState, useEffect } from 'react'
import { getOrFetchMedia } from '@/lib/storage/mediaCache'
import { useNetworkStatus } from '@/lib/network/networkService'

/**
 * Hook for handling offline-capable video loading with fallbacks
 * 
 * @param url The original video URL to load
 * @param options Additional options for caching
 * @returns Object containing the loaded video URL, loading state, and error state
 */
export function useOfflineVideo(
  url: string | null | undefined,
  options?: {
    exerciseId?: string
    priority?: 'high' | 'medium' | 'low'
    onUnavailable?: () => void
  }
) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(!!url)
  const [error, setError] = useState<Error | null>(null)
  const [isAvailableOffline, setIsAvailableOffline] = useState(false)
  const { isOnline } = useNetworkStatus()

  useEffect(() => {
    // Reset states when URL changes
    setLoading(!!url)
    setError(null)
    setIsAvailableOffline(false)
    
    if (!url) {
      setVideoUrl(null)
      setLoading(false)
      return
    }

    const loadVideo = async () => {
      try {
        const cachedUrl = await getOrFetchMedia(
          url,
          'video',
          {
            exerciseId: options?.exerciseId,
            priority: options?.priority || 'medium'
          }
        )
        
        if (cachedUrl) {
          setVideoUrl(cachedUrl)
          setIsAvailableOffline(true)
        } else if (isOnline) {
          // If not cached but online, use original URL
          setVideoUrl(url)
          setIsAvailableOffline(false)
        } else {
          // If offline and not cached, video is unavailable
          setVideoUrl(null)
          setIsAvailableOffline(false)
          setError(new Error('Video not available offline'))
          options?.onUnavailable?.()
        }
      } catch (err) {
        console.error('Failed to load video:', err)
        setError(err instanceof Error ? err : new Error('Failed to load video'))
        setVideoUrl(null)
        options?.onUnavailable?.()
      } finally {
        setLoading(false)
      }
    }

    loadVideo()

    // Cleanup function to revoke object URLs
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [url, isOnline, options?.exerciseId, options?.priority, options?.onUnavailable])

  return { 
    videoUrl, 
    loading, 
    error, 
    isAvailableOffline 
  }
}
