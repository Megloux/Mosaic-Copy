import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import React from 'react'

// Types for form values
export type FormValue = string | number | boolean | string[] | null

// Form field interface
export interface FormField {
  value: FormValue
  error?: string
  touched: boolean
  dirty: boolean
  valid: boolean
}

// Form state interface
export interface FormState {
  // Data
  forms: Record<string, Record<string, FormField>>
  
  // Status
  isSubmitting: Record<string, boolean>
  submitCount: Record<string, number>
  
  // Actions
  registerForm: (formId: string) => void
  unregisterForm: (formId: string) => void
  setField: (formId: string, fieldName: string, value: FormValue) => void
  setFieldError: (formId: string, fieldName: string, error?: string) => void
  setFieldTouched: (formId: string, fieldName: string, touched?: boolean) => void
  resetForm: (formId: string) => void
  setSubmitting: (formId: string, isSubmitting: boolean) => void
  incrementSubmitCount: (formId: string) => void
  validateField: (formId: string, fieldName: string, validator: (value: FormValue) => string | undefined) => boolean
  getFormValues: (formId: string) => Record<string, FormValue>
  isFormValid: (formId: string) => boolean
  isDirty: (formId: string) => boolean
}

// Create the form store
export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Initial state
      forms: {},
      isSubmitting: {},
      submitCount: {},
      
      // Actions
      registerForm: (formId) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [formId]: state.forms[formId] || {}
          },
          isSubmitting: {
            ...state.isSubmitting,
            [formId]: false
          },
          submitCount: {
            ...state.submitCount,
            [formId]: 0
          }
        }))
      },
      
      unregisterForm: (formId) => {
        set((state) => {
          const { [formId]: _, ...remainingForms } = state.forms
          const { [formId]: __, ...remainingSubmitting } = state.isSubmitting
          const { [formId]: ___, ...remainingSubmitCount } = state.submitCount
          
          return {
            forms: remainingForms,
            isSubmitting: remainingSubmitting,
            submitCount: remainingSubmitCount
          }
        })
      },
      
      setField: (formId, fieldName, value) => {
        set((state) => {
          // Create form if it doesn't exist
          if (!state.forms[formId]) {
            get().registerForm(formId)
          }
          
          // Get current field or create default
          const currentField = state.forms[formId]?.[fieldName] || {
            value: null,
            touched: false,
            dirty: false,
            valid: true
          }
          
          // Check if value changed to set dirty flag
          const isDirty = currentField.value !== value
          
          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...state.forms[formId],
                [fieldName]: {
                  ...currentField,
                  value,
                  dirty: currentField.dirty || isDirty
                }
              }
            }
          }
        })
      },
      
      setFieldError: (formId, fieldName, error) => {
        set((state) => {
          // Skip if form doesn't exist
          if (!state.forms[formId]) return state
          
          // Get current field or skip
          const currentField = state.forms[formId]?.[fieldName]
          if (!currentField) return state
          
          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...state.forms[formId],
                [fieldName]: {
                  ...currentField,
                  error,
                  valid: !error
                }
              }
            }
          }
        })
      },
      
      setFieldTouched: (formId, fieldName, touched = true) => {
        set((state) => {
          // Skip if form doesn't exist
          if (!state.forms[formId]) return state
          
          // Get current field or skip
          const currentField = state.forms[formId]?.[fieldName]
          if (!currentField) return state
          
          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...state.forms[formId],
                [fieldName]: {
                  ...currentField,
                  touched
                }
              }
            }
          }
        })
      },
      
      resetForm: (formId) => {
        set((state) => {
          // Skip if form doesn't exist
          if (!state.forms[formId]) return state
          
          // Reset all fields to empty state
          const resetFields: Record<string, FormField> = {}
          
          Object.keys(state.forms[formId] || {}).forEach((fieldName) => {
            resetFields[fieldName] = {
              value: null,
              touched: false,
              dirty: false,
              valid: true
            }
          })
          
          return {
            forms: {
              ...state.forms,
              [formId]: resetFields
            },
            isSubmitting: {
              ...state.isSubmitting,
              [formId]: false
            }
          }
        })
      },
      
      setSubmitting: (formId, isSubmitting) => {
        set((state) => ({
          isSubmitting: {
            ...state.isSubmitting,
            [formId]: isSubmitting
          }
        }))
      },
      
      incrementSubmitCount: (formId) => {
        set((state) => ({
          submitCount: {
            ...state.submitCount,
            [formId]: (state.submitCount[formId] || 0) + 1
          }
        }))
      },
      
      validateField: (formId, fieldName, validator) => {
        const field = get().forms[formId]?.[fieldName]
        if (!field) return false
        
        const error = validator(field.value)
        get().setFieldError(formId, fieldName, error)
        
        return !error
      },
      
      getFormValues: (formId) => {
        const form = get().forms[formId] || {}
        const values: Record<string, FormValue> = {}
        
        Object.entries(form).forEach(([fieldName, field]) => {
          values[fieldName] = field.value
        })
        
        return values
      },
      
      isFormValid: (formId) => {
        const form = get().forms[formId] || {}
        
        return Object.values(form).every((field) => field.valid)
      },
      
      isDirty: (formId) => {
        const form = get().forms[formId] || {}
        
        return Object.values(form).some((field) => field.dirty)
      }
    }),
    {
      name: 'mosaic-form-storage',
      partialize: (state) => ({
        // Only persist form values, not errors or status
        forms: Object.entries(state.forms).reduce((acc, [formId, form]) => {
          acc[formId] = Object.entries(form).reduce((formAcc, [fieldName, field]) => {
            formAcc[fieldName] = { value: field.value }
            return formAcc
          }, {} as Record<string, { value: FormValue }>)
          return acc
        }, {} as Record<string, Record<string, { value: FormValue }>>)
      })
    }
  )
)

