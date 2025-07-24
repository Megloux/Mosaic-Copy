import { Wifi, WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { cn } from '@/lib/utils'

interface NetworkStatusIndicatorProps {
  className?: string
}

/**
 * A small visual indicator that shows the current network status
 * Appears prominently when offline, subtle when online
 */
export function NetworkStatusIndicator({ className }: NetworkStatusIndicatorProps) {
  const { isOnline } = useNetworkStatus()
  
  return (
    <div 
      className={cn(
        'fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full p-2 transition-all duration-300',
        isOnline 
          ? 'bg-green-100 text-green-700 opacity-0 hover:opacity-100' 
          : 'bg-red-100 text-red-700 opacity-100 shadow-md',
        className
      )}
      title={isOnline ? 'Online' : 'Offline - Changes will be saved locally'}
    >
      {isOnline ? (
        <Wifi size={18} className="text-green-600" />
      ) : (
        <WifiOff size={18} className="text-red-600" />
      )}
      
      {!isOnline && (
        <span className="text-sm font-medium pr-1">Offline</span>
      )}
    </div>
  )
}
