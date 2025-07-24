import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Switch } from '@/components/ui/form/Switch';
import { Globe, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/api/supabase';
// TODO: Create or import useToast hook
// import { useToast } from '@/hooks/use-toast';

interface PublicToggleProps {
  /** ID of the routine */
  routine_id: string;
  
  /** Initial public/private state */
  is_public: boolean;
  
  /** Called when public status changes */
  on_toggle_complete?: (is_public: boolean) => void;
  
  /** Optional style overrides */
  class_name?: string;
}

/**
 * PublicToggle Component
 * 
 * Toggles the public/private status of a routine.
 * Shows globe icon when public, lock icon when private.
 * Follows Spotify's public/private toggle pattern.
 */
export function PublicToggle({
  routine_id,
  is_public,
  on_toggle_complete,
  class_name
}: PublicToggleProps) {
  // Local state
  const [is_toggling, set_is_toggling] = useState(false);
  const [current_state, set_current_state] = useState(is_public);
  // TODO: Implement proper toast functionality
  // const { toast } = useToast();
  
  // Handle toggle
  const handleToggle = async () => {
    set_is_toggling(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        // toast({
        //   title: 'Authentication required',
        //   description: 'You must be logged in to change routine visibility.',
        //   variant: 'destructive'
        // });
        set_is_toggling(false);
        return;
      }
      
      // Update routine visibility in Supabase
      const { error } = await supabase
        .from('routines')
        .update({ is_public: !current_state })
        .eq('id', routine_id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Failed to update routine visibility:', error);
        // toast({
        //   title: 'Update failed',
        //   description: 'Could not change routine visibility. Please try again.',
        //   variant: 'destructive'
        // });
        set_is_toggling(false);
        return;
      }
      
      // Update local state
      set_current_state(!current_state);
      
      // Notify parent component
      if (on_toggle_complete) {
        on_toggle_complete(!current_state);
      }
      
      // Show success toast
      // toast({
      //   title: 'Visibility updated',
      //   description: `Routine is now ${!current_state ? 'public' : 'private'}.`,
      //   variant: 'default'
      // });
    } catch (err) {
      console.error('Error toggling routine visibility:', err);
      // toast({
      //   title: 'Something went wrong',
      //   description: 'Could not change routine visibility. Please try again.',
      //   variant: 'destructive'
      // });
    } finally {
      set_is_toggling(false);
    }
  };
  
  return (
    <div className={cn("flex items-center space-x-2", class_name)}>
      {is_toggling ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : current_state ? (
        <Globe className="w-4 h-4 mr-2 text-green-500" />
      ) : (
        <Lock className="w-4 h-4 mr-2 text-amber-500" />
      )}
      
      <label htmlFor={`public-toggle-${routine_id}`} className="text-sm">
        {current_state ? 'Public' : 'Private'}
      </label>
      
      <Switch
        id={`public-toggle-${routine_id}`}
        checked={current_state}
        onChange={handleToggle}
        disabled={is_toggling}
        aria-label={`Toggle ${current_state ? 'private' : 'public'} status`}
      />
    </div>
  );
}
