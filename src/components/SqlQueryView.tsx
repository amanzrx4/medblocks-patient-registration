import type { QueryStatus, PatientTable } from '@/utils'
import { usePGlite } from '@electric-sql/pglite-react'
import { Database } from 'lucide-react'
import { lazy, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

const Editor = lazy(() =>
  import('@monaco-editor/react').then((mod) => ({ default: mod.Editor }))
)
export default function SqlQueryView({
  records,
  setRecords
}: {
  records: QueryStatus<PatientTable[]>
  setRecords: React.Dispatch<React.SetStateAction<QueryStatus<PatientTable[]>>>
}) {
  const db = usePGlite()
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM patients LIMIT 10')

  const executeQuery = async (query: string) => {
    setRecords({ type: 'loading' })
    try {
      const results = (await db.query(query)).rows as PatientTable[]
      setRecords({ type: 'success', data: results })
    } catch (error) {
      setRecords({ type: 'error', error: error as Error })
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          SQL Query
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
            <Editor
              height="100%"
              language="sql"
              value={sqlQuery}
              onChange={(value) => setSqlQuery(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on'
              }}
            />
          </div>
          <Button
            onClick={() => executeQuery(sqlQuery)}
            disabled={records.type === 'loading'}
            className="w-full flex-none"
          >
            Execute Query
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
