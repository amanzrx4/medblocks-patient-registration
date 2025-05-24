import ResultsTable from '@/components/PatientResults'
import type { FormData as PatientFormData } from '@/components/RegitrationForm'
import SimpleQueryView from '@/components/SimpleQueryView'
import SqlQueryView from '@/components/SqlQueryView'
import SwitchQuery from '@/components/SwitchQuery'
import { LiveQueryProvider } from '@/hooks/LiveQueryProvider'
import { useRoute } from 'wouter'

export type Patient = PatientFormData & {
  id: number
}

export type QueryObj = {
  query: string | undefined
  params: unknown[] | undefined | null
}

export default function PatientRecords() {
  const [, params] = useRoute('/patient-records/:queryType?')
  const isSqlMode = params?.queryType === 'sql'

  return (
    //  since  the query state is being used multiple times in child components, let's use a provider instead of prop drilling
    <LiveQueryProvider>
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-none">
          <h1 className="text-2xl font-bold">Patient Records Search</h1>
          <SwitchQuery isSqlMode={isSqlMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
          {isSqlMode ? <SqlQueryView /> : <SimpleQueryView />}

          <div className="h-full overflow-hidden">
            <ResultsTable />
          </div>
        </div>
      </div>
    </LiveQueryProvider>
  )
}
