import React from 'react'

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

/**
 * MobileLayout Component - STUB
 * 
 * Mobile-optimized layout wrapper
 * TODO: Add full mobile layout features (safe areas, gestures, etc.)
 */
export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {(title || showBackButton) && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-3 p-2 -ml-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default MobileLayout
