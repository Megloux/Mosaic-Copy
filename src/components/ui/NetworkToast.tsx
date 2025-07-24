import { useEffect, useState } from 'react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

interface ToastProps {
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

export function NetworkToast() {
  const { isOnline } = useNetworkStatus()
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])
  const [prevOnlineStatus, setPrevOnlineStatus] = useState(isOnline)
  
  // Show toast when network status changes
  useEffect(() => {
    // Skip initial render
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
  
  // Show a toast notification
  const showToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
    
    // Auto-remove toast after duration
    if (toast.duration) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
  }
  
  // Remove a toast by id
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 pr-10 max-w-xs animate-fade-in relative ${
            toast.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
            toast.type === 'warning' ? 'bg-amber-100 text-amber-800 border-l-4 border-amber-500' :
            toast.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
            'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
          }`}
        >
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  )
}

// CSS animation for toasts
const style = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
`

// Add the style to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = style
  document.head.appendChild(styleElement)
}
