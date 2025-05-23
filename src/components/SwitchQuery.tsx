import { useLiveQueryContext } from '@/providers/LiveQueryProvider'
import { useLocation } from 'wouter'
import { Label } from './ui/label'
import { Switch } from './ui/switch'

interface SwitchQueryProps {
  isSqlMode: boolean
}

export default function SwitchQuery({ isSqlMode }: SwitchQueryProps) {
  const [, setLocation] = useLocation()
  const { setQueryObj } = useLiveQueryContext()

  function handleQueryTypeChange(isSqlMode: boolean) {
    setLocation(`/patient-records/${isSqlMode ? 'sql' : 'simple'}`)

    // this will reset the query on switch
    setQueryObj({ params: [], query: '' })
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sql-mode">SQL Mode</Label>
      <Switch
        id="sql-mode"
        checked={isSqlMode}
        onCheckedChange={handleQueryTypeChange}
      />
    </div>
  )
}
