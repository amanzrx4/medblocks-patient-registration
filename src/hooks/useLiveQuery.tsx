import { usePGlite } from '@electric-sql/pglite-react'
import type { LiveQuery, LiveQueryResults } from '@electric-sql/pglite/live'
import { useEffect, useRef, useState } from 'react'

function paramsEqual(
  a1: unknown[] | undefined | null,
  a2: unknown[] | undefined | null
) {
  if (!a1 && !a2) return true
  if (a1?.length !== a2?.length) return false
  for (let i = 0; i < a1!.length; i++) {
    if (!Object.is(a1![i], a2![i])) {
      return false
    }
  }
  return true
}

export type LiveQueryStatus =
  | 'idle'
  | 'loading'
  | 'fetching'
  | 'success'
  | 'error'

export type UseLiveQueryResult<T> = {
  status: LiveQueryStatus
  data: LiveQueryResults<T> | undefined
  error: Error | null
  // refetch: () => void
}

type UseLiveQueryProps<T> = {
  query: string | LiveQuery<T> | Promise<LiveQuery<T>> | undefined
  params: unknown[] | undefined | null
  key?: string
}

/**
 *
 * This is a copy of `useLiveQuery` official implementation. I've modified it to handle errors instead of throwing exception https://github.com/electric-sql/pglite/blob/main/packages/pglite-react/src/hooks.ts#L20
 */
export default function useLiveQuery<
  T = {
    [key: string]: unknown
  }
>({ params, query, key }: UseLiveQueryProps<T>): UseLiveQueryResult<T> {
  const db = usePGlite()
  const paramsRef = useRef(params)
  const liveQueryRef = useRef<LiveQuery<T> | undefined>(undefined)
  const [status, setStatus] = useState<LiveQueryStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [results, setResults] = useState<LiveQueryResults<T> | undefined>(
    undefined
  )

  // const refetch = useCallback(() => {
  //   setQueryKey((prev) => prev + 1)
  // }, [])

  let liveQuery: LiveQuery<T> | undefined
  let liveQueryChanged = false
  if (!(typeof query === 'string') && !(query instanceof Promise)) {
    liveQuery = query
    liveQueryChanged = liveQueryRef.current !== liveQuery
    liveQueryRef.current = liveQuery
  }

  let currentParams = paramsRef.current
  if (!paramsEqual(paramsRef.current, params)) {
    paramsRef.current = params
    currentParams = params
  }

  useEffect(() => {
    if (query === undefined) {
      return
    }

    if (typeof query === 'string' && query.trim() === '') {
      setStatus('idle')
      setError(null)
      return
    }

    let cancelled = false
    setStatus('loading')
    setError(null)

    const cb = (results: LiveQueryResults<T>) => {
      if (cancelled) return
      setResults(results)
      setStatus('success')
    }

    const errorHandler = (err: Error) => {
      if (cancelled) return
      setError(err)
      setStatus('error')
    }

    try {
      if (typeof query === 'string') {
        const ret =
          key !== undefined
            ? db.live.incrementalQuery<T>(query, currentParams, key, cb)
            : db.live.query<T>(query, currentParams, cb)

        ret.catch(errorHandler)

        return () => {
          cancelled = true
          ret.then(({ unsubscribe }) => unsubscribe())
        }
      } else if (query instanceof Promise) {
        query
          .then((liveQuery) => {
            if (cancelled) return
            liveQueryRef.current = liveQuery
            setResults(liveQuery.initialResults)
            setStatus('success')
            liveQuery.subscribe(cb)
          })
          .catch(errorHandler)

        return () => {
          cancelled = true
          liveQueryRef.current?.unsubscribe(cb)
        }
      } else if (liveQuery) {
        setResults(liveQuery.initialResults)
        setStatus('success')
        liveQuery.subscribe(cb)
        return () => {
          cancelled = true
          liveQuery.unsubscribe(cb)
        }
      } else {
        throw new Error('Invalid query type')
      }
    } catch (err) {
      errorHandler(err instanceof Error ? err : new Error(String(err)))
    }
  }, [db, key, query, currentParams, liveQuery])

  if (liveQueryChanged && liveQuery) {
    return {
      status: 'success',
      data: liveQuery.initialResults,
      error: null
    }
  }

  return {
    status,
    data: results && {
      rows: results.rows,
      fields: results.fields,
      totalCount: results.totalCount,
      offset: results.offset,
      limit: results.limit
    },
    error
  }
}
