import React from 'react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/cards/Card'
import { useForm } from '@/store/formStore'
import { TimeInputWithStore } from '@/components/ui/form/TimeInputWithStore'
import { InputWithStore } from '@/components/ui/form/InputWithStore'
import { SelectWithStore } from '@/components/ui/form/SelectWithStore'
import { RangeSliderWithStore } from '@/components/ui/form/RangeSliderWithStore'

/**
 * Demo component to showcase Zustand form store integration
 * Demonstrates form field connections, validation, and submission
 */
export const FormStoreDemo = () => {
  const formId = 'demoForm'
  const form = useForm(formId)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    form.setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const values = form.getValues()
      console.log('Form values:', values)
      form.setSubmitting(false)
      form.incrementSubmitCount()
      
      // Show success message
      alert('Form submitted successfully!')
    }, 1000)
  }
  
  const handleReset = () => {
    form.resetForm()
  }
  
  return (
    <Section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Form Store Integration Demo</h1>
        <p className="text-muted-foreground">
          This demo showcases how form components integrate with the Zustand store.
        </p>
      </div>
      
      <Card title="Exercise Form">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputWithStore
            formId={formId}
            name="exerciseName"
            label="Exercise Name"
            placeholder="Enter exercise name"
            helperText="Name of the exercise (e.g., Push-ups)"
          />
          
          <SelectWithStore
            formId={formId}
            name="category"
            label="Category"
            helperText="Select the exercise category"
          >
            <option value="">Select a category</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="balance">Balance</option>
          </SelectWithStore>
          
          <TimeInputWithStore
            formId={formId}
            name="duration"
            label="Duration"
            maxTimeSeconds={3600}
            helperText="Set the exercise duration (MM:SS)"
          />
          
          <RangeSliderWithStore
            formId={formId}
            name="intensity"
            label="Intensity"
            min={1}
            max={10}
            step={1}
            helperText="Rate the exercise intensity (1-10)"
          />
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={handleReset}
              disabled={form.isSubmitting}
            >
              Reset Form
            </button>
          </div>
          
          {form.submitCount > 0 && (
            <p className="text-sm text-success">
              Form has been submitted {form.submitCount} time(s).
            </p>
          )}
        </form>
      </Card>
      
      <Card title="Form State">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Current Form Values</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
              {JSON.stringify(form.getValues(), null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Form Status</h3>
            <ul className="list-disc list-inside">
              <li>
                Is Submitting: <span className="font-mono">{form.isSubmitting.toString()}</span>
              </li>
              <li>
                Is Valid: <span className="font-mono">{form.isValid().toString()}</span>
              </li>
              <li>
                Is Dirty: <span className="font-mono">{form.isDirty().toString()}</span>
              </li>
              <li>
                Submit Count: <span className="font-mono">{form.submitCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </Section>
  )
}
