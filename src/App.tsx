import { dbSetUp, type PGliteWorkerWithLive } from '@/utils'
import { PGliteProvider } from '@electric-sql/pglite-react'
import { useEffect, useRef, useState } from 'react'
import { Route } from 'wouter'
import Navbar from './components/Navbar'
import TestComp from './components/TestComp'
import HomePage from './pages/Home'
import PatientRecords from './pages/PatientRecords'
import RegistrationPage from './pages/Registration'

// we need routes
// - home Route
// patient list route with add patient button
// patient form route
// patient query route

function App() {
  const [db, setDb] = useState<PGliteWorkerWithLive | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initializeDb = async () => {
      try {
        const dbInstance = await dbSetUp()
        setDb(dbInstance)
        console.log('Db setup success')
      } catch (error) {
        console.error('Failed to initialize database:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeDb()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        {isLoading ? (
          <div className="flex items-center justify-center h-64 flex-col gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <h1 className="text-xl font-semibold mt-2">
              Loading...(Initializing Database)
            </h1>
          </div>
        ) : db ? (
          <PGliteProvider db={db}>
            <Route path="/" component={HomePage} />
            <Route path="/patient-registration" component={RegistrationPage} />
            <Route
              path="/patient-records/:queryType?"
              component={PatientRecords}
            />
            <Route path="/test" component={TestComp} />
          </PGliteProvider>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              Database Initialization Failed
            </h2>
            <p className="text-muted-foreground">
              Unable to connect to the database. Please refresh the page to try
              again.
            </p>
          </div>
        )}
      </main>
    </>
  )
}

export default App
