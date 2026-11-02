
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import VenueDetails from './pages/VenueDetails'
import Register from './pages/Register'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

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

            <Link className="nav-link" to="/#contact">
              Contact
            </Link>

            {!isLoggedIn ? (
              <>
             <Link className="btn btn-holidaze ms-lg-2" to="/login">
              Log in
            </Link>

            <Link className="nav-link" to="/register">
              Sign up
            </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className="rounded-circle"
                    style={{
                      width: '9px',
                      height: '9px',
                      backgroundColor: '#269B65',
                      display: 'inline-block',
                    }}
                  />
                  {user?.name || 'My profile'}
                </button>

                <ul className="dropdown-menu dropdown-menu-end mt-2">
                  <li>
                    <h6 className="dropdown-header">
                      {user?.name || 'My account'}
                    </h6>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/bookings">
                      My bookings
                    </Link>
                  </li>

                  {user?.venueManager && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <h6 className="dropdown-header">Hosting</h6>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/manager/venues">
                          My venues
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/manager/venues/new">
                          Add a venue
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/manager/dashboard">
                          Booking overview
                        </Link>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
