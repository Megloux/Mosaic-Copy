import React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'

const fileUploadVariants = cva(
  [
    'relative flex w-full cursor-pointer items-center justify-center',
    'min-h-[var(--ios-min-touch-target)]',
    'rounded-lg border-2 border-dashed border-border',
    'bg-surface transition-colors duration-[var(--motion-natural)]',
    'hover:bg-surface-hover',
  ].join(' ')
)

export interface FileUploadProps {
  /** Callback when files are selected */
  onFileSelect?: (files: File[]) => void
  /** Label for the upload area */
  label?: string
  /** Helper text to display below the upload area */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean
  /** Loading state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Accept file types */
  accept?: string
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Allow multiple files */
  multiple?: boolean
  /** Additional class name */
  className?: string
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    onFileSelect,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    accept,
    maxSize,
    maxFiles = 1,
    multiple = false,
    className,
    ...props
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback(() => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(2) // Light vibration
      }
    }, [enableHaptics])

    // Handle file selection
    const handleFiles = React.useCallback((files: FileList | null) => {
      if (!files || disabled || loading) return

      handleHapticFeedback()

      const validFiles = Array.from(files).filter((file) => {
        // Check file type
        if (accept) {
          const acceptedTypes = accept.split(',').map((type) => type.trim())
          const fileType = file.type || `application/${file.name.split('.').pop()}`
          if (!acceptedTypes.some((type) => fileType.match(type))) {
            return false
          }
        }

        // Check file size
        if (maxSize && file.size > maxSize) {
          return false
        }

        return true
      })

      // Limit number of files
      const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles)
      setSelectedFiles(newFiles)
      onFileSelect?.(newFiles)
    }, [
      disabled,
      loading,
      handleHapticFeedback,
      accept,
      maxSize,
      maxFiles,
      selectedFiles,
      onFileSelect,
    ])

    // Handle drag events
    const handleDrag = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (disabled || loading) return

        if (e.type === 'dragenter' || e.type === 'dragover') {
          setIsDragging(true)
        } else if (e.type === 'dragleave' || e.type === 'drop') {
          setIsDragging(false)
        }
      },
      [disabled, loading]
    )

    // Handle drop
    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (disabled || loading) return

        handleFiles(e.dataTransfer.files)
      },
      [disabled, loading, handleFiles]
    )

    // Handle click
    const handleClick = React.useCallback(() => {
      if (disabled || loading) return
      inputRef.current?.click()
    }, [disabled, loading])

    // Handle remove file
    const handleRemove = React.useCallback((index: number) => {
      handleHapticFeedback()
      const newFiles = selectedFiles.filter((_, i) => i !== index)
      setSelectedFiles(newFiles)
      onFileSelect?.(newFiles)
    }, [selectedFiles, handleHapticFeedback, onFileSelect])

    return (
      <div className="space-y-1.5" ref={ref} {...props}>
        {label && (
          <div
            className={cn(
              'text-sm font-medium',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'text-destructive',
              success && 'text-success'
            )}
          >
            {label}
          </div>
        )}
        <div
          className={cn(
            fileUploadVariants(),
            isDragging && 'border-primary bg-surface-hover',
            (disabled || loading) && 'cursor-not-allowed opacity-50',
            className
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled || loading}
          />
          <div className="p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mx-auto mb-2 h-6 w-6 text-foreground/60"
            >
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <div className="text-sm">
              {isDragging ? (
                <span className="text-primary">Drop files here</span>
              ) : (
                <span>
                  Drag and drop files here or{' '}
                  <span className="text-primary">browse</span>
                </span>
              )}
            </div>
            {(accept || maxSize || maxFiles > 1) && (
              <div className="mt-1 text-xs text-foreground/60">
                {[
                  accept && `Accepted types: ${accept}`,
                  maxSize && `Max size: ${Math.round(maxSize / 1024 / 1024)}MB`,
                  maxFiles > 1 && `Max files: ${maxFiles}`,
                ]
                  .filter(Boolean)
                  .join(' • ')}
              </div>
            )}
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
        {/* Selected files */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              className="mt-2 space-y-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg bg-surface p-2 text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-foreground/60"
                    >
                      <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                    </svg>
                    <span className="truncate">{file.name}</span>
                    <span className="text-foreground/60">
                      {Math.round(file.size / 1024)}KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 text-foreground/60 hover:text-destructive"
                    disabled={disabled || loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {(helperText || error || success) && (
          <p
            className={cn(
              'text-xs',
              error && 'text-destructive',
              success && 'text-success',
              !error && !success && 'text-foreground/60'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'
