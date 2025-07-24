import { supabaseAdmin } from '@/shared/api/supabase/client'

/**
 * Verifies connection to the Supabase database by checking critical tables
 * @returns Promise<boolean> - true if connection is successful, false otherwise
 */
async function verifyConnection(): Promise<boolean> {
    // Test templates table first - it's critical for our migration
    const { error: templateError } = await supabaseAdmin
        .from('templates')
        .select('id')
        .limit(1)
    
    if (templateError) {
        console.error('Template query failed:', templateError)
        return false
    }

    // Test routines table next
    const { error: routineError } = await supabaseAdmin
        .from('routines')
        .select('id')
        .limit(1)

    if (routineError) {
        console.error('Routines query failed:', routineError)
        return false
    }

    // Test exercises table last
    const { error: exerciseError } = await supabaseAdmin
        .from('exercises')
        .select('id')
        .limit(1)

    if (exerciseError) {
        console.error('Exercises query failed:', exerciseError)
        return false
    }

    return true
}

export { verifyConnection }
