import { Route } from 'wouter'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import PatientRecords from './pages/PatientRecords'
import RegistrationPage from './pages/Registration'
import { PGlite } from '@electric-sql/pglite'
import { PGliteProvider } from '@electric-sql/pglite-react'
import { live } from '@electric-sql/pglite/live'
import './App.css'


// we need routes
// - home Route
// patient list route with add patient button
// patient form route
// patient query route

const db = await PGlite.create({
  extensions: { live },
  dataDir: 'idb://test-1'
})

function App() {
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
