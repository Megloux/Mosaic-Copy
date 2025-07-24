import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { StandardButton } from '@/shared/ui/buttons/StandardButton';
import { Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/lib/hooks/use-toast';
import { toggle_favorite_routine, check_routine_relationship } from '@/shared/api/routines';

interface FavoriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ID of the routine to favorite/unfavorite */
  routine_id: string;
  
  /** Initial favorite state (if known) */
  default_favorited?: boolean;
  
  /** Called when favorite status changes */
  on_favorite_change?: (is_favorited: boolean) => void;
  
  /** Optional style overrides */
  className?: string;
}

export const FavoriteButton = ({
  routine_id,
  default_favorited = false,
  on_favorite_change,
  className,
  ...props
}: FavoriteButtonProps) => {
  // State
  const [is_favorited, set_is_favorited] = useState<boolean>(default_favorited);
  const [is_loading, set_is_loading] = useState<boolean>(false);
  const [is_checking, set_is_checking] = useState<boolean>(true);
  
  // Hooks
  const { toast } = useToast();
  
  // Check initial favorite status when component mounts
  useEffect(() => {
    const check_favorite_status = async () => {
      if (!routine_id) return;
      
      try {
        set_is_loading(true);
        const result = await check_routine_relationship(routine_id);
        
        if (result.success && result.favorited !== undefined) {
          set_is_favorited(result.favorited);
        } else {
          set_is_favorited(default_favorited);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
        set_is_favorited(default_favorited);
      } finally {
        set_is_loading(false);
        set_is_checking(false);
      }
    };
    
    check_favorite_status();
  }, [routine_id, default_favorited]);
  
  // Handle toggle favorite
  const handle_toggle = async () => {
    if (is_loading) return;
    
    try {
      set_is_loading(true);
      
      const result = await toggle_favorite_routine(routine_id);
      
      if (result.success) {
        // Update local state based on result
        const new_is_favorited = result.favorited || false;
        set_is_favorited(new_is_favorited);
        
        // Show notification
        toast({
          title: new_is_favorited ? 'Added to Favorites' : 'Removed from Favorites',
          description: new_is_favorited 
            ? 'This routine has been added to your favorites'
            : 'This routine has been removed from your favorites',
        });
        
        // Callback
        if (on_favorite_change) {
          on_favorite_change(new_is_favorited);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    } finally {
      set_is_loading(false);
    }
  };
  
  return (
    <StandardButton
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'group relative',
        'hover:bg-transparent focus:bg-transparent',
        'transition-all duration-300 ease-in-out',
        is_favorited && 'text-red-500',
        className
      )}
      onClick={handle_toggle}
      disabled={is_loading || is_checking}
      aria-label={is_favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={is_favorited ? 'Remove from favorites' : 'Add to favorites'}
      {...props}
    >
      {is_loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart 
          className={cn(
            'h-5 w-5 transition-all',
            is_favorited ? 'fill-current' : 'fill-none group-hover:fill-current group-hover:text-red-500'
          )}
        />
      )}
    </StandardButton>
  );
};
