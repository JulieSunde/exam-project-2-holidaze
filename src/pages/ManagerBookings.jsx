import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getManagerBookings } from '../api/bookings'
import { getBookingStatus } from '../utils/bookingUtils'
import VenueBookings from '../components/manager/VenueBookings'

function ManagerBookings() {
  const { user, accessToken, isLoggedIn } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getManagerBookings(user.name, accessToken)
        setBookings(data)
      } catch (error) {
        setError(error.message || 'Could not load your bookings.')
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn && user?.venueManager && user?.name && accessToken) {
      loadBookings()
    }
  }, [user, accessToken, isLoggedIn])

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (!user?.venueManager) {
    return <Navigate to="/" replace />
  }

  const ongoingBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === 'Ongoing'
  )

  const upcomingBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === 'Upcoming'
  )

  const completedBookings = bookings.filter(
    (booking) => getBookingStatus(booking) === 'Completed'
  )

  return (
    <main className="container py-5">
      <div className="mb-4">
        <p className="text-uppercase small fw-semibold mb-2">HOSTING</p>
        <h1 className="display-6">Booking overview</h1>
        <p className="text-secondary">
          Manage and keep track of bookings made at your venues.
        </p>
      </div>

      <div className="d-flex gap-2 mb-4">
        <Link to="/hosting" className="btn btn-outline-secondary">
          My Venues
        </Link>

        <Link to="/manager/bookings" className="btn btn-holidaze">
          Booking Overview
        </Link>
      </div>

      {loading && <p>Loading bookings...</p>}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="row g-3 mb-5">
            <div className="col-12 col-sm-4">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body">
                  <p className="text-secondary mb-1">Ongoing</p>
                  <p className="display-6 fw-semibold mb-0">
                    {ongoingBookings.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-4">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body">
                  <p className="text-secondary mb-1">Upcoming</p>
                  <p className="display-6 fw-semibold mb-0">
                    {upcomingBookings.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-4">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body">
                  <p className="text-secondary mb-1">Completed</p>
                  <p className="display-6 fw-semibold mb-0">
                    {completedBookings.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="h4 mb-1">All bookings</h2>
            <p className="text-secondary mb-0">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}{' '}
              across your venues
            </p>
          </div>

          {ongoingBookings.length > 0 && (
            <section className="mb-5">
              <h2 className="h3 mb-3">Ongoing</h2>
              <VenueBookings bookings={ongoingBookings} />
            </section>
          )}

          {upcomingBookings.length > 0 && (
            <section className="mb-5">
              <h2 className="h3 mb-3">Upcoming</h2>
              <VenueBookings bookings={upcomingBookings} />
            </section>
          )}

          {completedBookings.length > 0 && (
            <section className="mb-5">
              <h2 className="h3 mb-3">Completed</h2>
              <VenueBookings bookings={completedBookings} />
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default ManagerBookings
