import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { StandardButton } from '@/shared/ui/buttons/StandardButton';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/lib/hooks/use-toast';
import { remove_routine_from_library } from '@/shared/api/routines';

interface RemoveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ID of the routine to remove */
  routine_id: string;
  
  /** Called when removal completes successfully */
  on_remove_complete?: () => void;
  
  /** Optional style overrides */
  className?: string;
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';

export const RemoveButton = ({
  routine_id,
  on_remove_complete,
  className,
  ...props
}: RemoveButtonProps) => {
  // State
  const [is_removing, set_is_removing] = useState(false);
  const [is_dialog_open, set_is_dialog_open] = useState(false);
  
  // Hooks
  const { toast } = useToast();
  
  // Handle remove action
  const handle_remove = async () => {
    if (is_removing) return;
    
    try {
      set_is_removing(true);
      
      const { error } = await remove_routine_from_library(routine_id);
      
      if (error) throw error;
      
      // Show success notification
      toast({
        title: 'Routine removed',
        description: 'The routine has been removed from your library',
        variant: 'default',
      });
      
      // Close dialog
      set_is_dialog_open(false);
      
      // Callback
      if (on_remove_complete) {
        on_remove_complete();
      }
    } catch (error) {
      console.error('Error removing routine:', error);
      toast({
        title: 'Removal failed',
        description: 'Could not remove the routine from your library',
        variant: 'destructive',
      });
    } finally {
      set_is_removing(false);
    }
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <StandardButton
          variant="ghost"
          size="icon"
          className={cn(
            'group relative',
            'hover:bg-transparent focus:bg-transparent hover:text-destructive',
            'transition-all duration-300 ease-in-out',
            className
          )}
          aria-label="Remove routine"
          title="Remove routine"
          {...props}
        >
          <Trash2 className="w-5 h-5" />
        </StandardButton>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Routine</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this routine from your library? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={is_removing}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handle_remove}
            disabled={is_removing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {is_removing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              'Remove'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
