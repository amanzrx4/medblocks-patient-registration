import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useLiveQueryProvider } from '@/hooks/LiveQueryProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

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

export default function SimpleQueryView() {
  const { queryResult, setQueryObj } = useLiveQueryProvider()

  const queryStatus = queryResult.status

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
    // case-insensitive search
    const query = `
        SELECT * FROM patients 
        WHERE ${data.searchType}::text ILIKE $1 
        ORDER BY registration_datetime DESC
      `

    const params = [`%${data.searchValue}%`]

    setQueryObj({ query, params })
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
              disabled={queryStatus === 'loading'}
            />
            {errors.searchValue && (
              <p className="text-sm text-red-500">
                {errors.searchValue.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={queryStatus === 'loading'}
            className="w-full flex-none"
          >
            {queryStatus === 'loading' ? (
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
