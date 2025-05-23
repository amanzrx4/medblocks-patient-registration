import { useLiveQuery, usePGlite } from '@electric-sql/pglite-react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

export default function TestComp() {
  const db = usePGlite()
  const [isAdding, setIsAdding] = useState(false)

  const records = useLiveQuery(`SELECT * FROM users;`)

  async function addRecords() {
    setIsAdding(true)
    try {
      await db.query("INSERT INTO users (name) VALUES ('Alice')")
    } catch (e) {
      console.error('Error in insert', e)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div>
      <Button onClick={addRecords} disabled={isAdding}>
        {isAdding && <Loader2 className="animate-spin" />}

        {isAdding ? 'Adding...' : 'Add records'}
      </Button>

      <h1 className="text-3xl">LEADER: {db.isLeader}</h1>
      <h1 className="text-5xl">RECORDS LENGTH: {records?.rows.length}</h1>
    </div>
  )
}
