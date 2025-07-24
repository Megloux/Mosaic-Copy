import { useState, useEffect, useCallback } from 'react'

interface NetworkStatus {
  isOnline: boolean
  lastChanged: Date | null
}

/**
 * Hook to track and provide network status information
 * @returns Object containing online status and last change timestamp
 */
export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChanged: null
  })

  const updateNetworkStatus = useCallback(() => {
    setStatus({
      isOnline: navigator.onLine,
      lastChanged: new Date()
    })
  }, [])

  useEffect(() => {
    // Set initial status
    updateNetworkStatus()

    // Add event listeners
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [updateNetworkStatus])

  return status
}
