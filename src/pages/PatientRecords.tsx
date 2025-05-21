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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@monaco-editor/react'
import { Database, Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useRoute } from 'wouter'
import { z } from 'zod'

const querySchema = z.object({
  searchType: z.enum(['name', 'email']),
  searchValue: z.string().min(1, 'Search value is required')
})

type QueryFormData = z.infer<typeof querySchema>

type Patient = PatientFormData & {
  id: number
}

function SqlQueryView() {
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM patients LIMIT 10')
  const [isLoading] = useState(false)

  const executeQuery = async (_query: string) => {}

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
            disabled={isLoading}
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

function ResultsTable({ patients }: { patients: Patient[] }) {
  const [error] = useState<string | null>(null)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-auto">
        {error ? (
          <div className="p-4 bg-red-50 text-red-500 rounded-md">{error}</div>
        ) : (
          <div className="rounded-md border h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell>
                      {new Date(patient.registrationDateTime).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PatientRecords() {
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/patient-records/:queryType?')
  const [patients] = useState<Patient[]>([])

  const isSqlMode = params?.queryType === 'sql'

  const handleQueryTypeChange = (isSqlMode: boolean) => {
    setLocation(`/patient-records/${isSqlMode ? 'sql' : 'simple'}`)
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left Panel - Query Interface */}
        {isSqlMode ? <SqlQueryView /> : <SimpleQueryView />}

        {/* Right Panel - Results Table */}
        <ResultsTable patients={patients} />
      </div>
    </div>
  )
}
