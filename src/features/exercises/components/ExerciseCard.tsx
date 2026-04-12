import React, { useState, useCallback } from 'react'
import { Zap } from 'lucide-react'
import { Exercise } from '@/data/core/exercises'

// Define the props interface with clear boundaries
export interface ExerciseCardProps {
  exercise: Exercise
  onClick?: (exercise: Exercise) => void
  className?: string
  enableHaptics?: boolean
  layout?: 'list' | 'grid'
}

/**
 * ExerciseCard component — compact row with Vimeo thumbnail
 * 
 * Features:
 * - Compact row layout matching dark glassmorphism design system
 * - Vimeo video thumbnail or teal placeholder
 * - Exercise name, time, and spring info
 * - Haptic feedback on tap
 */
export const ExerciseCard = React.memo(({
  exercise,
  onClick,
  className = '',
  enableHaptics = true,
  layout = 'list'
}: ExerciseCardProps) => {
  const [imageError, setImageError] = useState(false)
  const isGrid = layout === 'grid'

  const hasVimeo = exercise.vimeo_id && /^\d+$/.test(exercise.vimeo_id)
  const thumbnailUrl = hasVimeo
    ? `https://vumbnail.com/${exercise.vimeo_id}.jpg`
    : null

  const handleClick = useCallback(() => {
    if (enableHaptics && window.navigator.vibrate) {
      window.navigator.vibrate(3)
    }
    onClick?.(exercise)
  }, [exercise, onClick, enableHaptics])

  const springs = exercise.spring_setup
  const hasSpringInfo = springs.light_springs > 0 || springs.heavy_springs > 0

  // Shared thumbnail element
  const thumbnail = (
    <div
      className={`${
        isGrid ? 'w-full aspect-[4/3]' : 'w-11 h-11'
      } rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center`}
      style={{ backgroundColor: 'rgba(0,183,120,0.10)' }}
    >
      {thumbnailUrl && !imageError ? (
        <img
          src={thumbnailUrl}
          alt={exercise.exercise_name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <Zap className={isGrid ? 'w-6 h-6' : 'w-4 h-4'} style={{ color: 'rgba(0,183,120,0.5)' }} />
      )}
    </div>
  )

  // Grid layout — vertical card
  if (isGrid) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full rounded-xl text-left transition-colors overflow-hidden ${className}`}
        style={{
          backgroundColor: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.04)',
          transitionDuration: 'var(--motion-natural)',
        }}
      >
        {thumbnail}
        <div className="px-3 py-2.5">
          <p
            className="text-xs font-semibold capitalize truncate"
            style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
          >
            {exercise.exercise_name}
          </p>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
          >
            {exercise.standard_time}
            {hasSpringInfo && ` · ${springs.light_springs > 0 ? `${springs.light_springs}L` : ''}${springs.light_springs > 0 && springs.heavy_springs > 0 ? ' ' : ''}${springs.heavy_springs > 0 ? `${springs.heavy_springs}H` : ''}`}
          </p>
        </div>
      </button>
    )
  }

  // List layout — compact row (default)
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group ${className}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.025)',
        transitionDuration: 'var(--motion-natural)',
      }}
    >
      {thumbnail}

      {/* Name + metadata */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium capitalize truncate"
          style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}
        >
          {exercise.exercise_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs"
            style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
          >
            {exercise.standard_time}
          </span>
          {hasSpringInfo && (
            <>
              <span className="text-white/10">·</span>
              <span
                className="text-xs"
                style={{ color: 'var(--text-tertiary-color)', fontWeight: 'var(--text-tertiary-weight)' }}
              >
                {springs.light_springs > 0 && `${springs.light_springs}L`}
                {springs.light_springs > 0 && springs.heavy_springs > 0 && ' '}
                {springs.heavy_springs > 0 && `${springs.heavy_springs}H`}
              </span>
            </>
          )}
          {exercise.template_tags.length > 0 && (
            <>
              <span className="text-white/10">·</span>
              <span
                className="text-xs truncate"
                style={{ color: 'var(--text-muted-color)', fontWeight: 'var(--text-muted-weight)' }}
              >
                {exercise.template_tags[0]}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  )
})

ExerciseCard.displayName = 'ExerciseCard'
