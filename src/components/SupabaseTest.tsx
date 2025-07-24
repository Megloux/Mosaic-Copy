import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

export default function SupabaseTest() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')

    useEffect(() => {
        async function testConnection() {
            try {
                const { error } = await supabase.auth.getSession()
                if (error) throw error
                setStatus('connected')
            } catch (error) {
                console.error('Supabase connection error:', error)
                setStatus('error')
            }
        }
        testConnection()
    }, [])

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Supabase Connection Status</h2>
            <div className={`p-2 rounded ${
                status === 'connected' ? 'bg-green-200' :
                status === 'error' ? 'bg-red-200' :
                'bg-yellow-200'
            }`}>
                {status === 'connected' && 'Connected to Supabase! '}
                {status === 'error' && 'Connection Error! '}
                {status === 'loading' && 'Testing connection... '}
            </div>
        </div>
    )
}
