import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { PatientTable } from '@/utils'
import { uint8ArrayToDataURL } from '@/utils/helpers'
import { useEffect, useState } from 'react'

interface PatientDetailsDialogProps {
  patient: PatientTable
  onOpenChange?: (open: boolean) => void
}

export default function PatientDetailsDialog({
  patient,
  onOpenChange
}: PatientDetailsDialogProps) {
  const [open, setOpen] = useState(true)
  const patientPhotoSrc = patient.photo
    ? uint8ArrayToDataURL(patient.photo)
    : null

  useEffect(() => {
    setOpen(true)
  }, [patient])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const Field = ({ label, value }: { label: string; value: string | null }) => {
    if (value === null || value === undefined) return null
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <div className="rounded-md border bg-gray-50 p-3">
          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
            {value}
          </p>
        </div>
      </div>
    )
  }

  console.log('key_value_pairs', patient.key_value_pairs)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Patient Details
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-8rem)]">
          <div className="p-6 space-y-6">
            {patientPhotoSrc && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Photo</h3>
                <div className="rounded-md border bg-gray-50 p-3">
                  <img
                    src={patientPhotoSrc}
                    alt={`${patient.first_name} ${patient.last_name || ''}`}
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            )}

            <Field
              label="Full Name"
              value={`${patient.first_name} ${patient.last_name || ''}`}
            />
            <Field label="Sex" value={patient.sex} />
            <Field
              label="Date of Birth"
              value={new Date(patient.dob).toLocaleDateString()}
            />
            <Field
              label="Registration Date"
              value={new Date(patient.registration_datetime).toLocaleString()}
            />
            <Field label="Email" value={patient.email} />
            <Field label="Phone" value={patient.phone_number} />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <div className="rounded-md border bg-gray-50 p-3 space-y-1">
                <p className="text-sm text-gray-900">{patient.address_line1}</p>
                {patient.address_line2 && (
                  <p className="text-sm text-gray-900">
                    {patient.address_line2}
                  </p>
                )}
                <p className="text-sm text-gray-900">
                  {patient.city}, {patient.state} {patient.postal_code}
                </p>
              </div>
            </div>

            <Field label="Reason for Registration" value={patient.reason} />
            <Field
              label="Additional Notes"
              value={patient.additional_notes || null}
            />
            <Field
              label="Patient History"
              value={patient.patient_history || null}
            />

            {patient.key_value_pairs &&
              Object.keys(patient.key_value_pairs).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Additional Information
                  </h3>
                  <div className="rounded-md border bg-gray-50 p-3 space-y-4">
                    {/* @ts-ignore */}
                    {patient.key_value_pairs.map((p) => {

                      const name = p.name
                      const data = p.data
                      return (
                        <div key={name} className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            {name}
                          </p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                            {data}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
