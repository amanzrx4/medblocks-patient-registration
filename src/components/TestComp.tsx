import { queries } from '@/db/queries'
import { useLiveQuery, usePGlite } from '@electric-sql/pglite-react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { seedData } from '@/db/seed'
import type { PGliteWorkerWithLive } from '@/utils'

export default function TestComp() {
  const db = usePGlite() as PGliteWorkerWithLive
  const [count, setCount] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const records = useLiveQuery(queries.prod.selectAll)

  async function addRecords() {
    setIsAdding(true)
    try {
      await seedData(Number(count), db)
      console.log(`seeding successfull`)
    } catch (e) {
      console.error('Error in insert', e)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <Input
        value={count}
        onChange={(e) => {
          const value = e.target.value

          if (!isNaN(Number(value)) && value.trim() !== '') {
            setCount(value)
          }
        }}
      />
      <Button onClick={addRecords} disabled={isAdding}>
        {isAdding && <Loader2 className="animate-spin" />}

        {isAdding ? 'Seeding...' : 'Seed records'}
      </Button>

      <h1 className="text-3xl">LEADER: {db.isLeader}</h1>
      <h1 className="text-5xl">RECORDS LENGTH: {records?.rows.length}</h1>
    </div>
  )
}
