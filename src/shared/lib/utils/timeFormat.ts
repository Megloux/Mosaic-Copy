/**
 * Time utilities for Mosaic's form components
 * Handles various time formats and conversions
 */

/**
 * Convert MM:SS string to total seconds
 */
export const timeToSeconds = (timeStr: string): number => {
  if (!timeStr || timeStr === ':') return 0
  const [minutes, seconds] = timeStr.split(':').map(part => parseInt(part, 10) || 0)
  return (minutes * 60) + seconds
}

/**
 * Convert seconds to MM:SS string
 */
export const secondsToTime = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Format user input into MM:SS format
 */
export const formatTimeInput = (value: string): string => {
  // Handle empty input
  if (!value || value === ':') return '00:00'

  // Remove non-digits but keep colons
  const cleanValue = value.replace(/[^\d:]/g, '')
  
  // Split by colon
  const parts = cleanValue.split(':')
  
  if (parts.length === 1) {
    const digits = parts[0]
    
    // Handle empty part
    if (digits.length === 0) return '00:00'
    
    // Handle single or double digit (seconds)
    if (digits.length <= 2) {
      const seconds = parseInt(digits, 10)
      return `00:${seconds.toString().padStart(2, '0')}`
    }
    
    // Handle MMSS format
    const secondsDigits = digits.slice(-2)
    const minutesDigits = digits.slice(0, -2)
    
    const minutes = parseInt(minutesDigits, 10)
    const seconds = parseInt(secondsDigits, 10)
    
    // Handle invalid seconds
    if (seconds >= 60) {
      const totalSeconds = (minutes * 60) + seconds
      return secondsToTime(totalSeconds)
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  // Handle MM:SS format
  if (parts.length >= 2) {
    let minutes = parseInt(parts[0], 10) || 0
    let seconds = parseInt(parts[1], 10) || 0
    
    // Handle invalid seconds
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60)
      seconds = seconds % 60
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  return '00:00'
}

/**
 * Parse time input in various formats
 */
export const parseTimeInput = (input: string): number => {
  const cleanInput = input.trim().toLowerCase()
  
  // Handle empty input
  if (!cleanInput) return 0
  
  // Handle hour/minute/second indicators
  if (/[hms]/.test(cleanInput)) {
    let totalSeconds = 0
    
    const hourMatch = cleanInput.match(/(\d+)h/)
    if (hourMatch) totalSeconds += parseInt(hourMatch[1], 10) * 3600
    
    const minMatch = cleanInput.match(/(\d+)m/)
    if (minMatch) totalSeconds += parseInt(minMatch[1], 10) * 60
    
    const secMatch = cleanInput.match(/(\d+)s/)
    if (secMatch) totalSeconds += parseInt(secMatch[1], 10)
    
    return totalSeconds
  }
  
  // Handle MM:SS format
  if (cleanInput.includes(':')) {
    return timeToSeconds(cleanInput)
  }
  
  // Handle numeric input
  const numericValue = parseInt(cleanInput, 10)
  if (!isNaN(numericValue)) {
    if (numericValue < 60) return numericValue // Seconds
    if (numericValue < 100) return numericValue * 60 // Minutes
    
    // Handle MMSS format
    const seconds = numericValue % 100
    const minutes = Math.floor(numericValue / 100)
    return (minutes * 60) + (seconds >= 60 ? seconds : seconds)
  }
  
  return 0
}

/**
 * Format duration in human-readable format
 */
export const formatDuration = (seconds: number, compact = false): string => {
  if (seconds < 0) seconds = 0
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  const parts: string[] = []
  
  if (hours > 0) {
    parts.push(`${hours}${compact ? 'h' : ' hour'}${hours !== 1 && !compact ? 's' : ''}`)
  }
  
  if (minutes > 0 || (hours > 0 && remainingSeconds > 0)) {
    parts.push(`${minutes}${compact ? 'm' : ' minute'}${minutes !== 1 && !compact ? 's' : ''}`)
  }
  
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}${compact ? 's' : ' second'}${remainingSeconds !== 1 && !compact ? 's' : ''}`)
  }
  
  return parts.join(compact ? ' ' : ' and ')
}

/**
 * Calculate total duration from array of MM:SS strings
 */
export const calculateTotalDuration = (durations: string[]): number => {
  return durations.reduce((total, duration) => total + timeToSeconds(duration), 0)
}
