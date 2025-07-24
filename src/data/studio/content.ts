import { supabase } from '../../config/supabase';
import { ExerciseId, StudioId } from '../../types/ids';
import { StudioCustomization } from './types';

/**
 * Generic function to get studio-specific content or fall back to default
 * @param contentId - ID of the content (exercise, template, etc)
 * @param studioId - Optional studio ID
 * @param field - Which field to retrieve from customizations
 * @param defaultGetter - Function to get default value if no customization exists
 */
export async function getStudioContent<T extends keyof StudioCustomization>(
    contentId: ExerciseId,
    studioId: StudioId | undefined,
    field: T,
    defaultGetter: () => Promise<StudioCustomization[T]>
): Promise<StudioCustomization[T]> {
    // If no studio ID, just return default
    if (!studioId) {
        return defaultGetter();
    }

    // Look for studio customization
    const { data: customization } = await supabase
        .from('studio_customizations')
        .select(field)
        .eq('studio_id', studioId)
        .eq('content_type', 'exercise')
        .eq('content_id', contentId)
        .single();

    // Return studio content if it exists, otherwise default
    return customization?.[field] || defaultGetter();
}

/**
 * Get video ID for an exercise, considering studio customizations
 */
export async function getExerciseVideo(exerciseId: ExerciseId, studioId?: StudioId): Promise<string> {
    return getStudioContent(
        exerciseId,
        studioId,
        'vimeo_id',
        async () => {
            // Get default video ID from exercises table
            const { data } = await supabase
                .from('exercises')
                .select('vimeo_id')
                .eq('id', exerciseId)
                .single();
            return data?.vimeo_id;
        }
    );
}

/**
 * Get name for an exercise, considering studio customizations
 */
export async function getExerciseName(exerciseId: ExerciseId, studioId?: StudioId): Promise<string> {
    return getStudioContent(
        exerciseId,
        studioId,
        'custom_name',
        async () => {
            // Get default name from exercises table
            const { data } = await supabase
                .from('exercises')
                .select('name')
                .eq('id', exerciseId)
                .single();
            return data?.name;
        }
    );
}
