import { useState, useEffect, useRef } from 'react'
import { useOfflineVideo } from '@/hooks/useOfflineVideo'
import { useNetworkStatus } from '@/lib/network/networkService'

interface OfflineVideoProps {
  src: string | null | undefined
  thumbnailSrc?: string
  exerciseId?: string
  priority?: 'high' | 'medium' | 'low'
  showOfflineIndicator?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
  onError?: (error: Error) => void
  onUnavailable?: () => void
}

/**
 * Video component with offline support
 * Automatically handles caching and fallbacks for offline usage
 */
export function OfflineVideo({
  src,
  thumbnailSrc,
  exerciseId,
  priority = 'medium',
  showOfflineIndicator = false,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  className = '',
  onError,
  onUnavailable
}: OfflineVideoProps) {
  const { isOnline } = useNetworkStatus()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loadError, setLoadError] = useState(false)
  
  const { 
    videoUrl, 
    loading, 
    error, 
    isAvailableOffline 
  } = useOfflineVideo(src, {
    exerciseId,
    priority,
    onUnavailable
  })
  
  // Reset load error when src changes
  useEffect(() => {
    setLoadError(false)
  }, [src])
  
  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])
  
  const handleError = () => {
    setLoadError(true)
    onError?.(new Error('Video playback failed'))
  }
  
  // Placeholder component when video is not available
  const Placeholder = () => (
    <div 
      className={`bg-gray-200 flex flex-col items-center justify-center ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      {thumbnailSrc ? (
        <div className="relative w-full h-full">
          <img 
            src={thumbnailSrc} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Video not available offline</p>
              <p className="text-sm mt-1">Connect to the internet to watch</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 font-medium">Video not available</p>
          {!isOnline && (
            <p className="text-gray-500 text-sm mt-1">Connect to the internet to watch</p>
          )}
        </div>
      )}
    </div>
  )
  
  // If there's no src or an error occurred, show placeholder
  if (!src || error || loadError) {
    return <Placeholder />
  }
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div 
        className={`bg-gray-100 animate-pulse ${className}`}
        style={{ aspectRatio: '16/9' }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        poster={thumbnailSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        className={className}
        onError={handleError}
        playsInline
      />
      
      {/* Offline indicator badge */}
      {showOfflineIndicator && isAvailableOffline && !isOnline && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
          Offline
        </div>
      )}
      
      {/* Download button for online mode */}
      {isOnline && !isAvailableOffline && (
        <button 
          className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-sm flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // This would trigger a download of the video for offline use
            if (src) {
              import('@/lib/storage/mediaCache').then(({ cacheMedia }) => {
                cacheMedia(src, 'video', { exerciseId, priority: 'high' })
                  .then(() => {
                    // Show a success indicator
                    const button = e.target as HTMLButtonElement
                    button.textContent = 'Downloaded'
                    button.disabled = true
                    setTimeout(() => {
                      button.textContent = 'Download'
                      button.disabled = false
                    }, 2000)
                  })
                  .catch(console.error)
              })
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save Offline
        </button>
      )}
    </div>
  )
}
