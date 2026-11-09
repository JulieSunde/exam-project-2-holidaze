import { useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import VenueDetails from './pages/VenueDetails'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import Hosting from './pages/Hosting'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top border-bottom">
        <div className="container py-2">
          <Link
            className="navbar-brand"
            to="/"
            onClick={closeMenu}
          >
            Holidaze
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="mainNavbar"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            id="mainNavbar"
            className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

              <Link
                className="nav-link"
                to="/#stays"
                onClick={closeMenu}
              >
                Explore stays
              </Link>

              <Link
                className="nav-link"
                to="/#about"
                onClick={closeMenu}
              >
                About us
              </Link>

              <Link
                className="nav-link"
                to="/#contact"
                onClick={closeMenu}
              >
                Contact
              </Link>

              {!isLoggedIn ? (
                <>
                  <Link
                    className="btn btn-holidaze ms-lg-2 mt-2 mt-lg-0"
                    to="/login"
                    onClick={closeMenu}
                  >
                    Log in
                  </Link>

                  <Link
                    className="nav-link"
                    to="/register"
                    onClick={closeMenu}
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <div className="dropdown mt-2 mt-lg-0 d-none d-lg-block">
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
                        <Link
                          className="dropdown-item"
                          to="/profile"
                        >
                          Profile
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/my-bookings"
                        >
                          My bookings
                        </Link>
                      </li>

                      {user?.venueManager && (
                        <>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>

                          <li>
                            <h6 className="dropdown-header">
                              Hosting
                            </h6>
                          </li>

                          <li>
                            <Link
                              className="dropdown-item"
                              to="/hosting"
                            >
                              My venues
                            </Link>
                          </li>

                          <li>
                            <Link
                              className="dropdown-item"
                              to="/hosting"
                            >
                              Add a venue
                            </Link>
                          </li>

                          <li>
                            <Link
                              className="dropdown-item"
                              to="/manager/bookings"
                            >
                              Booking overview
                            </Link>
                          </li>
                        </>
                      )}

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

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
                  <div className="d-lg-none w-100 mt-3">
                    <div className="border-top pt-3">
                      <div className="d-flex align-items-center gap-2 mb-2 px-2">
                        <span
                          className="rounded-circle"
                          style={{
                            width: '9px',
                            height: '9px',
                            backgroundColor: '#269B65',
                            display: 'inline-block',
                          }}
                        />

                        <strong>
                          {user?.name || 'My account'}
                        </strong>
                      </div>

                      <Link
                        className="nav-link px-2"
                        to="/profile"
                        onClick={closeMenu}
                      >
                        Profile
                      </Link>

                      <Link
                        className="nav-link px-2"
                        to="/my-bookings"
                        onClick={closeMenu}
                      >
                        My bookings
                      </Link>

                      {user?.venueManager && (
                        <>
                          <div className="text-muted small fw-semibold px-2 mt-3 mb-1">
                            HOSTING
                          </div>

                          <Link
                            className="nav-link px-2"
                            to="/hosting"
                            onClick={closeMenu}
                          >
                            My venues
                          </Link>

                          <Link
                            className="nav-link px-2"
                            to="/hosting"
                            onClick={closeMenu}
                          >
                            Add a venue
                          </Link>

                          <Link
                            className="nav-link px-2"
                            to="/manager/bookings"
                            onClick={closeMenu}
                          >
                            Booking overview
                          </Link>
                        </>
                      )}

                      <button
                        className="nav-link px-2 mt-2"
                        type="button"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/venues" element={<Home showAllVenues />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/hosting" element={<Hosting />} />
        <Route
          path="/manager/bookings"
          element={
            <main className="container py-5">
              <h1>Booking overview</h1>
              <p>
                Your venue bookings will be displayed here.
              </p>
            </main>
          }
        />

        <Route
          path="*"
          element={
            <main className="container py-5">
              <h1>Page not found</h1>
              <Link to="/">
                Back to home
              </Link>
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
