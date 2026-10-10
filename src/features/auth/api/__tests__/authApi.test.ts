import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { signUp, resetPassword, checkUsernameAvailable, verifyOtpTokenHash } from '../authApi'

const mockSignUp = jest.fn<(...args: any[]) => Promise<any>>()
const mockResetPasswordForEmail = jest.fn<(...args: any[]) => Promise<any>>()
const mockVerifyOtp = jest.fn<(...args: any[]) => Promise<any>>()
const mockRpc = jest.fn<(...args: any[]) => Promise<any>>()
const mockFrom = jest.fn<(...args: any[]) => Promise<any>>()

jest.mock('@/shared/api/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: (args: unknown) => mockSignUp(args),
      resetPasswordForEmail: (email: string, options: unknown) =>
        mockResetPasswordForEmail(email, options),
      verifyOtp: (args: unknown) => mockVerifyOtp(args),
    },
    rpc: (fn: string, args: unknown) => mockRpc(fn, args),
    from: (table: string) => mockFrom(table),
  },
}))

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('passes an emailRedirectTo ending in /auth/callback', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'u1' }, session: null },
        error: null,
      })

      await signUp({ email: 'a@b.com', password: 'password123' })

      expect(mockSignUp).toHaveBeenCalledTimes(1)
      const call = mockSignUp.mock.calls[0][0] as any
      expect(call.options.emailRedirectTo).toMatch(/\/auth\/callback$/)
    })

    it('never calls .from("profiles") during signup', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'u1' }, session: null },
        error: null,
      })

      await signUp({ email: 'a@b.com', password: 'password123', firstName: 'A' })

      expect(mockFrom).not.toHaveBeenCalled()
    })

    it('maps "already registered" to a friendly message', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      })

      const result = await signUp({ email: 'a@b.com', password: 'password123' })

      expect(result.error).toBe(
        'An account with this email already exists. Try signing in instead.'
      )
      expect(result.user).toBeNull()
    })

    it('lowercases and trims username metadata', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'u1' }, session: null },
        error: null,
      })

      await signUp({ email: 'a@b.com', password: 'password123', username: '  Jane_Doe  ' })

      const call = mockSignUp.mock.calls[0][0] as any
      expect(call.options.data.username).toBe('jane_doe')
    })
  })

  describe('checkUsernameAvailable', () => {
    it('calls the is_username_available rpc with the candidate', async () => {
      mockRpc.mockResolvedValue({ data: true, error: null })

      const result = await checkUsernameAvailable('pilates_pro')

      expect(mockRpc).toHaveBeenCalledWith('is_username_available', { candidate: 'pilates_pro' })
      expect(result).toEqual({ available: true, error: null })
    })

    it('returns available: false when the rpc returns false', async () => {
      mockRpc.mockResolvedValue({ data: false, error: null })

      const result = await checkUsernameAvailable('taken')

      expect(result).toEqual({ available: false, error: null })
    })

    it('surfaces rpc errors', async () => {
      mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc failed' } })

      const result = await checkUsernameAvailable('x')

      expect(result).toEqual({ available: false, error: 'rpc failed' })
    })
  })

  describe('verifyOtpTokenHash', () => {
    it('maps a successful verification to user/session', async () => {
      mockVerifyOtp.mockResolvedValue({
        data: { user: { id: 'u1' }, session: { access_token: 'tok' } },
        error: null,
      })

      const result = await verifyOtpTokenHash('hash123', 'signup')

      expect(mockVerifyOtp).toHaveBeenCalledWith({ token_hash: 'hash123', type: 'signup' })
      expect(result).toEqual({
        user: { id: 'u1' },
        session: { access_token: 'tok' },
        error: null,
      })
    })

    it('maps an error to its message', async () => {
      mockVerifyOtp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Token has expired or is invalid' },
      })

      const result = await verifyOtpTokenHash('bad', 'recovery')

      expect(result).toEqual({
        user: null,
        session: null,
        error: 'Token has expired or is invalid',
      })
    })
  })

  describe('resetPassword', () => {
    it('redirects through /auth/callback?next=/reset-password', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ error: null })

      const result = await resetPassword('a@b.com')

      expect(result.error).toBeNull()
      const options = mockResetPasswordForEmail.mock.calls[0][1] as any
      expect(options.redirectTo).toContain('/auth/callback?next=/reset-password')
    })
  })
})
