import React from 'react'
import { cn } from '@/shared/lib/utils'
import { motion } from 'framer-motion'

export interface PasswordStrength {
  score: number // 0-4
  feedback: {
    warning?: string
    suggestions: string[]
  }
}

export interface StrengthIndicatorProps {
  strength: PasswordStrength
  className?: string
}

const strengthColors = {
  0: 'bg-destructive',
  1: 'bg-orange-500',
  2: 'bg-yellow-500',
  3: 'bg-lime-500',
  4: 'bg-success'
}

const strengthLabels = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong'
}

export const StrengthIndicator = React.forwardRef<HTMLDivElement, StrengthIndicatorProps>(
  ({ strength, className }, ref) => {
    const segments = Array.from({ length: 4 }, (_, i) => i)
    
    return (
      <div className={cn('space-y-2', className)} ref={ref}>
        <div className="flex gap-1">
          {segments.map((segment) => (
            <motion.div
              key={segment}
              className={cn(
                'h-1 flex-1 rounded-full',
                segment <= strength.score ? strengthColors[strength.score as keyof typeof strengthColors] : 'bg-foreground/10'
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.2, delay: segment * 0.1 }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={cn(
            'font-medium',
            strength.score >= 3 && 'text-success',
            strength.score === 2 && 'text-yellow-500',
            strength.score <= 1 && 'text-destructive'
          )}>
            {strengthLabels[strength.score as keyof typeof strengthLabels]}
          </span>
          {strength.feedback.warning && (
            <span className="text-destructive">
              {strength.feedback.warning}
            </span>
          )}
        </div>
        {strength.feedback.suggestions.length > 0 && (
          <ul className="text-xs text-foreground/60 space-y-1 list-disc list-inside">
            {strength.feedback.suggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

StrengthIndicator.displayName = 'StrengthIndicator'
