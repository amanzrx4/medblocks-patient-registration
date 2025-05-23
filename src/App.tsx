import { PGliteProvider } from '@electric-sql/pglite-react'
import { live, type LiveNamespace } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { useEffect, useRef, useState } from 'react'
import { Route } from 'wouter'
import Navbar from './components/Navbar'
import TestComp from './components/TestComp'
import { queries } from './db/queries'
import HomePage from './pages/Home'
import PatientRecords from './pages/PatientRecords'
import RegistrationPage from './pages/Registration'
import { DB_NAME } from './utils'

export type PGliteWorkerWithLive = PGliteWorker & {
  live: LiveNamespace
}

// we need routes
// - home Route
// patient list route with add patient button
// patient form route
// patient query route

function App() {
  const [db, setDb] = useState<PGliteWorkerWithLive>()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    // clear the db first
    indexedDB.deleteDatabase(`${DB_NAME}`)
    console.log('db deleted')

    const db = new PGliteWorker(
      new Worker(new URL('./my-pglite-worker.js', import.meta.url), {
        type: 'module'
      }),

      {
        dataDir: `idb://${DB_NAME}`,
        extensions: {
          live
        }
      }
      // ducktaping since this type is not official exported
    ) as PGliteWorkerWithLive

    db.exec(queries.prod.createTable).then(async () => {
      setDb(db)
      console.log('Db setup success')
    })
  }, [])

  if (!db) {
    return <h1>Initializing db</h1>
  }

  return (
    <>
      <PGliteProvider db={db}>
        <Navbar />
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/patient-registration">
          <RegistrationPage />
        </Route>
        <Route path="/patient-records/:queryType?">
          <PatientRecords />
        </Route>

        <Route path="/test">
          <TestComp />
        </Route>
      </PGliteProvider>
    </>
  )
}

export default App
