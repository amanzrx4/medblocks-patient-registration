import ResultsTable from '@/components/PatientResults'
import type { FormData as PatientFormData } from '@/components/RegitrationForm'
import SqlQueryView from '@/components/SimpleQueryView'
import SimpleQueryView from '@/components/SqlQueryView'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { PatientTable, QueryStatus } from '@/utils'
import { useState } from 'react'
import { useLocation, useRoute } from 'wouter'

export type Patient = PatientFormData & {
  id: number
}
export const INITIAL_QUERY = 'SELECT * FROM PATIENTS LIMIT 10'

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
        <h1 className="text-2xl font-bold">Patient Records Search</h1>
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
          <SimpleQueryView records={records} setRecords={setRecords} />
        )}

        <div className="h-full overflow-hidden">
          <ResultsTable records={records} />
        </div>
      </div>
    </div>
  )
}
