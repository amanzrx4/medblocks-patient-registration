import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import type { UseLiveQueryResult } from '@/hooks/useLiveQuery'
import { useLiveQueryProvider } from '@/providers/LiveQueryProvider'
import { patientTableKeys, type PatientTable } from '@/utils'
import {
  cleanArray,
  excelExport,
  formatKey,
  formatValueForObj
} from '@/utils/helpers'
import { AlertCircle, Download, Loader } from 'lucide-react'
import PatientDetailsDialog from './PatientDetailsDialog'
import { Alert, AlertDescription } from './ui/alert'

function renderResultsTable(
  queryResult: UseLiveQueryResult<unknown>,
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientTable | null>>
) {
  console.log('queryResult', queryResult)

  if (queryResult.status === 'idle') {
    return (
      <div className="p-2 flex items-center justify-center">
        <h1 className="font-bold">Start Querying</h1>
      </div>
    )
  }

  if (queryResult.status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{queryResult.error!.message}</AlertDescription>
      </Alert>
    )
  }

  if (queryResult.status === 'loading') {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader className="animate-spin" />
      </div>
    )
  }

  if (queryResult.status === 'success') {
    const rows = queryResult.data?.rows || []

    if (rows.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">No data available</div>
      )
    }

    const rowObject = rows[0]

    const allKeys = Object.keys(rowObject as Record<string, unknown>)

    // see how many keys are matching the patient table keys
    const keysMatching = allKeys.filter((key) =>
      patientTableKeys.includes(key as keyof PatientTable)
    )

    if (keysMatching.length === 0) {
      return (
        <div className="p-4 bg-gray-50 rounded-md overflow-auto">
          <pre className="text-xs">{JSON.stringify(rows, null, 2)}</pre>
        </div>
      )
    }

    const filteredRows = cleanArray(rows)

    return (
      <div className="rounded-md border p-2 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>#</TableHead>
              {Object.keys(filteredRows[0]).map((key) => (
                <TableHead key={key}>{formatKey(key)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow
                key={idx}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedPatient(row as PatientTable)}
              >
                <TableCell className="whitespace-nowrap">{idx + 1}</TableCell>

                {Object.keys(filteredRows[0]).map((key) => {
                  const value = formatValueForObj(
                    key as keyof PatientTable,
                    row[key]
                  )
                  return (
                    <TableCell
                      key={key}
                      className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap   hover:bg-gray-50 transition-all"
                      title={
                        typeof value === 'string'
                          ? value
                          : JSON.stringify(value)
                      }
                    >
                      {value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default function ResultsTable() {
  const { queryResult } = useLiveQueryProvider()
  const [error] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientTable | null>(
    null
  )

  const [isExporting, setIsExporting] = useState(false)

  const records = (queryResult.data?.rows as Partial<PatientTable>[]) || []

  // Calculate if we have matching keys for export
  const hasMatchingKeys = useMemo(() => {
    if (records.length === 0) return false
    const firstRow = records[0]
    if (!firstRow) return false
    const allKeys = Object.keys(firstRow)
    return allKeys.some((key) =>
      patientTableKeys.includes(key as keyof PatientTable)
    )
  }, [records])

  const handleExport = () => {
    // if (records.type !== 'success' || records.length === 0) return

    setIsExporting(true)
    try {
      const excelData = records.map<Record<string, string>>((patient, idx) => ({
        Index: (idx + 1).toString(),
        'First Name': patient.first_name || '',
        'Last Name': patient.last_name || '',
        Email: patient.email || '',
        Phone: patient.phone_number || '',
        'Registration Date': patient.registration_datetime
          ? new Date(patient.registration_datetime).toLocaleString()
          : '',
        Sex: patient.sex || '',
        'Date of Birth': patient.dob || '',
        'Address Line 1': patient.address_line1 || '',
        'Address Line 2': patient.address_line2 || '',
        City: patient.city || '',
        State: patient.state || '',
        'Postal Code': patient.postal_code || '',
        Reason: patient.reason || '',
        'Additional Notes': patient.additional_notes || '',
        'Patient History': patient.patient_history || ''
      }))

      excelExport(excelData)
    } catch (err) {
      console.error('Error exporting to Excel:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      {selectedPatient && (
        <PatientDetailsDialog
          patient={selectedPatient}
          onOpenChange={(open) => {
            if (!open) setSelectedPatient(null)
          }}
        />
      )}
      <Card className="flex flex-col h-full">
        <CardHeader className="flex-none">
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden">
          {error ? (
            <div className="p-4 bg-red-50 text-red-500 rounded-md">{error}</div>
          ) : (
            <div className="h-full overflow-auto">
              {renderResultsTable(queryResult, setSelectedPatient)}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-none border-t p-4">
          <Button
            onClick={handleExport}
            disabled={records.length === 0 || isExporting || !hasMatchingKeys}
            className="w-full"
            variant="outline"
          >
            {isExporting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
