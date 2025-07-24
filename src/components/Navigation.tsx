import React from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Navigation Component - STUB
 * 
 * This is a temporary stub to unblock the app launch.
 * TODO: Replace with full navigation implementation
 */
export const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/exercises', label: 'Exercises' },
    { path: '/builder', label: 'Builder' },
    { path: '/routines', label: 'Routines' },
  ]

  return (
    <nav 
      className="border-b" 
      style={{ 
        backgroundColor: 'var(--surface-base)',
        borderColor: 'rgba(255, 255, 255, var(--border-opacity-subtle))'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-brand)',
                letterSpacing: 'var(--tracking-default)',
                color: 'rgb(var(--core-teal))',
                fontFamily: 'var(--font-primary)'
              }}
            >
              MOSAIC
            </h1>
          </div>
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-md transition-all duration-200"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-thin)',
                  fontFamily: 'var(--font-primary)',
                  letterSpacing: 'var(--tracking-default)',
                  ...(location.pathname === item.path
                    ? {
                        backgroundColor: 'var(--surface-accent)',
                        color: 'rgb(var(--core-black))'
                      }
                    : {
                        color: 'rgba(255, 255, 255, 0.7)',
                        ':hover': {
                          color: 'rgb(var(--core-white))',
                          backgroundColor: 'var(--state-hover)'
                        }
                      })
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'rgb(var(--core-white))'
                    e.currentTarget.style.backgroundColor = 'var(--state-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
