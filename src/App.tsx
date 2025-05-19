import { Route } from 'wouter'
import Navbar from './components/Navbar'
import Home from './pages/Home'

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
        <Home />
      </Route>
    </>
  )
}

export default App
