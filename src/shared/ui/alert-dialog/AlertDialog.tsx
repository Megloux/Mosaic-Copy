import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AlertDialogProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ children, className }) => {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  );
};

export const AlertDialogTrigger = ({ children, asChild = false, className }: AlertDialogTriggerProps) => {
  return (
    <div className={cn('inline-flex', className)}>
      {asChild ? children : <button>{children}</button>}
    </div>
  );
};

export const AlertDialogContent = ({ children, className }: AlertDialogContentProps) => {
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

export const AlertDialogHeader = ({ children, className }: AlertDialogHeaderProps) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

export const AlertDialogTitle = ({ children, className }: AlertDialogTitleProps) => {
  return (
    <h2 className={cn('text-lg font-semibold', className)}>
      {children}
    </h2>
  );
};

export const AlertDialogDescription = ({ children, className }: AlertDialogDescriptionProps) => {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-2', className)}>
      {children}
    </p>
  );
};

export const AlertDialogFooter = ({ children, className }: AlertDialogFooterProps) => {
  return (
    <div className={cn('flex justify-end space-x-2 mt-6', className)}>
      {children}
    </div>
  );
};

export const AlertDialogAction = ({ children, className, ...props }: AlertDialogActionProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const AlertDialogCancel = ({ children, className, ...props }: AlertDialogCancelProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        'bg-transparent border border-gray-300 dark:border-gray-600',
        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
