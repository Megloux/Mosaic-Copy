import { from } from '@/shared/api/supabase/client'
import { getAllFromStore, processQueue, saveToStore } from '@/lib/storage/db'
import type { Template } from '@/features/routines/model/types'
import type { Exercise } from '@/features/exercises/model/types'
import type { Category, Block } from '@/shared/api/supabase/types'

// Sync specific table data
async function syncTable<T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  timestamp?: number
) {
  const query = from[table]().select('*')
  
  if (timestamp) {
    query.gt('updated_at', new Date(timestamp).toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error(`Failed to sync ${table}:`, error)
    return
  }

  // Save all records to IndexedDB
  await Promise.all(data.map(record => saveToStore(table, record)))

  return data
}

// Sync all data
export async function syncAll() {
  try {
    // Process any pending offline changes first
    await processQueue()

    // Then sync each table
    const [categories, exercises, blocks, templates] = await Promise.all([
      syncTable('categories'),
      syncTable('exercises'),
      syncTable('blocks'),
      syncTable('templates')
    ])

    return {
      categories,
      exercises,
      blocks,
      templates
    }
  } catch (error) {
    console.error('Sync failed:', error)
    throw error
  }
}

// Initial sync on load
export async function initialSync() {
  // Get last sync timestamp from localStorage
  const lastSync = localStorage.getItem('lastSync')
  const timestamp = lastSync ? parseInt(lastSync, 10) : undefined

  await syncAll()

  // Update last sync timestamp
  localStorage.setItem('lastSync', Date.now().toString())
}

// Setup periodic sync
let syncInterval: number

export function startPeriodicSync(intervalMs = 60000) {
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval)
  }

  // Start new sync interval
  syncInterval = window.setInterval(async () => {
    if (navigator.onLine) {
      try {
        await syncAll()
        localStorage.setItem('lastSync', Date.now().toString())
      } catch (error) {
        console.error('Periodic sync failed:', error)
      }
    }
  }, intervalMs)
}

export function stopPeriodicSync() {
  if (syncInterval) {
    clearInterval(syncInterval)
  }
}
