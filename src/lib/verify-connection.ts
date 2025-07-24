import { supabaseAdmin } from './supabase'

async function verifyConnection() {
    // Test templates table first - it's critical for our migration
    const { data: templates, error: templateError } = await supabaseAdmin
        .from('templates')
        .select('id')
        .limit(1)
    
    if (templateError) {
        console.error('Template query failed:', templateError)
        return false
    }

    // Test routines table next
    const { data: routines, error: routineError } = await supabaseAdmin
        .from('routines')
        .select('id')
        .limit(1)

    if (routineError) {
        console.error('Routine query failed:', routineError)
        return false
    }

    console.log('Connection verified with sample data:', {
        templates: templates?.length || 0,
        routines: routines?.length || 0
    })
    return true
}

verifyConnection()
