import { useEffect, useState } from 'react'
import { useNetworkStatus } from '@/lib/network/networkService'
import { syncRoutines } from '@/lib/storage/routineStorage'

interface NetworkStatusProps {
  className?: string
  showSyncButton?: boolean
  compact?: boolean
}

export function NetworkStatus({ 
  className = '', 
  showSyncButton = true,
  compact = false
}: NetworkStatusProps) {
  const { isOnline, isSyncing, lastSyncTime, pendingChanges } = useNetworkStatus()
  const [syncTriggered, setSyncTriggered] = useState(false)
  
  // Format the last sync time
  const formattedSyncTime = lastSyncTime 
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never'
  
  // Trigger manual sync
  const handleSync = async () => {
    setSyncTriggered(true)
    try {
      await syncRoutines()
    } catch (error) {
      console.error('Manual sync failed:', error)
    } finally {
      setTimeout(() => setSyncTriggered(false), 2000)
    }
  }
  
  // Reset sync triggered state after 2 seconds
  useEffect(() => {
    if (syncTriggered) {
      const timer = setTimeout(() => setSyncTriggered(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [syncTriggered])
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div 
          className={`h-3 w-3 rounded-full ${
            !isOnline ? 'bg-red-500' : 
            isSyncing ? 'bg-amber-500 animate-pulse' : 
            'bg-green-500'
          }`}
          title={!isOnline ? 'Offline' : isSyncing ? 'Syncing...' : 'Online'}
        />
        {pendingChanges > 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
            {pendingChanges}
          </span>
        )}
      </div>
    )
  }
  
  return (
    <div className={`rounded-lg border p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className={`h-3 w-3 rounded-full ${
              !isOnline ? 'bg-red-500' : 
              isSyncing ? 'bg-amber-500 animate-pulse' : 
              'bg-green-500'
            }`}
          />
          <span className="font-medium">
            {!isOnline ? 'Offline' : isSyncing ? 'Syncing...' : 'Online'}
          </span>
        </div>
        
        {showSyncButton && isOnline && !isSyncing && (
          <button
            className={`text-sm px-2 py-1 rounded ${
              syncTriggered 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onClick={handleSync}
            disabled={isSyncing || !isOnline || syncTriggered}
          >
            {syncTriggered ? 'Synced!' : 'Sync Now'}
          </button>
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-500 flex justify-between">
        <span>Last synced: {formattedSyncTime}</span>
        
        {pendingChanges > 0 && (
          <span className="text-blue-600">
            {pendingChanges} pending {pendingChanges === 1 ? 'change' : 'changes'}
          </span>
        )}
      </div>
    </div>
  )
}
