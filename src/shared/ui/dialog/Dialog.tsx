import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DialogProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ children, className }) => {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  );
};

export const DialogTrigger = ({ children, asChild = false, className }: DialogTriggerProps) => {
  return (
    <div className={cn('inline-flex', className)}>
      {asChild ? children : <button>{children}</button>}
    </div>
  );
};

export const DialogContent = ({ children, className }: DialogContentProps) => {
  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={cn(
          'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4',
          'border border-gray-200 dark:border-gray-700'
        )}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return (
    <h2 className={cn('text-lg font-semibold', className)}>
      {children}
    </h2>
  );
};
