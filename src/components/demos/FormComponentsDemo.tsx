import React, { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import {
  CheckboxGroup,
  CheckboxGroupWithStore,
  RadioGroup,
  RadioGroupWithStore,
  Switch,
  SwitchWithStore,
  FileUpload,
  FileUploadWithStore,
  DatePicker,
  DatePickerWithStore
} from '@/components/ui/form'
import { DateEvent } from '@/components/ui/form/DatePicker'
import type { FormValue } from '@/store/formStore'

export const FormComponentsDemo = () => {
  // Initialize form in Zustand store
  const registerForm = useFormStore((state) => state.registerForm)
  const setField = useFormStore((state) => state.setField)
  
  React.useEffect(() => {
    registerForm('demoForm')
    
    // Set initial values
    setField('demoForm', 'categories', ['strength'])
    setField('demoForm', 'visibility', 'public')
    setField('demoForm', 'isPublic', true)
    
    // Convert Date to string for form storage
    // This is necessary because FormValue doesn't support Date objects directly
    setField('demoForm', 'eventDate', new Date().toISOString())
    
    // For range selection - use string dates for compatibility
    setField('demoForm', 'eventRange', {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    } as unknown as FormValue) // Type assertion to satisfy TypeScript
  }, [registerForm, setField])
  
  // Local state for standalone components
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['cardio'])
  const [visibility, setVisibility] = useState<string>('private')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  })
  
  // Define options for checkbox and radio groups
  const categoryOptions = [
    { label: 'Strength', value: 'strength' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'Flexibility', value: 'flexibility' },
    { label: 'Balance', value: 'balance' }
  ]
  
  const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Members Only', value: 'members' }
  ]
  
  // Event indicators for DatePicker
  const events: DateEvent[] = [
    { date: new Date(), type: 'primary' },
    { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: 'secondary' },
    { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: 'success' }
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-12 p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mosaic Form Components Demo</h1>
        <p className="text-foreground/70">
          This demo showcases all form components with both standalone usage and Zustand store integration.
        </p>
      </div>
      
      {/* CheckboxGroup Components */}
      <section className="space-y-6 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold">CheckboxGroup Component</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standalone Usage</h3>
            <CheckboxGroup
              name="categories-standalone"
              label="Select Categories"
              options={categoryOptions}
              value={selectedCategories}
              onChange={(values) => setSelectedCategories(values as string[])}
              helperText="Choose one or more categories"
              enableHaptics={true}
            />
            <div className="rounded-md bg-surface p-3 text-sm">
              <p>Selected: {selectedCategories.join(', ')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Zustand Store</h3>
            <CheckboxGroupWithStore
              formId="demoForm"
              name="categories"
              label="Select Categories"
              options={categoryOptions}
              helperText="Choose one or more categories"
              enableHaptics={true}
            />
          </div>
        </div>
      </section>
      
      {/* RadioGroup Components */}
      <section className="space-y-6 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold">RadioGroup Component</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standalone Usage</h3>
            <RadioGroup
              name="visibility-standalone"
              label="Visibility Setting"
              options={visibilityOptions}
              value={visibility}
              onChange={(value) => setVisibility(value as string)}
              helperText="Choose who can see your content"
              enableHaptics={true}
            />
            <div className="rounded-md bg-surface p-3 text-sm">
              <p>Selected: {visibility}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Zustand Store</h3>
            <RadioGroupWithStore
              formId="demoForm"
              name="visibility"
              label="Visibility Setting"
              options={visibilityOptions}
              helperText="Choose who can see your content"
              enableHaptics={true}
            />
          </div>
        </div>
      </section>
      
      {/* Switch Components */}
      <section className="space-y-6 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold">Switch Component</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standalone Usage</h3>
            <Switch
              label="Public Visibility"
              checked={isPublic}
              onChange={setIsPublic}
              helperText="Toggle to make your profile public"
              enableHaptics={true}
            />
            <div className="rounded-md bg-surface p-3 text-sm">
              <p>Status: {isPublic ? 'Public' : 'Private'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Zustand Store</h3>
            <SwitchWithStore
              formId="demoForm"
              name="isPublic"
              label="Public Visibility"
              helperText="Toggle to make your profile public"
              enableHaptics={true}
            />
          </div>
        </div>
      </section>
      
      {/* FileUpload Components */}
      <section className="space-y-6 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold">FileUpload Component</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standalone Usage</h3>
            <FileUpload
              label="Upload Image"
              onFileSelect={setSelectedFiles}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              helperText="Upload a profile or class image"
              enableHaptics={true}
            />
            <div className="rounded-md bg-surface p-3 text-sm">
              <p>Files: {selectedFiles.length > 0 ? selectedFiles.map(f => f.name).join(', ') : 'None'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Zustand Store</h3>
            <FileUploadWithStore
              formId="demoForm"
              name="profileImage"
              label="Upload Image"
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              helperText="Upload a profile or class image"
              enableHaptics={true}
            />
          </div>
        </div>
      </section>
      
      {/* DatePicker Components */}
      <section className="space-y-6 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold">DatePicker Component</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standalone Usage</h3>
            <DatePicker
              label="Event Date"
              value={selectedDate}
              onChange={setSelectedDate}
              events={events}
              helperText="Select a date for your event"
              enableHaptics={true}
            />
            <div className="rounded-md bg-surface p-3 text-sm">
              <p>Selected: {selectedDate.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Zustand Store</h3>
            <DatePickerWithStore
              formId="demoForm"
              name="eventDate"
              label="Event Date"
              events={events}
              helperText="Select a date for your event"
              enableHaptics={true}
            />
          </div>
        </div>
      </section>
      
      {/* DatePicker with Range Selection */}
      <section className="space-y-6 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold">DatePicker with Range Selection</h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standalone Usage</h3>
            <DatePicker
              label="Event Date Range"
              enableRangeSelection
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onRangeChange={(start: Date, end: Date) => setDateRange({ startDate: start, endDate: end })}
              events={events}
              helperText="Select a date range for your event"
              enableHaptics={true}
            />
            <div className="rounded-md bg-surface p-3 text-sm">
              <p>Start: {dateRange.startDate.toLocaleDateString()}</p>
              <p>End: {dateRange.endDate.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Zustand Store</h3>
            <DatePickerWithStore
              formId="demoForm"
              name="eventRange"
              label="Event Date Range"
              enableRangeSelection
              startDateField="startDate"
              endDateField="endDate"
              events={events}
              helperText="Select a date range for your event"
              enableHaptics={true}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
