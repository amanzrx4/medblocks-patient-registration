import { usePGlite } from '@electric-sql/pglite-react'
// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, HelpCircle, X } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import PhotoDialog from './PhotoDialog'
import { Button } from './ui/button'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { useState } from 'react'

import { scrollToTop, uint8ArrayToDataURL } from '@/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'

const keyValueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  data: z.string().min(1, 'Data is required')
})

const formSchema = z.object({
  registrationDateTime: z
    .string()
    .datetime({ offset: true, message: 'Date time is required' }),
  keyValuePairs: z.array(keyValueSchema).optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  sex: z.enum(['male', 'female', 'other'], {
    required_error: 'Sex is required',
    invalid_type_error: 'Please select a valid sex'
  }),
  dob: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15),
  // .regex(
  //   /^\+[1-9]\d{1,14}$/,
  //   'Please enter a valid phone number with country code'
  // ),
  email: z.string().email('Please enter a valid email address'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  reason: z.string().min(1, 'Reason for registration is required'),
  additionalNotes: z.string().optional(),
  patientHistory: z.string().optional(),
  photo: z.custom((e) => e instanceof Uint8Array).optional()
})

export type FormData = z.infer<typeof formSchema>

type AlertState = {
  show: boolean
  type: 'success' | 'error'
  message: string
}

