import { importExercises } from '@/lib/transforms/importExercises'

async function main() {
  const result = await importExercises()
  
  if (result.success) {
    console.log('\nImport completed successfully!')
    console.log(`Imported ${result.importedCount} exercises`)
    process.exit(0)
  } else {
    console.error('\nImport failed:', result.error)
    process.exit(1)
  }
}

main()
