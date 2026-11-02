
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function VenueDetails() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
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
  const today = new Date()
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`) -
            new Date(`${checkIn}T00:00:00`)) /
            86400000
        )
      : 0

  const totalPrice = Number(venue.price) * nights

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
              <img
                src={image.url}
                alt={image.alt || venue.name}
              />
            ) : (
              <div className="venue-image-placeholder">
                <i className="bi bi-house" aria-hidden="true"></i>
                <span>No image available</span>
              </div>
            )}
          </div>
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

            <form onSubmit={(event) => event.preventDefault()}>
              <div className="venue-date-fields">
                <div className="venue-date-field">
                  <label htmlFor="checkIn">CHECK-IN</label>
                  <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    min={minDate}
                    required
                    onChange={(event) => {
                      const nextCheckIn = event.target.value
                      setCheckIn(nextCheckIn)

                      if (checkOut && checkOut <= nextCheckIn) {
                        setCheckOut('')
                      }
                    }}
                  />
                </div>

                <div className="venue-date-field">
                  <label htmlFor="checkOut">CHECK-OUT</label>
                  <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    min={checkIn || minDate}
                    required
                    onChange={(event) => setCheckOut(event.target.value)}
                  />
                </div>
              </div>

              <div className="venue-guests-field mt-3">
                <label htmlFor="guests">GUESTS</label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
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

              <button
                type="submit"
                className="btn btn-holidaze w-100 mt-4"
                disabled={!checkIn || !checkOut || checkOut <= checkIn}
              >
                Check availability
                <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
              </button>
            </form>

            {nights > 0 && Number.isFinite(totalPrice) && (
              <div className="venue-price-summary mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between gap-3">
                  <span className="text-secondary">
                    {venue.price} × {nights}{' '}
                    {nights === 1 ? 'night' : 'nights'}
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

      <section className="venue-description-section mt-5 pt-4">
        <div className="row">
          <div className="col-12 col-lg-8">
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
          </div>
        </div>
      </section>
    </main>
  )
}

export default VenueDetails
