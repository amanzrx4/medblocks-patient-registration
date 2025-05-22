import { PGlite } from '@electric-sql/pglite'
import { PGliteProvider } from '@electric-sql/pglite-react'
import { live, type PGliteWithLive } from '@electric-sql/pglite/live'
import { useEffect, useState } from 'react'
import { Route } from 'wouter'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import PatientRecords from './pages/PatientRecords'
import RegistrationPage from './pages/Registration'
import { createTableSchema } from './schema/postgres'
// we need routes
// - home Route
// patient list route with add patient button
// patient form route
// patient query route

function App() {
  const [db, setDb] = useState<PGliteWithLive>()

  useEffect(() => {
    PGlite.create({
      extensions: { live },
      dataDir: 'idb://test-4'
    }).then((db) => {
      setDb(db)
      db.exec(createTableSchema.text)
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
      </PGliteProvider>
    </>
  )
}

export default App
