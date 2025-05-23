import ResultsTable from '@/components/PatientResults'
import type { FormData as PatientFormData } from '@/components/RegitrationForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { PatientTable, QueryStatus } from '@/utils'
import { usePGlite } from '@electric-sql/pglite-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Database, Search } from 'lucide-react'
import { lazy, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useRoute } from 'wouter'
import { z } from 'zod'

const Editor = lazy(() =>
  import('@monaco-editor/react').then((mod) => ({ default: mod.Editor }))
)

const querySchema = z.object({
  searchType: z.enum(['name', 'email']),
  searchValue: z.string().min(1, 'Search value is required')
})

type QueryFormData = z.infer<typeof querySchema>

export type Patient = PatientFormData & {
  id: number
}

function SqlQueryView({
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
              defaultLanguage="sql"
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

function SimpleQueryView() {
  const [isLoading] = useState(false)
  // const [patients] = useState<Patient[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema)
  })

  const onSubmit = async (_data: QueryFormData) => {}

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Simple Search
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0 space-y-4"
        >
          <div className="space-y-2 flex-none">
            <Label htmlFor="searchType">Search By</Label>
            <Select {...register('searchType')} defaultValue="name">
              <SelectTrigger>
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-none">
            <Label htmlFor="searchValue">Search Value</Label>
            <Input
              id="searchValue"
              {...register('searchValue')}
              placeholder="Enter search value..."
            />
            {errors.searchValue && (
              <p className="text-sm text-red-500">
                {errors.searchValue.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex-none"
          >
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function PatientRecords() {
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/patient-records/:queryType?')
  const [records, setRecords] = useState<QueryStatus<PatientTable[]>>({
    type: 'idle'
  })

  const isSqlMode = params?.queryType === 'sql'

  const handleQueryTypeChange = (isSqlMode: boolean) => {
    setLocation(`/patient-records/${isSqlMode ? 'sql' : 'simple'}`)
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-none">
        <h1 className="text-2xl font-bold">Patient Records</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="sql-mode">SQL Mode</Label>
          <Switch
            id="sql-mode"
            checked={isSqlMode}
            onCheckedChange={handleQueryTypeChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Panel - Query Interface */}
        {isSqlMode ? (
          <SqlQueryView records={records} setRecords={setRecords} />
        ) : (
          <SimpleQueryView />
        )}

        <div className="h-full overflow-hidden">
          <ResultsTable records={records} />
        </div>
      </div>
    </div>
  )
}
