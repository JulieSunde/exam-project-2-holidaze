import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, API_KEY } from '../api/config'
import { getMyBookings, cancelBooking, updateBooking } from '../api/bookings'
import AvailabilityCalendar from '../components/AvailabilityCalendar'

function MyBookings() {
  const { user, accessToken, isLoggedIn } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelError, setCancelError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [editingBookingId, setEditingBookingId] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [venueBookings, setVenueBookings] = useState([])
  const [loadingCalendar, setLoadingCalendar] = useState(false)

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true)
        setError('')

        const data = await getMyBookings(user.name, accessToken)
        setBookings(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn && user?.name && accessToken) {
      loadBookings()
    }
  }, [isLoggedIn, user?.name, accessToken])

  async function handleEditBooking(booking) {
    if (!booking.venue?.id) {
      setUpdateError('Could not find this venue.')
      return
    }

    try {
      setLoadingCalendar(true)
      setUpdateError('')
      setSuccess('')

      const response = await fetch(
        `${API_BASE_URL}/holidaze/venues/${booking.venue.id}?_bookings=true`,
        {
          headers: {
            'X-Noroff-API-Key': API_KEY,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message || 'Could not load venue availability.'
        )
      }

      setVenueBookings(result.data.bookings || [])
      setDateFrom(booking.dateFrom.slice(0, 10))
      setDateTo(booking.dateTo.slice(0, 10))
      setEditingBookingId(booking.id)
    } catch (err) {
      setUpdateError(err.message)
    } finally {
      setLoadingCalendar(false)
    }
  }

  function handleDateSelect(newCheckIn, newCheckOut) {
    setDateFrom(newCheckIn)
    setDateTo(newCheckOut)
    setUpdateError('')
  }

  function handleCancelEdit() {
    setEditingBookingId(null)
    setDateFrom('')
    setDateTo('')
    setVenueBookings([])
    setUpdateError('')
  }

  async function handleSaveChanges(bookingId) {
    setUpdateError('')
    setSuccess('')

    if (!dateFrom || !dateTo || dateTo <= dateFrom) {
      setUpdateError('Please select valid check-in and check-out dates.')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedCheckIn = new Date(`${dateFrom}T00:00:00`)

    if (selectedCheckIn < today) {
      setUpdateError('Check-in cannot be in the past.')
      return
    }

    const hasConflict = venueBookings.some((booking) => {
      if (booking.id === bookingId) return false

      const start = booking.dateFrom.slice(0, 10)
      const end = booking.dateTo.slice(0, 10)

      return dateFrom < end && dateTo > start
    })

    if (hasConflict) {
      setUpdateError(
        'These dates are already booked. Please choose different dates.'
      )
      return
    }

    try {
      setSavingId(bookingId)

      const updatedData = {
        dateFrom: new Date(`${dateFrom}T00:00:00.000Z`).toISOString(),
        dateTo: new Date(`${dateTo}T00:00:00.000Z`).toISOString(),
      }

      await updateBooking(bookingId, updatedData, accessToken)

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                ...updatedData,
              }
            : booking
        )
      )

      setEditingBookingId(null)
      setVenueBookings([])
      setSuccess('Your booking dates have been updated.')
    } catch (err) {
      setUpdateError(err.message || 'Could not update booking.')
    } finally {
      setSavingId(null)
    }
  }

  async function handleCancelBooking(bookingId) {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setCancellingId(bookingId)
      setCancelError('')

      await cancelBooking(bookingId, accessToken)

      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking.id !== bookingId)
      )
    } catch (err) {
      setCancelError(err.message || 'Could not cancel booking.')
    } finally {
      setCancellingId(null)
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return <p className="text-center py-5">Loading your bookings...</p>
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">My bookings</h1>

      {cancelError && (
        <div className="alert alert-danger" role="alert">
          {cancelError}
        </div>
      )}

      {updateError && (
        <div className="alert alert-danger" role="alert">
          {updateError}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <h2>No bookings yet</h2>
          <p>You haven't booked any stays yet.</p>
          <Link to="/venues" className="btn btn-holidaze">
            Explore stays
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div className="col-md-6 col-lg-4" key={booking.id}>
              <div className="card h-100">
                {booking.venue?.media?.[0]?.url && (
                  <img
                    src={booking.venue.media[0].url}
                    className="card-img-top"
                    alt={booking.venue.media[0].alt || booking.venue.name}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                )}

                <div className="card-body">
                  <h2 className="h5">{booking.venue?.name || 'Venue'}</h2>

                  {editingBookingId === booking.id ? (
                    <div>
                      <p className="small text-secondary">
                        Select your new check-in and check-out dates.
                      </p>

                      <AvailabilityCalendar
                        bookings={venueBookings}
                        checkIn={dateFrom}
                        checkOut={dateTo}
                        onDateSelect={handleDateSelect}
                        excludeBookingId={booking.id}
                      />

                      <div className="d-flex justify-content-between gap-2 mt-3">
                        <div>
                          <small className="text-secondary d-block">
                            CHECK-IN
                          </small>
                          <strong>{dateFrom || 'Select date'}</strong>
                        </div>

                        <div>
                          <small className="text-secondary d-block">
                            CHECK-OUT
                          </small>
                          <strong>{dateTo || 'Select date'}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-holidaze me-2 mt-3"
                        onClick={() => handleSaveChanges(booking.id)}
                        disabled={
                          savingId === booking.id ||
                          loadingCalendar ||
                          !dateFrom ||
                          !dateTo
                        }
                      >
                        {savingId === booking.id ? 'Saving...' : 'Save changes'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary mt-3"
                        onClick={handleCancelEdit}
                        disabled={savingId === booking.id}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>
                        <strong>Check-in:</strong>{' '}
                        {new Date(booking.dateFrom).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Check-out:</strong>{' '}
                        {new Date(booking.dateTo).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Guests:</strong> {booking.guests}
                      </p>

                      <div className="d-grid gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-holidaze w-100"
                          onClick={() => handleEditBooking(booking)}
                          disabled={
                            cancellingId === booking.id || loadingCalendar
                          }
                        >
                          Change dates
                        </button>

                        <div className="d-flex gap-2">
                          {booking.venue?.id && (
                            <Link
                              to={`/venues/${booking.venue.id}`}
                              className="btn btn-outline-dark flex-fill"
                            >
                              View venue
                            </Link>
                          )}

                          <button
                            type="button"
                            className="btn btn-outline-danger flex-fill"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                          >
                            {cancellingId === booking.id
                              ? 'Cancelling...'
                              : 'Cancel booking'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default MyBookings