export default function RegistrationForm() {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    message: ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const photo = watch('photo') as Uint8Array

  function renderError(error: (typeof errors)[keyof typeof errors]) {
    return error ? (
      <p className="text-sm text-red-500 mt-1">{error.message}</p>
    ) : null
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'keyValuePairs'
  })

  const db = usePGlite()

  async function onSubmit(data: FormData) {
    try {
      const {
        registrationDateTime,
        keyValuePairs,
        firstName,
        lastName,
        sex,
        dob,
        phoneNumber,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        reason,
        additionalNotes,
        patientHistory,
        photo
      } = data

      const stmt = `
        INSERT INTO patients (
          registration_datetime,
          key_value_pairs,
          first_name,
          last_name,
          sex,
          dob,
          phone_number,
          email,
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          reason,
          additional_notes,
          patient_history,
          photo
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
      `

      const kvPair = keyValuePairs?.reduce(
        (acc, curr) => {
          acc[curr.name] = curr.data
          return acc
        },
        {} as Record<string, string>
      )

      const values = [
        registrationDateTime,
        kvPair && Object.keys(kvPair).length > 0
          ? JSON.stringify(kvPair)
          : null,
        firstName,
        lastName || null,
        sex,
        dob,
        phoneNumber,
        email,
        addressLine1,
        addressLine2 || null,
        city,
        state,
        postalCode,
        reason,
        additionalNotes || null,
        patientHistory || null,
        photo || null
      ]

      await db.query(stmt, values)

      setAlert({
        show: true,
        type: 'success',
        message: 'Patient registered successfully!'
      })

      scrollToTop()

      reset()
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to register patient. Please try again.'
      })
      scrollToTop()
    }
  }

  const addKeyValuePair = () => {
    append({ name: '', data: '' })
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mb-10">
        {alert.show && (
          <Alert
            className={`mb-4 ${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            variant={alert.type === 'success' ? 'default' : 'destructive'}
          >
            <AlertTitle>
              {alert.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Patient Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <label
                htmlFor="photo"
                className="text-sm font-medium text-gray-700"
              >
                Photo (Optional)
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload a patient photo or transcript photo</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-start gap-4">
              <PhotoDialog
                onPhotoCapture={(photo) => setValue('photo', photo)}
                trigger={
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {photo ? 'Change Photo' : 'Add Photo'}
                  </Button>
                }
              />
              {photo && (
                <div className="relative w-24 h-24">
                  <img
                    src={uint8ArrayToDataURL(photo)}
                    alt="Patient"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => setValue('photo', null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Registration Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="registrationDateTime"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Registration Date & Time
              </label>
              <Controller
                control={control}
                name="registrationDateTime"
                defaultValue=""
                render={({ field }) => {
                  // Convert ISO string to local datetime-local input format
                  const displayValue = field.value
                    ? new Date(field.value)
                        .toLocaleString('sv-SE', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })
                        .replace(' ', 'T')
                    : ''

                  return (
                    <div className="">
                      <div className="flex gap-2 items-center">
                        <input
                          type="datetime-local"
                          id="registrationDateTime"
                          value={displayValue}
                          onChange={(e) => {
                            const val = e.target.value

                            const isoTimestamp = new Date(val).toISOString()

                            field.onChange(isoTimestamp)
                          }}
                          className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.registrationDateTime ? 'border-red-500' : ''
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            const now = new Date().toISOString()
                            setValue('registrationDateTime', now)
                          }}
                          className="text-medblocks-blue hover:text-medblocks-blue"
                        >
                          Now
                        </Button>
                      </div>
                      {renderError(errors.registrationDateTime)}
                    </div>
                  )
                }}
              />
            </div>
          </div>

          {/* Patient Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register('firstName')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
              />
              {renderError(errors.firstName)}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Last Name (Optional)
              </label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
              />
              {renderError(errors.lastName)}
            </div>
          </div>

          {/* Sex and DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="sex"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Sex
              </label>
              <select
                id="sex"
                {...register('sex')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sex ? 'border-red-500' : ''
                }`}
              >
                <option value={''}>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {renderError(errors.sex)}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="dob"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                {...register('dob')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dob ? 'border-red-500' : ''
                }`}
              />
              {renderError(errors.dob)}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...register('phoneNumber')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : ''
                }`}
                placeholder="+1 234 567 8900"
              />
              {renderError(errors.phoneNumber)}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {renderError(errors.email)}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Address</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="addressLine1"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  {...register('addressLine1')}
                  className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.addressLine1 ? 'border-red-500' : ''
                  }`}
                />
                {renderError(errors.addressLine1)}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="addressLine2"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  {...register('addressLine2')}
                  className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.addressLine2 ? 'border-red-500' : ''
                  }`}
                />
                {renderError(errors.addressLine2)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    {...register('city')}
                    className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                  />
                  {renderError(errors.city)}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="state"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    {...register('state')}
                    className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.state ? 'border-red-500' : ''
                    }`}
                  />
                  {renderError(errors.state)}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="postalCode"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal/Zip Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    {...register('postalCode')}
                    className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.postalCode ? 'border-red-500' : ''
                    }`}
                  />
                  {renderError(errors.postalCode)}
                </div>
              </div>
            </div>
          </div>

          {/* Reason for Registration */}
          <div className="flex flex-col">
            <label
              htmlFor="reason"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Reason for Registration
            </label>
            <input
              type="text"
              id="reason"
              {...register('reason')}
              className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.reason ? 'border-red-500' : ''
              }`}
            />
            {renderError(errors.reason)}
          </div>

          {/* Additional Notes */}
          <div className="flex flex-col">
            <label
              htmlFor="additionalNotes"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes (Optional)
            </label>
            <textarea
              id="additionalNotes"
              {...register('additionalNotes')}
              className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] ${
                errors.additionalNotes ? 'border-red-500' : ''
              }`}
              placeholder="Any additional notes or information"
            />
            {renderError(errors.additionalNotes)}
          </div>

          {/* Patient history */}
          <div className="flex flex-col">
            <label
              htmlFor="patientHistory"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Patient History (Optional)
            </label>
            <textarea
              id="patientHistory"
              {...register('patientHistory')}
              className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] ${
                errors.patientHistory ? 'border-red-500' : ''
              }`}
              placeholder="eg: suffering from high bp"
            />
            {renderError(errors.patientHistory)}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                Additional Information (Optional)
              </h3>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register(`keyValuePairs.${index}.name` as const)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter Name"
                  />
                  {errors.keyValuePairs?.[index]?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.keyValuePairs[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Data
                  </label>
                  <input
                    {...register(`keyValuePairs.${index}.data` as const)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Enter Data"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50 w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={addKeyValuePair}
              variant="ghost"
              className="text-green-600 border-green-600 hover:bg-blue-50"
            >
              + Add New Field
            </Button>

            <Button
              type="button"
              variant="outline"
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-medblocks-blue hover:bg-medblocks-blue/80 text-white px-6 py-2"
            >
              Register Patient
            </Button>
          </div>
        </form>
      </div>
      {/* <DevTool control={control} /> */}
    </TooltipProvider>
  )
}
