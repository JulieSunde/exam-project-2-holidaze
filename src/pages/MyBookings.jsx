import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, API_KEY } from '../api/config'
import { getMyBookings, cancelBooking, updateBooking } from '../api/bookings'
import {
  getTodayKey,
  getBookingStatus,
  getDaysUntil,
  groupBookings,
} from '../utils/bookingUtils'
import BookingSection from '../components/bookings/BookingSection'
import BookingSummary from '../components/bookings/BookingSummary'

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
    if (getBookingStatus(booking) !== 'Upcoming') {
      setUpdateError('Only upcoming bookings can be changed.')
      return
    }

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

    const currentBooking = bookings.find((booking) => booking.id === bookingId)

    if (!currentBooking || getBookingStatus(currentBooking) !== 'Upcoming') {
      setUpdateError('Only upcoming bookings can be changed.')
      handleCancelEdit()
      return
    }

    if (!dateFrom || !dateTo || dateTo <= dateFrom) {
      setUpdateError('Please select valid check-in and check-out dates.')
      return
    }

    if (dateFrom < getTodayKey()) {
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
      setDateFrom('')
      setDateTo('')
      setSuccess('Your booking dates have been updated.')
    } catch (err) {
      setUpdateError(err.message || 'Could not update booking.')
    } finally {
      setSavingId(null)
    }
  }

  async function handleCancelBooking(bookingId) {
    const booking = bookings.find((item) => item.id === bookingId)

    if (!booking || getBookingStatus(booking) !== 'Upcoming') {
      setCancelError('Only upcoming bookings can be cancelled.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setCancellingId(bookingId)
      setCancelError('')

      await cancelBooking(bookingId, accessToken)

      setBookings((currentBookings) =>
        currentBookings.filter((item) => item.id !== bookingId)
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

  const {
    upcoming: upcomingBookings,
    ongoing: ongoingBookings,
    completed: completedBookings,
  } = groupBookings(bookings)

  const nextBooking = upcomingBookings[0]

  const daysUntilNextBooking = nextBooking
    ? getDaysUntil(nextBooking.dateFrom)
    : null

  const sharedCardProps = {
    editingBookingId,
    dateFrom,
    dateTo,
    venueBookings,
    loadingCalendar,
    savingId,
    cancellingId,
    onEdit: handleEditBooking,
    onCancelEdit: handleCancelEdit,
    onDateSelect: handleDateSelect,
    onSave: handleSaveChanges,
    onCancel: handleCancelBooking,
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
        <>
          <BookingSummary
            upcomingCount={upcomingBookings.length}
            ongoingCount={ongoingBookings.length}
            completedCount={completedBookings.length}
            nextBooking={nextBooking}
            daysUntilNextBooking={daysUntilNextBooking}
          />

          <BookingSection
            title="Upcoming stays"
            bookings={upcomingBookings}
            {...sharedCardProps}
          />

          <BookingSection
            title="Ongoing stays"
            bookings={ongoingBookings}
            {...sharedCardProps}
          />

          <BookingSection
            title="Completed stays"
            bookings={completedBookings}
            {...sharedCardProps}
          />
        </>
      )}
    </main>
  )
}

export default MyBookings
