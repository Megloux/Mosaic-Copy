import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from '@/App'
import * as serviceWorkerRegistration from './service-worker-registration'
import { NetworkToast } from '@/components/ui/NetworkToast'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

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
