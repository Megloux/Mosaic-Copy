import React from 'react'
import { DatePicker, DatePickerWithStore } from '@/components/ui'
import { addDays, format, startOfDay } from 'date-fns'
import { Button } from '@/components/ui/Button'

export const DatePickerDemo = () => {
  // State for standalone DatePicker
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    startOfDay(new Date())
  )
  
  // State for range selection
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    startOfDay(new Date())
  )
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    addDays(startOfDay(new Date()), 7)
  )
  
  // State for recurring pattern
  const [recurringPattern, setRecurringPattern] = React.useState<'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly'>('none')
  
  // Sample events for the calendar
  const events = React.useMemo(() => {
    const today = startOfDay(new Date())
    return [
      { date: today, type: 'primary' },
      { date: addDays(today, 2), type: 'success' },
      { date: addDays(today, 3), type: 'warning' },
      { date: addDays(today, 5), type: 'error' },
      { date: addDays(today, 7), type: 'secondary' },
      { date: addDays(today, 7), type: 'primary' },
      { date: addDays(today, 7), type: 'success' },
      { date: addDays(today, 10), type: 'primary' },
    ] as const
  }, [])
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submitted with:', {
      selectedDate,
      dateRange: { startDate, endDate },
      recurringPattern
    })
    
    // Simulate form submission success
    alert('Schedule saved successfully!')
  }
  
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Studio Schedule DatePicker</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic DatePicker */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">Single Date Selection</h2>
          <p className="text-sm text-foreground/70">
            Select a date for a one-time class or event
          </p>
          
          <DatePicker
            label="Class Date"
            value={selectedDate}
            onChange={setSelectedDate}
            helperText="Select the date for this class"
            enableHaptics
            events={events}
          />
          
          {selectedDate && (
            <div className="mt-2 text-sm">
              Selected: <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
          )}
        </div>
        
        {/* Range DatePicker */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">Date Range Selection</h2>
          <p className="text-sm text-foreground/70">
            Select a start and end date for multi-day events
          </p>
          
          <DatePicker
            label="Event Duration"
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start)
              setEndDate(end)
            }}
            helperText="Select the start and end dates for this event"
            enableRangeSelection
            enableHaptics
            events={events}
          />
          
          {startDate && endDate && (
            <div className="mt-2 text-sm">
              Range: <span className="font-medium">{format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        
        {/* Recurring DatePicker */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">Recurring Schedule</h2>
          <p className="text-sm text-foreground/70">
            Set up a recurring class schedule
          </p>
          
          <DatePicker
            label="Start Date"
            value={selectedDate}
            onChange={setSelectedDate}
            helperText="Select the start date for this recurring class"
            enableRecurring
            recurringPattern={recurringPattern}
            onRecurringPatternChange={setRecurringPattern}
            enableHaptics
            events={events}
          />
          
          {selectedDate && recurringPattern !== 'none' && (
            <div className="mt-2 text-sm">
              This class will repeat <span className="font-medium">{recurringPattern}</span> starting on <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
            </div>
          )}
        </div>
        
        {/* Week View DatePicker */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">Week View</h2>
          <p className="text-sm text-foreground/70">
            Plan your weekly schedule
          </p>
          
          <DatePicker
            label="Week Schedule"
            value={selectedDate}
            onChange={setSelectedDate}
            helperText="Select a date to schedule a class"
            view="week"
            enableHaptics
            events={events}
          />
        </div>
        
        {/* DatePickerWithStore */}
        <div className="space-y-4 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">Form Store Integration</h2>
          <p className="text-sm text-foreground/70">
            DatePicker integrated with Zustand form store
          </p>
          
          <DatePickerWithStore
            formId="studioSchedule"
            name="classDate"
            label="Class Date"
            helperText="This field is connected to the Zustand form store"
            enableHaptics
          />
          
          <DatePickerWithStore
            formId="studioSchedule"
            name="eventRange"
            label="Event Range"
            helperText="Date range with form store integration"
            enableRangeSelection
            startDateField="startDate"
            endDateField="endDate"
            enableHaptics
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Save Schedule</Button>
        </div>
      </form>
    </div>
  )
}
