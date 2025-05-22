import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PatientTable } from '@/schema/postgres'
import { uint8ArrayToDataURL } from '@/utils/helpers'
import PatientDetailsDialog from './PatientDetailsDialog'

export default function ResultsTable({
  patients
}: {
  patients: PatientTable[]
}) {
  const [error] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientTable | null>(
    null
  )

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPatient(null)
    }
  }

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
                  <TableHead>Photo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => {
                  const patientPhotoSrc =
                    patient && uint8ArrayToDataURL(patient.photo!)

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
                        {new Date(
                          patient.registration_datetime
                        ).toLocaleString()}
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
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {selectedPatient && (
        <PatientDetailsDialog
          patient={selectedPatient}
          trigger={<div className="hidden" />}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </Card>
  )
}
