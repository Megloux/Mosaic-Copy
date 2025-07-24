# Mosaic Offline Functionality - Technical Handoff

## Overview

This document provides a comprehensive overview of the offline functionality implemented in the Mosaic application. The implementation follows a progressive web app (PWA) approach, ensuring that users can continue to use the application even when they lose internet connectivity.

## Implementation Components

### 1. Network Status Management

**File**: `src/hooks/useNetworkStatus.ts`

This custom React hook provides real-time network status information to components throughout the application.

```typescript
// Key implementation details
export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastChanged: null
  })

  // Update network status when it changes
  useEffect(() => {
    const updateNetworkStatus = () => {
      setStatus({
        isOnline: navigator.onLine,
        lastChanged: new Date()
      })
    }
    
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  return status
}
```

**Technical Notes**:
- Uses the browser's native `navigator.onLine` property and `online`/`offline` events
- Provides a reactive state that updates when network status changes
- Includes a timestamp for the last status change
- Properly cleans up event listeners to prevent memory leaks

### 2. Visual Indicators

#### Network Status Indicator

**File**: `src/components/ui/NetworkStatusIndicator.tsx`

A small visual indicator that appears in the bottom-left corner of the screen, showing the current network status.

```typescript
// Key implementation details
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
```

**Technical Notes**:
- Uses Lucide React icons for visual clarity
- Implements subtle UX: visible when offline, hidden but hoverable when online
- Includes appropriate ARIA attributes and tooltips for accessibility
- Styled with Tailwind CSS for consistent design language

#### Network Toast Notifications

**File**: `src/components/ui/NetworkToast.tsx`

Toast notifications that appear when the network status changes, providing clear feedback to users.

```typescript
// Key implementation details
export function NetworkToast() {
  const { isOnline } = useNetworkStatus()
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])
  const [prevOnlineStatus, setPrevOnlineStatus] = useState(isOnline)
  
  // Show toast when network status changes
  useEffect(() => {
    if (prevOnlineStatus === isOnline) return
    
    if (isOnline) {
      showToast({
        message: "You're back online.",
        type: 'success',
        duration: 5000
      })
    } else {
      showToast({
        message: "You're offline. Changes will be saved locally.",
        type: 'warning',
        duration: 5000
      })
    }
    
    setPrevOnlineStatus(isOnline)
  }, [isOnline])
  
  // Toast management logic...
}
```

**Technical Notes**:
- Tracks previous network status to detect changes
- Shows different messages for going offline vs. coming back online
- Automatically dismisses toasts after a set duration
- Styled to match the application's design system

### 3. Service Worker Enhancement

**File**: `src/service-worker.ts`

The service worker implements caching strategies for different types of resources, ensuring the application works offline.

```typescript
// Key implementation details
// Version for cache management
const CACHE_VERSION = '1.0.0'
const APP_CACHE_NAME = `mosaic-app-${CACHE_VERSION}`
const IMAGE_CACHE_NAME = `mosaic-images-${CACHE_VERSION}`
const API_CACHE_NAME = `mosaic-api-${CACHE_VERSION}`

// Cache thumbnail images with a Cache First strategy
registerRoute(
  ({ request, url }) => {
    return request.destination === 'image' && 
           (url.pathname.includes('/thumbnails/') || url.pathname.includes('/exercises/'));
  },
  new CacheFirst({
    cacheName: IMAGE_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100, // Limit number of cached images
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true, // Automatically cleanup if storage quota is exceeded
      }),
    ],
  })
)

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  const currentCaches = [APP_CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

**Technical Notes**:
- Uses Workbox library for robust service worker implementation
- Implements different caching strategies based on resource type:
  - CacheFirst for images and static assets
  - StaleWhileRevalidate for CSS/JS
  - NetworkFirst for API responses
- Includes proper cache versioning for updates
- Handles cache cleanup to prevent storage bloat
- Sets appropriate expiration times for different resource types

### 4. Offline-Aware Save Button

**File**: `src/components/ui/buttons/SaveButton.tsx`

Enhanced save button that provides appropriate feedback when saving while offline.

```typescript
// Key implementation details
export function SaveButton({
  onSave,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  children = 'Save',
  ariaLabel,
  className = '',
}: SaveButtonProps) {
  const { isOnline } = useNetworkStatus();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'offline-saved'>('idle');
  
  // Handle save with offline awareness
  const handleSave = async () => {
    if (isLoading || disabled) return;
    
    setSaveState('saving');
    
    try {
      await onSave();
      setSaveState(isOnline ? 'saved' : 'offline-saved');
    } catch (error) {
      console.error('Save failed:', error);
      setSaveState('idle');
    }
  };
  
  // Determine button content based on state
  const getButtonContent = () => {
    if (isLoading || saveState === 'saving') return '...';
    if (saveState === 'saved') return <><Check size={16} /> Saved</>;
    if (saveState === 'offline-saved') return <><WifiOff size={16} /> Saved Offline</>;
    return children;
  };
  
  // Button rendering...
}
```

**Technical Notes**:
- Integrates with the network status hook
- Provides different visual feedback for online vs. offline saves
- Handles save state transitions with appropriate UI updates
- Includes error handling for failed saves
- Maintains accessibility with appropriate ARIA attributes

## Integration in App

**File**: `src/App.tsx` and `src/index.tsx`

The offline components are integrated at the application root level to ensure they're available throughout the app.

```typescript
// App.tsx
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Routes... */}
        </Routes>
        
        {/* Offline functionality components */}
        <NetworkStatusIndicator />
        <NetworkToast />
      </Router>
    </QueryClientProvider>
  );
}

// index.tsx
root.render(
  <React.StrictMode>
    <App />
    <NetworkToast />
  </React.StrictMode>
)

// Register the service worker for offline capabilities
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // When a new version is available, show a notification
    const updateAvailable = window.confirm(
      'A new version of the app is available. Would you like to update now?'
    )
    
    if (updateAvailable && registration.waiting) {
      // Send a message to the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Reload the page to activate the new service worker
      window.location.reload()
    }
  },
  onSuccess: (registration) => {
    console.log('Service worker registered successfully')
    
    // Notify the user that the app is available offline
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Mosaic App', {
          body: 'The app is now available offline!',
          icon: '/logo192.png'
        })
      })
    }
  }
})
```

## Testing Guidelines

To verify the offline functionality:

1. **Network Status Detection**:
   - Use browser DevTools to toggle offline mode
   - Verify the NetworkStatusIndicator appears when offline
   - Check that toast notifications appear when network status changes

2. **Offline Content Access**:
   - Load the application while online
   - Navigate to different pages to cache content
   - Switch to offline mode and verify content is still accessible

3. **Image Caching**:
   - Load exercise thumbnails while online
   - Go offline and verify thumbnails are still visible
   - Check that new images aren't loaded when offline

4. **Offline Saving**:
   - Create or modify a routine while offline
   - Verify the SaveButton shows "Saved Offline" status
   - Reconnect to verify data persists

## Future Enhancements

1. **Background Synchronization**:
   - Implement a sync queue for changes made offline
   - Add background sync registration for automatic syncing when back online

2. **Prefetching Strategy**:
   - Implement smart prefetching for content likely to be needed offline
   - Add user controls for managing offline content

3. **Conflict Resolution**:
   - Enhance synchronization to handle conflicts when the same data is modified online and offline

4. **Storage Management**:
   - Add UI for viewing and managing cached content
   - Implement storage quotas and cleanup strategies

## References

- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [MDN Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [React Offline Detection Patterns](https://reactjs.org/community/examples.html)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
