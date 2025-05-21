import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Patient } from '@/pages/PatientRecords'

export default function ResultsTable({ patients }: { patients: Patient[] }) {
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
