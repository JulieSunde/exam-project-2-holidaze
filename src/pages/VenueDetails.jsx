import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, API_KEY } from '../api/config'
import { createBooking } from '../api/bookings'
import AvailabilityCalendar from '../components/AvailabilityCalendar'

function VenueDetails() {
  const { id } = useParams()
  const { isLoggedIn, accessToken } = useAuth()

  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  function handleDateSelect(newCheckIn, newCheckOut) {
    setCheckIn(newCheckIn)
    setCheckOut(newCheckOut)
    setBookingError('')
    setSuccess('')
  }

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/holidaze/venues/${id}?_bookings=true`,
          {
            headers: {
              'X-Noroff-API-Key': API_KEY,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Unable to find this place to stay.')
        }

        const result = await response.json()
        setVenue(result.data)
      } catch (error) {
        setError(error.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    loadVenue()
  }, [id])

  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) /
            86400000
        )
      : 0

  const totalPrice = venue ? Number(venue.price) * nights : 0

  async function handleBooking(event) {
    event.preventDefault()

    setBookingError('')
    setSuccess('')

    if (!isLoggedIn || !accessToken) {
      setBookingError('Please log in before making a booking.')
      return
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setBookingError('Please select valid check-in and check-out dates.')
      return
    }

    if (guests < 1 || guests > venue.maxGuests) {
      setBookingError('The number of guests exceeds the venue capacity.')
      return
    }

    const existingBookings = venue.bookings || []

    const hasConflict = existingBookings.some((booking) => {
      return (
        checkIn < booking.dateTo.slice(0, 10) &&
        checkOut > booking.dateFrom.slice(0, 10)
      )
    })

    if (hasConflict) {
      setBookingError(
        'These dates are not available. Please choose different dates.'
      )
      return
    }

    try {
      setIsSubmitting(true)

      const createdBooking = await createBooking(
        {
          dateFrom: new Date(`${checkIn}T00:00:00.000Z`).toISOString(),
          dateTo: new Date(`${checkOut}T00:00:00.000Z`).toISOString(),
          guests: Number(guests),
          venueId: venue.id,
        },
        accessToken
      )

      setVenue((currentVenue) => ({
        ...currentVenue,
        bookings: [...(currentVenue.bookings || []), createdBooking],
      }))

      setSuccess('Your booking was successful! Enjoy your stay.')
      setCheckIn('')
      setCheckOut('')
      setGuests(1)
    } catch (error) {
      setBookingError(error.message || 'Could not complete your booking.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="container py-5">
        <p>Loading place details...</p>
      </main>
    )
  }

  if (error || !venue) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Place not found.'}
        </div>
        <Link to="/" className="btn btn-holidaze">
          Back to all stays
        </Link>
      </main>
    )
  }

  const image = venue.media?.find((item) => item.url)

  return (
    <main className="container venue-details-page py-4 py-lg-5">
      <Link to="/" className="venue-back-link text-decoration-none">
        <i className="bi bi-arrow-left me-2" aria-hidden="true"></i>
        Back to all stays
      </Link>

      <header className="venue-details-header mt-4 mb-4">
        <p className="venue-eyebrow mb-2">YOUR NEXT GETAWAY</p>
        <h1 className="mb-2">{venue.name}</h1>

        <p className="venue-location mb-0">
          <i className="bi bi-geo-alt me-2" aria-hidden="true"></i>
          {venue.location?.city && `${venue.location.city}, `}
          {venue.location?.country || 'Location not provided'}
        </p>
      </header>

      <div className="row g-4 g-xl-5 align-items-start">
        <div className="col-12 col-lg-7">
          <div className="venue-main-image">
            {image ? (
              <img src={image.url} alt={image.alt || venue.name} />
            ) : (
              <div className="venue-image-placeholder">
                <i className="bi bi-house" aria-hidden="true"></i>
                <span>No image available</span>
              </div>
            )}
          </div>

          <section className="venue-description-section mt-4">
            <div className="venue-capacity mb-4">
              <i className="bi bi-people" aria-hidden="true"></i>
              <div>
                <h2 className="h5 mb-1">Space for your stay</h2>
                <p className="text-secondary mb-0">
                  Up to {venue.maxGuests} guests
                </p>
              </div>
            </div>

            <hr className="mb-4" />

            <h2 className="h3 mb-3">About this place</h2>
            <p className="venue-description-text">
              {venue.description ||
                'No description is available for this place yet.'}
            </p>
          </section>
        </div>

        <aside className="col-12 col-lg-5">
          <div className="venue-booking-card">
            <div className="venue-booking-price">
              <span className="venue-price">${venue.price}</span>
              <span className="text-secondary"> / night</span>
            </div>

            <p className="text-secondary small mb-4">
              Choose your dates to plan your stay.
            </p>

            <form onSubmit={handleBooking}>
              <AvailabilityCalendar
                bookings={venue.bookings || []}
                checkIn={checkIn}
                checkOut={checkOut}
                onDateSelect={handleDateSelect}
              />

              <div className="d-flex justify-content-between align-items-center mt-3 py-2 border-top border-bottom">
                <div>
                  <small className="text-secondary d-block">CHECK-IN</small>
                  <strong>{checkIn || 'Select date'}</strong>
                </div>

                <i className="bi bi-arrow-right text-secondary"></i>

                <div>
                  <small className="text-secondary d-block">CHECK-OUT</small>
                  <strong>{checkOut || 'Select date'}</strong>
                </div>
              </div>

              <div className="venue-guests-field mt-3">
                <label htmlFor="guests">GUESTS</label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(event) => {
                    setGuests(Number(event.target.value))
                    setBookingError('')
                  }}
                >
                  {Array.from(
                    { length: Math.max(1, Number(venue.maxGuests) || 1) },
                    (_, index) => index + 1
                  ).map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>

              {bookingError && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  {bookingError}
                </div>
              )}

              {success && (
                <div className="alert alert-success mt-3 mb-0" role="status">
                  {success}
                  <div className="mt-2">
                    <Link to="/my-bookings">View my bookings</Link>
                  </div>
                </div>
              )}

              {!isLoggedIn ? (
                <Link to="/login" className="btn btn-holidaze w-100 mt-4">
                  Log in to book
                  <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
                </Link>
              ) : (
                <button
                  type="submit"
                  className="btn btn-holidaze w-100 mt-4"
                  disabled={
                    !checkIn || !checkOut || checkOut <= checkIn || isSubmitting
                  }
                >
                  {isSubmitting ? 'Booking...' : 'Book now'}
                  {!isSubmitting && (
                    <i
                      className="bi bi-arrow-right ms-2"
                      aria-hidden="true"
                    ></i>
                  )}
                </button>
              )}
            </form>

            {nights > 0 && Number.isFinite(totalPrice) && (
              <div className="venue-price-summary mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between gap-3">
                  <span className="text-secondary">
                    {venue.price} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <strong>${totalPrice.toLocaleString('en-US')}</strong>
                </div>
                <p className="small text-secondary mt-2 mb-0">
                  Estimated total before any additional fees.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

export default VenueDetails
