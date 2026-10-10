import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { useAuthStore } from '../authStore'
import * as authApi from '../../api/authApi'

jest.mock('../../api/authApi', () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  resetPassword: jest.fn(),
  resendVerification: jest.fn(),
  updatePassword: jest.fn(),
  deleteAccount: jest.fn(),
  checkUsernameAvailable: jest.fn(),
  exchangeCodeForSession: jest.fn(),
  verifyOtpTokenHash: jest.fn(),
  onAuthStateChange: jest.fn(),
}))

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>

const signupData = { email: 'a@b.com', password: 'password123' }

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useAuthStore.setState({
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: false,
      error: null,
    })
  })

  describe('signUp', () => {
    it('returns needsEmailConfirmation: true when no session is returned', async () => {
      mockedAuthApi.signUp.mockResolvedValue({
        user: { id: 'u1' } as any,
        session: null,
        error: null,
      })
      mockedAuthApi.getProfile.mockResolvedValue({ profile: null, error: null })

      const result = await useAuthStore.getState().signUp(signupData)

      expect(result).toEqual({
        success: true,
        error: null,
        needsEmailConfirmation: true,
      })
      // No session means not signed in
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().session).toBeNull()
    })

    it('returns needsEmailConfirmation: false when a session is returned', async () => {
      mockedAuthApi.signUp.mockResolvedValue({
        user: { id: 'u1' } as any,
        session: { access_token: 'tok' } as any,
        error: null,
      })
      mockedAuthApi.getProfile.mockResolvedValue({ profile: null, error: null })

      const result = await useAuthStore.getState().signUp(signupData)

      expect(result).toEqual({
        success: true,
        error: null,
        needsEmailConfirmation: false,
      })
    })

    it('returns the error and needsEmailConfirmation: false on failure', async () => {
      mockedAuthApi.signUp.mockResolvedValue({
        user: null,
        session: null,
        error: 'boom',
      })

      const result = await useAuthStore.getState().signUp(signupData)

      expect(result).toEqual({
        success: false,
        error: 'boom',
        needsEmailConfirmation: false,
      })
    })
  })

  describe('initialize', () => {
    it('only runs once', async () => {
      mockedAuthApi.getSession.mockResolvedValue({
        user: null,
        session: null,
        error: null,
      })

      await useAuthStore.getState().initialize()
      await useAuthStore.getState().initialize()

      expect(mockedAuthApi.getSession).toHaveBeenCalledTimes(1)
      expect(useAuthStore.getState().initialized).toBe(true)
    })
  })
})
