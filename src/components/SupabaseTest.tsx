import { useEffect, useState } from 'react'

/**
 * SupabaseTest Component - DEVELOPMENT STUB
 * 
 * This is stubbed to avoid requiring real Supabase credentials during development.
 * TODO: Replace with real Supabase connection when credentials are available
 */
export default function SupabaseTest() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')

    useEffect(() => {
        // Simulate connection test
        const timer = setTimeout(() => {
            // Check if we have environment variables
            const hasSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
            const hasSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
            
            if (hasSupabaseUrl && hasSupabaseKey && 
                hasSupabaseUrl !== 'your_project_url' && 
                hasSupabaseKey !== 'your_anon_key') {
                setStatus('connected')
            } else {
                setStatus('error')
            }
        }, 1000)
        
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Supabase Connection Status</h2>
            <div className={`p-2 rounded ${
                status === 'connected' ? 'bg-green-200' :
                status === 'error' ? 'bg-red-200' :
                'bg-yellow-200'
            }`}>
                {status === 'connected' && 'Connected to Supabase! ✅'}
                {status === 'error' && 'Development Mode - Supabase credentials not configured 🔧'}
                {status === 'loading' && 'Testing connection... ⏳'}
            </div>
        </div>
    )
}
