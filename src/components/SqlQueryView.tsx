import type { QueryStatus, PatientTable } from '@/utils'
import { usePGlite } from '@electric-sql/pglite-react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@radix-ui/react-select'
import { Search, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'
import { z } from 'zod'
import { Label } from '@/components/ui/label'

const querySchema = z.object({
  searchType: z.enum([
    'first_name',
    'last_name',
    'email',
    'phone_number',
    'city',
    'state',
    'postal_code',
    'reason'
  ]),
  searchValue: z.string().min(1, 'Search value is required')
})

export type QueryFormData = z.infer<typeof querySchema>

const searchOptions = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone_number', label: 'Phone Number' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'postal_code', label: 'Postal Code' },
  { value: 'reason', label: 'Reason' }
] as const

export default function SimpleQueryView({
  setRecords
}: {
  records: QueryStatus<PatientTable[]>
  setRecords: React.Dispatch<React.SetStateAction<QueryStatus<PatientTable[]>>>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const db = usePGlite()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      searchType: 'first_name'
    }
  })

  const onSubmit = async (data: QueryFormData) => {
    setIsLoading(true)
    setRecords({ type: 'loading' })
    try {
      // case-insensitive search
      const query = `
        SELECT * FROM patients 
        WHERE ${data.searchType}::text ILIKE $1 
        ORDER BY registration_datetime DESC
      `
      const results = (await db.query(query, [`%${data.searchValue}%`]))
        .rows as PatientTable[]
      setRecords({ type: 'success', data: results })
    } catch (error) {
      setRecords({ type: 'error', error: error as Error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Simple Search
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0 space-y-4"
        >
          <div className="space-y-2 flex-none">
            <Label htmlFor="searchType">Search By</Label>
            <Select {...register('searchType')} defaultValue="first_name">
              <SelectTrigger>
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent>
                {searchOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-none">
            <Label htmlFor="searchValue">Search Value</Label>
            <Input
              id="searchValue"
              {...register('searchValue')}
              placeholder="Enter search value..."
              disabled={isLoading}
            />
            {errors.searchValue && (
              <p className="text-sm text-red-500">
                {errors.searchValue.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
