import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'

const keyValueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  data: z.string().min(1, 'Data is required')
})

const formSchema = z.object({
  registrationDateTime: z.string().min(1, 'Registration date is required'),
  keyValuePairs: z.array(keyValueSchema).optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  sex: z.enum(['male', 'female', 'other'], {
    required_error: 'Sex is required',
    invalid_type_error: 'Please select a valid sex'
  }),
  dob: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
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
  additionalNotes: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'keyValuePairs'
  })

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data)
  }

  const addKeyValuePair = () => {
    append({ name: '', data: '' })
  }

  console.log('errors', errors)
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Patient Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Registration Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="registrationDateTime"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Registration Date & Time
              </label>
              <div className="">
                <div className="flex gap-2 items-center">
                  <input
                    type="datetime-local"
                    id="registrationDateTime"
                    {...register('registrationDateTime')}
                    className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.registrationDateTime ? 'border-red-500' : ''
                    }`}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      // const now = new Date()
                      // const formattedDateTime = now.toISOString().slice(0, 16)

                      // store the unix timestamp
                      const now = new Date()
                      const unixTimestamp = Math.floor(now.getTime() / 1000)
                      const formattedDateTime = new Date(unixTimestamp * 1000)
                        .toISOString()
                        .slice(0, 16)

                      setValue('registrationDateTime', formattedDateTime)
                    }}
                    className=" text-medblocks-blue hover:text-medblocks-blue"
                  >
                    Now
                  </Button>
                </div>
                {errors.registrationDateTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.registrationDateTime.message}
                  </p>
                )}
              </div>
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
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
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
              {errors.sex && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.sex.message}
                </p>
              )}
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
              {errors.dob && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number (with country code)
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
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
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
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
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
                {errors.addressLine1 && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.addressLine1.message}
                  </p>
                )}
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
                {errors.addressLine2 && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.addressLine2.message}
                  </p>
                )}
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
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
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
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.state.message}
                    </p>
                  )}
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
                  {errors.postalCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
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
            {errors.reason && (
              <p className="text-sm text-red-500 mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="flex flex-col">
            <label
              htmlFor="additionalNotes"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              {...register('additionalNotes')}
              className={`p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] ${
                errors.additionalNotes ? 'border-red-500' : ''
              }`}
              placeholder="Any additional notes or information"
            />
            {errors.additionalNotes && (
              <p className="text-sm text-red-500 mt-1">
                {errors.additionalNotes.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                Additional Information
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
                  <textarea
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
      <DevTool control={control} /> {/* set up the dev tool */}
    </>
  )
}
