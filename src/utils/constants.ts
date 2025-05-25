export const REPOSITORY_GITHUB_URL =
  'https://github.com/amanzrx4/medblocks-patient-registration'

export const DB_NAME = 'patients'

export const patientTableKeys = [
  'id',
  'registration_datetime',
  'key_value_pairs',
  'first_name',
  'last_name',
  'sex',
  'dob',
  'phone_number',
  'email',
  'address_line1',
  'address_line2',
  'city',
  'state',
  'postal_code',
  'reason',
  'additional_notes',
  'patient_history',
  'photo',
  'created_at'
] as const
