
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function VenueDetails() {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <main className="container py-5">
      <Link to="/" className="text-decoration-none">
        &larr; Back to all stays
      </Link>

      <div className="row g-4 mt-2">
        <div className="col-12 col-lg-7">
          {venue.media?.[0]?.url && (
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt || venue.name}
              className="img-fluid rounded-4 w-100"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          )}
        </div>

        <div className="col-12 col-lg-5">
          <p className="text-uppercase small fw-semibold">
            YOUR NEXT GETAWAY
          </p>

          <h1 className="mb-3">{venue.name}</h1>

          <p className="venue-location">
            {venue.location?.city && `${venue.location.city}, `}
            {venue.location?.country || 'Location not provided'}
          </p>

          <p className="venue-price">
            {venue.price} <span className="fw-normal">per night</span>
          </p>

          <p>
            Up to {venue.maxGuests} guests
          </p>

          {venue.description && (
            <div className="mt-4">
              <h2 className="h4">About this place</h2>
              <p>{venue.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default VenueDetails
