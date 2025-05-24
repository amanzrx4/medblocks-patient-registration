import type { LiveNamespace } from '@electric-sql/pglite/live'
import type { PGliteWorker } from '@electric-sql/pglite/worker'

export type PGliteWorkerWithLive = PGliteWorker & {
  live: LiveNamespace
}

export type PatientTable = {
  id?: number
  registration_datetime: string
  key_value_pairs?: Record<string, any>
  first_name: string
  last_name?: string
  sex: 'male' | 'female' | 'other'
  dob: string
  phone_number: string
  email: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  reason: string
  additional_notes?: string
  patient_history?: string
  photo?: Uint8Array
  created_at?: string
}

export type QueryStatus<T> =
  | {
      type: 'idle'
    }
  | {
      type: 'loading'
    }
  | {
      type: 'error'
      error: Error
    }
  | {
      type: 'success'
      data: T
    }

export type SuccessQueryData<T> = Extract<QueryStatus<T>, { type: 'success' }>['data']
