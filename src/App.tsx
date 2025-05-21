import { Route } from 'wouter'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import RegistrationPage from './pages/Registration'
import PatientRecords from './pages/PatientRecords'

// we need routes
// - home Route
// patient list route with add patient button
// patient form route
// patient query route

function App() {
  return (
    <>
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
    </>
  )
}

export default App
