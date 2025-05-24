import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useLiveQueryProvider } from '@/hooks/LiveQueryProvider'
import type { UseLiveQueryResult } from '@/hooks/useLiveQuery'
import type { PatientTable } from '@/utils'
import {
  excelExport,
  getFormattedDate,
  uint8ArrayToDataURL
} from '@/utils/helpers'
import { AlertCircle, Download, Loader } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

function renderResultsTable(
  queryResult: UseLiveQueryResult<PatientTable>,
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientTable | null>>
) {
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
    return (
      <div className="rounded-md border p-2">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryResult.data!.rows.map((patient, idx) => {
              const patientPhotoSrc =
                patient.photo && uint8ArrayToDataURL(patient.photo!)

              const formattedDate = getFormattedDate(
                new Date(patient.registration_datetime)
              )

              return (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {patient.first_name} {patient.last_name}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone_number}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>
                    {patient.photo ? (
                      <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={patientPhotoSrc}
                        alt={`${patient.first_name} ${patient.last_name || ''}`}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          {patient.first_name[0]}
                          {patient.last_name?.[0] || ''}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {queryResult.data!.rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default function ResultsTable() {
  const { queryResult } = useLiveQueryProvider()
  const [error] = useState<string | null>(null)
  const [, setSelectedPatient] = useState<PatientTable | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const records = queryResult.data?.rows || []

  const handleExport = () => {
    // if (records.type !== 'success' || records.length === 0) return

    setIsExporting(true)
    try {
      const excelData = records.map((patient, idx) => ({
        Index: idx + 1,
        'First Name': patient.first_name,
        'Last Name': patient.last_name || '',
        Email: patient.email,
        Phone: patient.phone_number,
        'Registration Date': new Date(
          patient.registration_datetime
        ).toLocaleString(),
        Sex: patient.sex,
        'Date of Birth': patient.dob,
        'Address Line 1': patient.address_line1,
        'Address Line 2': patient.address_line2 || '',
        City: patient.city,
        State: patient.state,
        'Postal Code': patient.postal_code,
        Reason: patient.reason,
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
          disabled={
            records.length === 0
            // records.type !== 'success' ||
            // records.data.length === 0 ||
            // isExporting
          }
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
  )
}