// Custom hooks for form components
export const useFormField = (formId: string, fieldName: string) => {
  const field = useFormStore((state) => state.forms[formId]?.[fieldName])
  const setField = useFormStore((state) => state.setField)
  const setFieldTouched = useFormStore((state) => state.setFieldTouched)
  const setFieldError = useFormStore((state) => state.setFieldError)
  
  return {
    value: field?.value ?? null,
    error: field?.error,
    touched: field?.touched ?? false,
    dirty: field?.dirty ?? false,
    valid: field?.valid ?? true,
    setValue: (value: FormValue) => setField(formId, fieldName, value),
    setTouched: (touched = true) => setFieldTouched(formId, fieldName, touched),
    setError: (error?: string) => setFieldError(formId, fieldName, error)
  }
}

export const useForm = (formId: string) => {
  const registerForm = useFormStore((state) => state.registerForm)
  const unregisterForm = useFormStore((state) => state.unregisterForm)
  const resetForm = useFormStore((state) => state.resetForm)
  const isSubmitting = useFormStore((state) => state.isSubmitting[formId] ?? false)
  const submitCount = useFormStore((state) => state.submitCount[formId] ?? 0)
  const setSubmitting = useFormStore((state) => state.setSubmitting)
  const incrementSubmitCount = useFormStore((state) => state.incrementSubmitCount)
  const getFormValues = useFormStore((state) => state.getFormValues)
  const isFormValid = useFormStore((state) => state.isFormValid)
  const isDirty = useFormStore((state) => state.isDirty)
  
  // Register form on mount
  React.useEffect(() => {
    registerForm(formId)
    return () => unregisterForm(formId)
  }, [formId, registerForm, unregisterForm])
  
  return {
    isSubmitting,
    submitCount,
    resetForm: () => resetForm(formId),
    setSubmitting: (submitting: boolean) => setSubmitting(formId, submitting),
    incrementSubmitCount: () => incrementSubmitCount(formId),
    getValues: () => getFormValues(formId),
    isValid: () => isFormValid(formId),
    isDirty: () => isDirty(formId)
  }
}
