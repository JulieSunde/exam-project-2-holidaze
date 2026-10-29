
import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import VenueDetails from './pages/VenueDetails'

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top border-bottom">
        <div className="container py-2">
          <Link className="navbar-brand" to="/">
            Holidaze
          </Link>

          <div className="navbar-nav ms-auto flex-row align-items-center gap-3">
            <Link className="nav-link" to="/#stays">
              Explore stays
            </Link>

            <Link className="nav-link" to="/#about">
              About us
            </Link>

            <Link className="nav-link" to="/#footer">
              Contact
            </Link>

            <Link className="btn btn-holidaze ms-lg-2" to="/#stays">
              Find a stay
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Home showAllVenues />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route
          path="*"
          element={
            <main className="container py-5">
              <h1>Page not found</h1>
              <Link to="/">Back to home</Link>
            </main>
          }
        />
      </Routes>

      <footer id="footer" className="py-4">
        <div className="container">
          <p className="mb-0">
            <strong>Holidaze</strong> — find your next favourite place.
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
