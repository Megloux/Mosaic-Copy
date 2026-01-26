import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthHeader } from '@/features/auth'

/**
 * Navigation Component - Spotify-quality mobile-first navigation
 * 
 * Features:
 * - Mobile: Bottom tab bar (like Spotify)
 * - Desktop: Top horizontal nav
 * - Smooth transitions
 * - iOS-compliant touch targets
 */
export const Navigation: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/exercises', label: 'Exercises', icon: '💪' },
    { path: '/builder', label: 'Builder', icon: '🔧' },
    { path: '/routines', label: 'Routines', icon: '📋' },
  ]

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav 
        className="hidden md:block border-b" 
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
            <div className="flex items-center space-x-8">
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
                          color: 'rgba(255, 255, 255, 0.7)'
                        })
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="ml-4 pl-4 border-l border-white/20">
                <AuthHeader />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - Logo + Menu button */}
      <nav 
        className="md:hidden flex justify-between items-center px-4 h-14 border-b"
        style={{ 
          backgroundColor: 'rgb(var(--core-black))',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <h1 
          style={{
            fontSize: '1.25rem',
            fontWeight: 'var(--font-brand)',
            letterSpacing: '0.15em',
            color: 'rgb(var(--core-teal))',
            fontFamily: 'var(--font-primary)'
          }}
        >
          MOSAIC
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
          style={{ 
            minWidth: '44px', 
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Menu"
        >
          <span style={{ fontSize: '1.5rem', color: 'rgb(var(--core-white))' }}>
            {mobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </nav>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 top-14 z-50"
          style={{ 
            backgroundColor: 'rgb(var(--core-black))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-lg mb-1"
                style={{
                  minHeight: '52px',
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(0, 183, 120, 0.2)' 
                    : 'transparent',
                  color: location.pathname === item.path 
                    ? 'rgb(var(--core-teal))' 
                    : 'rgb(var(--core-white))'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span style={{ 
                  fontSize: '1rem',
                  fontWeight: location.pathname === item.path ? '600' : '400'
                }}>
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="pt-2 pb-4 border-t border-white/10 mt-2">
              <AuthHeader onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop when menu is open */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', top: '56px' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navigation
