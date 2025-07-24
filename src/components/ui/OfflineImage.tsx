import { useState, useEffect } from 'react'
import { useOfflineImage } from '@/hooks/useOfflineImage'
import { useNetworkStatus } from '@/lib/network/networkService'

interface OfflineImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined
  fallbackSrc?: string
  exerciseId?: string
  priority?: 'high' | 'medium' | 'low'
  showOfflineIndicator?: boolean
}

/**
 * Image component with offline support
 * Automatically handles caching and fallbacks for offline usage
 */
export function OfflineImage({
  src,
  fallbackSrc,
  exerciseId,
  priority = 'medium',
  showOfflineIndicator = false,
  alt = '',
  className = '',
  ...props
}: OfflineImageProps) {
  const { isOnline } = useNetworkStatus()
  const { imageUrl, loading, error } = useOfflineImage(src, {
    exerciseId,
    priority,
    placeholderUrl: fallbackSrc
  })
  
  const [loadError, setLoadError] = useState(false)
  
  // Reset load error when src changes
  useEffect(() => {
    setLoadError(false)
  }, [src])
  
  const handleError = () => {
    setLoadError(true)
  }
  
  // Placeholder component when image is not available
  const Placeholder = () => (
    <div 
      className={`bg-gray-200 flex items-center justify-center ${className}`}
      style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : '1/1' }}
      {...props}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-1/3 w-1/3 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>
  )
  
  // If there's no src or an error occurred, show placeholder
  if (!src || error || loadError) {
    return <Placeholder />
  }
  
  // If still loading, show placeholder
  if (loading) {
    return (
      <div 
        className={`bg-gray-100 animate-pulse ${className}`}
        style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : '1/1' }}
        {...props}
      />
    )
  }
  
  return (
    <div className="relative">
      <img
        src={imageUrl || fallbackSrc}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
      
      {/* Offline indicator badge */}
      {showOfflineIndicator && !isOnline && (
        <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
          Offline
        </div>
      )}
    </div>
  )
}
