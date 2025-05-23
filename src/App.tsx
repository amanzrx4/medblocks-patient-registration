import { PGliteProvider } from '@electric-sql/pglite-react'
import {
  live,
  type LiveNamespace
} from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { useEffect, useRef, useState } from 'react'
import { Route } from 'wouter'
import Navbar from './components/Navbar'
import TestComp from './components/TestComp'
import HomePage from './pages/Home'
import PatientRecords from './pages/PatientRecords'
import RegistrationPage from './pages/Registration'


export type PGliteWorkerWithLive = PGliteWorker & {
  live: LiveNamespace
}

// we need routes
// - home Route
// patient list route with add patient button
// patient form route
// patient query route

export const db_name = 'test1'

function App() {
  const [db, setDb] = useState<PGliteWorkerWithLive>()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    // clear the db first
    indexedDB.deleteDatabase(db_name)
    console.log('db deleted')

    const db = new PGliteWorker(
      new Worker(new URL('./my-pglite-worker.js', import.meta.url), {
        type: 'module'
      }),

      {
        dataDir: 'idb://test1',
        extensions: {
          live
        }
      }
      // ducktaping since this type is not official exported
    ) as PGliteWorkerWithLive

    console.log('db here', db)
    // db.

    setDb(db)

    // PGlite.create({
    //   extensions: { live },
    //   dataDir: `idb://${db_name}`
    // })
    //   .then((db) => {
    //     setDb(db)
    //     // db.exec(`CREATE TABLE users (name TEXT);`)
    //     console.log('db setted up')
    //   })
    //   .catch((e) => {
    //     console.log('e', e)
    //   })
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
