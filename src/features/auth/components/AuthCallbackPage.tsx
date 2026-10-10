/**
 * AuthCallbackPage Component
 *
 * Landing page for Supabase email links (signup confirmation, password
 * recovery, magic links). Handles both PKCE `?code=` links and hash-based
 * tokens, then routes the user to the right place.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import * as authApi from '../api/authApi'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'

type CallbackStatus = 'working' | 'error'

const CALLBACK_TIMEOUT_MS = 10_000

function isSafeRedirect(path: string | null): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//')
}

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<CallbackStatus>('working')
  const [errorMessage, setErrorMessage] = useState('This link is invalid or has expired.')
  const handled = useRef(false)

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const code = searchParams.get('code')
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const next = searchParams.get('next')
    const urlError =
      searchParams.get('error_description') ||
      searchParams.get('error') ||
      hashParams.get('error_description') ||
      hashParams.get('error')

    const goNext = () => {
      handled.current = true
      navigate(isSafeRedirect(next) ? next : '/', { replace: true })
    }

    const fail = (message?: string) => {
      handled.current = true
      if (message) setErrorMessage(message)
      setStatus('error')
    }

    // The link itself reports an error (e.g. expired link)
    if (urlError) {
      fail(decodeURIComponent(urlError.replace(/\+/g, ' ')))
      return
    }

    const timeout = setTimeout(() => {
      if (!handled.current) fail()
    }, CALLBACK_TIMEOUT_MS)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (handled.current) return
      if (event === 'PASSWORD_RECOVERY') {
        handled.current = true
        navigate('/reset-password', { replace: true })
      } else if (event === 'SIGNED_IN') {
        // goNext already honors ?next=, so a SIGNED_IN fired alongside
        // PASSWORD_RECOVERY can't strand the user on '/'
        goNext()
      }
    })

    const exchange = async () => {
      // token_hash links work cross-device (PKCE codes only work in the
      // browser that started the flow), so check them first
      if (tokenHash && type) {
        const result = await authApi.verifyOtpTokenHash(
          tokenHash,
          type as 'signup' | 'recovery' | 'email_change' | 'magiclink' | 'email'
        )

        if (handled.current) return

        if (result.error) {
          fail(result.error)
          return
        }

        if (type === 'recovery') {
          handled.current = true
          navigate('/reset-password', { replace: true })
          return
        }

        goNext()
        return
      }

      if (!code) {
        // No code: either a hash-token link (handled by detectSessionInUrl at
        // client init, so its auth event may have fired before we subscribed)
        // or a plain visit. Check the hash and any existing session.
        if (hashParams.get('type') === 'recovery' || next === '/reset-password') {
          handled.current = true
          navigate('/reset-password', { replace: true })
          return
        }

        const { data } = await supabase.auth.getSession()
        if (handled.current) return
        if (data.session) {
          goNext()
        }
        // Otherwise keep waiting for an auth event until the timeout
        return
      }

      const result = await authApi.exchangeCodeForSession(code)

      if (handled.current) return

      if (result.error) {
        fail(result.error)
        return
      }

      // If next points at recovery, honor it even when PASSWORD_RECOVERY
      // fired before/without a session event ordering we can rely on
      goNext()
    }

    exchange()

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [searchParams, navigate])

  if (status === 'error') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgb(var(--core-black))' }}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8 text-red-600"
              >
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link expired</h1>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <div className="space-y-3">
              <Link to="/forgot-password">
                <StandardButton variant="default" className="w-full">
                  Request New Link
                </StandardButton>
              </Link>
              <Link to="/login">
                <StandardButton variant="secondary" className="w-full">
                  Back to Sign In
                </StandardButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgb(var(--core-black))' }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing you in</h1>
          <p className="text-gray-600">Please wait while we confirm your link...</p>
        </div>
      </div>
    </div>
  )
}

AuthCallbackPage.displayName = 'AuthCallbackPage'
