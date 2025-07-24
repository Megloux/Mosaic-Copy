import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { StandardButton } from '@/shared/ui/buttons/StandardButton';
import { Share2, Loader2, Search, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/form/Input';
import { useToast } from '@/shared/lib/hooks/use-toast';
import { share_routine_with_user } from '@/shared/api/routines';
import { supabase } from '@/shared/api/supabase/client';

interface ShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ID of the routine being shared */
  routine_id: string;
  
  /** Called when sharing completes successfully */
  on_share_complete?: (target_user_id: string) => void;
  
  /** Optional style overrides */
  className?: string;
}

interface UserSearchResult {
  id: string;
  username: string;  // Changed from display_name to match our schema
  email: string;
  avatar_url?: string;
  shared?: boolean;
}

/**
 * ShareButton Component
 * 
 * Allows users to share routines with other Mosaic users through
 * a searchable dialog interface. Follows Spotify's sharing pattern.
 */
export function ShareButton({
  routine_id,
  on_share_complete,
  className,
  ...props
}: ShareButtonProps) {
  // State management
  const [search_query, set_search_query] = useState('');
  const [is_searching, set_is_searching] = useState(false);
  const [is_sharing, set_is_sharing] = useState(false);
  const [search_results, set_search_results] = useState<UserSearchResult[]>([]);
  const [sharing_user_id, set_sharing_user_id] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Handle search for users
  const handle_search = async () => {
    if (!search_query.trim()) {
      set_search_results([]);
      return;
    }
    
    set_is_searching(true);
    try {
      // Search for users by username or email
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, avatar_url')  // Updated to match schema
        .or(`username.ilike.%${search_query}%,email.ilike.%${search_query}%`)
        .limit(5);
      
      if (error) throw error;
      
      set_search_results(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Search failed',
        description: 'Unable to search for users at this time',
        variant: 'destructive',
      });
    } finally {
      set_is_searching(false);
    }
  };
  
  // Handle sharing with a user
  const handle_share = async (target_user_id: string) => {
    if (is_sharing) return;
    
    try {
      set_is_sharing(true);
      set_sharing_user_id(target_user_id);
      
      const result = await share_routine_with_user(routine_id, target_user_id);
      
      if (result.success) {
        toast({
          title: 'Routine shared',
          description: 'The routine has been shared successfully',
          variant: 'default',
        });
        
        // Mark user as shared in results
        set_search_results(prev => 
          prev.map(user => 
            user.id === target_user_id 
              ? { ...user, shared: true } 
              : user
          )
        );
        
        // Callback
        if (on_share_complete) {
          on_share_complete(target_user_id);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sharing routine:', error);
      toast({
        title: 'Sharing failed',
        description: 'Could not share the routine with this user',
        variant: 'destructive',
      });
    } finally {
      set_is_sharing(false);
      set_sharing_user_id(null);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <StandardButton
          variant="ghost"
          size="icon"
          className={cn(
            "relative group p-2",
            "hover:bg-accent hover:text-accent-foreground",
            className
          )}
          aria-label="Share routine"
          {...props}
        >
          <Share2 className="w-5 h-5" />
        </StandardButton>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Share Routine</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by username or email..."
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handle_search()}
              className="flex-1"
              disabled={is_searching || is_sharing}
              aria-label="Search users"
            />
            <StandardButton 
              variant="outline" 
              onClick={handle_search}
              disabled={is_searching || is_sharing}
              aria-label="Search"
            >
              {is_searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </StandardButton>
          </div>
          
          {search_results.length > 0 ? (
            <div className="border rounded-md divide-y">
              {search_results.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    {/* TODO: Create or import Avatar components */}
                    {/* <Avatar>
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>
                        {user.username?.substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar> */}
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <StandardButton
                    size="sm"
                    variant="ghost"
                    onClick={() => handle_share(user.id)}
                    disabled={is_sharing || user.shared}
                    aria-label={`Share with ${user.username}`}
                  >
                    {is_sharing && sharing_user_id === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user.shared ? (
                      <span className="text-sm text-muted-foreground">Shared</span>
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </StandardButton>
                </div>
              ))}
            </div>
          ) : search_query && !is_searching ? (
            <div className="text-center py-4 text-muted-foreground">
              No users found matching "{search_query}"
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
