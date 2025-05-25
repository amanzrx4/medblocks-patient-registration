import type { QueryObj } from '@/pages/PatientRecords'
import { createContext, type ReactNode, useContext, useState } from 'react'
import type { UseLiveQueryResult } from '../hooks/useLiveQuery'
import useLiveQuery from '../hooks/useLiveQuery'

type LiveQueryContextValue<T> = {
  queryObj: QueryObj
  setQueryObj: React.Dispatch<React.SetStateAction<QueryObj>>
  queryResult: UseLiveQueryResult<T>
}

export const INITIAL_QUERY: QueryObj = { query: undefined, params: [] }

function createInitialContextValue<T>(): LiveQueryContextValue<T> {
  return {
    setQueryObj: function () {},
    queryObj: INITIAL_QUERY,
    queryResult: {
      status: 'idle',
      data: undefined,
      error: null
    } as UseLiveQueryResult<T>
  }
}

const LiveQueryContext = createContext<LiveQueryContextValue<unknown>>(createInitialContextValue())

type LiveQueryProviderProps = {
  children: ReactNode
}

export function LiveQueryProvider<T = unknown>({ children }: LiveQueryProviderProps) {
  const [queryObj, setQueryObj] = useState<QueryObj>(INITIAL_QUERY)

  const queryResult = useLiveQuery<T>({
    query: queryObj.query,
    params: queryObj.params
  })

  const contextValue: LiveQueryContextValue<T> = {
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

export function useLiveQueryContext<T = unknown>() {
  const context = useContext<LiveQueryContextValue<T>>(LiveQueryContext as React.Context<LiveQueryContextValue<T>>)
  if (!context) {
    throw new Error(
      'useLiveQueryContext must be used within a LiveQueryProvider'
    )
  }
  return context
}

export function useLiveQueryProvider<T = unknown>() {
  const context = useLiveQueryContext<T>()
  return context
}
