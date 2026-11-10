import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getManagerBookings } from '../api/bookings'
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

  return (
    <main className="container py-5">
      <div className="mb-4">
        <p className="text-uppercase small fw-semibold mb-2">HOSTING</p>

        <h1 className="display-6">Booking overview</h1>

        <p className="text-secondary">
          Manage and keep track of bookings made at your venues.
        </p>
      </div>

      {loading && <p>Loading bookings...</p>}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-4">
            <h2 className="h5">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
            </h2>
          </div>

          <VenueBookings bookings={bookings} />
        </>
      )}
    </main>
  )
}

export default ManagerBookings
