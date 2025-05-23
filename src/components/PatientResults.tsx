import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { type QueryStatus } from '@/utils'
import { useState } from 'react'
import * as XLSX from 'xlsx'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { PatientTable } from '@/utils'
import { uint8ArrayToDataURL } from '@/utils/helpers'
import { AlertCircle, Download, Loader } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

function renderResultsTable(
  records: QueryStatus<PatientTable[]>,
  setSelectedPatient: React.Dispatch<React.SetStateAction<PatientTable | null>>
) {
  if (records.type === 'idle') {
    return <h1>START QUERYING SOMETHING</h1>
  }

  if (records.type === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{records.error.message}</AlertDescription>
      </Alert>
    )
  }

  if (records.type === 'loading') {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Photo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.data.map((patient) => {
            const patientPhotoSrc =
              patient.photo && uint8ArrayToDataURL(patient.photo!)

            return (
              <TableRow
                key={patient.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedPatient(patient)}
              >
                <TableCell>
                  {patient.first_name} {patient.last_name}
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone_number}</TableCell>
                <TableCell>
                  {new Date(patient.registration_datetime).toLocaleString()}
                </TableCell>
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
          {records.data.length === 0 && (
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

export default function ResultsTable({
  records
}: {
  records: QueryStatus<PatientTable[]>
}) {
  const [error] = useState<string | null>(null)
  const [, setSelectedPatient] = useState<PatientTable | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    if (records.type !== 'success' || records.data.length === 0) return

    setIsExporting(true)
    try {
      // Transform data for Excel
      const excelData = records.data.map((patient) => ({
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

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Patients')

      // Generate Excel file
      const fileName = `patient_records_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
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
            {renderResultsTable(records, setSelectedPatient)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-none border-t p-4">
        <Button
          onClick={handleExport}
          disabled={
            records.type !== 'success' ||
            records.data.length === 0 ||
            isExporting
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
