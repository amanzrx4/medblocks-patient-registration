import type { QueryObj } from '@/pages/PatientRecords'
import type { PatientTable } from '@/utils'
import { createContext, type ReactNode, useContext, useState } from 'react'
import type { UseLiveQueryResult } from '../hooks/useLiveQuery'
import useLiveQuery from '../hooks/useLiveQuery'

type LiveQueryContextValue<T> = {
  queryObj: QueryObj
  setQueryObj: React.Dispatch<React.SetStateAction<QueryObj>>
  queryResult: UseLiveQueryResult<T>
}

export const INITIAL_QUERY: QueryObj = { query: undefined, params: [] }

export const CONTEXT_VAL_INITIAL: LiveQueryContextValue<PatientTable> = {
  setQueryObj: function () {},
  queryObj: INITIAL_QUERY,
  queryResult: {
    status: 'idle',
    data: undefined,
    error: null
  }
}

const LiveQueryContext =
  createContext<LiveQueryContextValue<PatientTable>>(CONTEXT_VAL_INITIAL)

type LiveQueryProviderProps = {
  children: ReactNode
}

export function LiveQueryProvider({ children }: LiveQueryProviderProps) {
  const [queryObj, setQueryObj] = useState<QueryObj>(INITIAL_QUERY)

  const queryResult = useLiveQuery<PatientTable>({
    query: queryObj.query,
    params: queryObj.params
  })

  const contextValue: LiveQueryContextValue<PatientTable> = {
    queryObj,
    setQueryObj,
    queryResult
  }

  return (
    <LiveQueryContext.Provider value={contextValue}>
      {children}
    </LiveQueryContext.Provider>
  )
}

export function useLiveQueryContext() {
  const context = useContext(LiveQueryContext)
  if (!context) {
    throw new Error(
      'useLiveQueryContext must be used within a LiveQueryProvider'
    )
  }
  return context
}

export function useLiveQueryProvider() {
  const context = useLiveQueryContext()
  return context
}
