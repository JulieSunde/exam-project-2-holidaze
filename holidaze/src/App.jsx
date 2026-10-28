
import { useEffect, useState } from 'react'
import { getVenues } from './api/venues'

function App() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [submittedSearch, setSubmittedSearch] = useState({
    destination: '',
    guests: '1',
  })

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await getVenues()
        setVenues(data)
      } catch (error) {
        setError(error.message || 'Unable to load places to stay.')
      } finally {
        setLoading(false)
      }
    }

    loadVenues()
  }, [])

  const heroImage = venues.find(
  (venue) => venue.media?.[0]?.url
)?.media[0].url
  const filteredVenues = venues.filter((venue) => {
    const query = submittedSearch.destination.toLowerCase().trim()
    const name = venue.name || ''
    const city = venue.location?.city || ''
    const country = venue.location?.country || ''

    const matchesDestination = `${name} ${city} ${country}`
      .toLowerCase()
      .includes(query)

    const matchesGuests =
      Number(venue.maxGuests) >= Number(submittedSearch.guests)

    return matchesDestination && matchesGuests
  })

  function handleSearch(event) {
    event.preventDefault()

    if (checkIn && checkOut && checkOut <= checkIn) {
      setError('Check-out must be after check-in.')
      return
    }

    setError('')

    setSubmittedSearch({
      destination,
      guests,
    })

    document.getElementById('stays')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const today = new Date()
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top border-bottom">
        <div className="container py-2">
          <a className="navbar-brand" href="#">
            Holidaze
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavigation"
            aria-controls="mainNavigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavigation">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <a className="nav-link" href="#stays">
                Explore stays
              </a>

              <a className="nav-link" href="#about">
                About us
              </a>

              <a className="nav-link" href="#footer">
                Contact
              </a>

              <a className="btn btn-holidaze ms-lg-2" href="#stays">
                Find a stay
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section
          className="hero-section"
          style={{
            backgroundImage: heroImage
              ? `linear-gradient(rgba(20, 35, 32, 0.35), rgba(20, 35, 32, 0.35)), url("${heroImage}")`
              : 'linear-gradient(135deg, #456b60, #243746)',
          }}
>
  <div className="container py-5">
          <div className="row align-items-center py-lg-5">
            <div className="col-lg-8 col-xl-7 py-4">
              <p className="text-uppercase small fw-semibold mb-3">
                YOUR NEXT GETAWAY STARTS HERE
              </p>

              <h1 className="display-3 fw-semibold mb-4">
                A little closer to calm.
              </h1>

              <p className="lead mb-4">
                Discover unique places to stay, find new favourites,
                and plan your next getaway with Holidaze.
              </p>

              <a className="btn btn-holidaze" href="#stays">
                Explore places to stay
              </a>
            </div>
          </div>

<form className="search-panel mb-5" onSubmit={handleSearch}>
  <div className="row g-3 align-items-end">
    <div className="col-12 col-md-6 col-xl-3">
      <label htmlFor="destination" className="form-label fw-semibold">
        Destination
      </label>

      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-geo-alt" aria-hidden="true"></i>
        </span>

        <input
          id="destination"
          type="text"
          className="form-control"
          placeholder="Where are you going?"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>
    </div>

    <div className="col-12 col-md-6 col-xl-2">
      <label htmlFor="checkIn" className="form-label fw-semibold">
        Check-in
      </label>

      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-calendar-event" aria-hidden="true"></i>
        </span>

        <input
          id="checkIn"
          type="date"
          className="form-control"
          value={checkIn}
          min={todayString}
          max={checkOut || undefined}
          onChange={(event) => setCheckIn(event.target.value)}
        />
      </div>
    </div>

    <div className="col-12 col-md-6 col-xl-2">
      <label htmlFor="checkOut" className="form-label fw-semibold">
        Check-out
      </label>

      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-calendar-check" aria-hidden="true"></i>
        </span>

        <input
          id="checkOut"
          type="date"
          className="form-control"
          value={checkOut}
          min={checkIn || todayString}
          onChange={(event) => setCheckOut(event.target.value)}
        />
      </div>
    </div>

    <div className="col-12 col-md-6 col-xl-2">
      <label htmlFor="guests" className="form-label fw-semibold">
        Guests
      </label>

      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-people" aria-hidden="true"></i>
        </span>

        <select
          id="guests"
          className="form-select"
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
        >
          <option value="1">1 guest</option>
          <option value="2">2 guests</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
          <option value="5">5 guests</option>
          <option value="6">6 guests</option>
          <option value="8">8 guests</option>
          <option value="10">10 guests</option>
          <option value="12">12 guests</option>
          <option value="16">16 guests</option>
        </select>
      </div>
    </div>

    <div className="col-12 col-md-6 col-xl-3">
      <button
        type="submit"
        className="btn btn-holidaze w-100"
      >
        <i className="bi bi-search me-2" aria-hidden="true"></i>
        Search stays
      </button>
    </div>
  </div>
</form>
        </div>
      </section>
        <section className="container pb-5" id="stays">
          <div className="mb-4">
            <p className="text-uppercase small fw-semibold mb-2">
              FIND YOUR NEXT ESCAPE
            </p>

            <h2 className="display-6">Explore places to stay</h2>

            <p className="text-secondary">
              Find the right place for your next trip.
            </p>
          </div>

          {loading && <p>Loading places to stay...</p>}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredVenues.length > 0 ? (
                <div className="row g-4">
                  {filteredVenues.map((venue) => (
                    <div
                      className="col-12 col-md-6 col-lg-4"
                      key={venue.id}
                    >
                      <article className="card">
                        {venue.media?.[0]?.url && (
                          <img
                            src={venue.media[0].url}
                            className="card-img-top"
                            alt={venue.media[0].alt || venue.name}
                          />
                        )}

                        <div className="card-body">
                          <h3 className="card-title h5">
                            {venue.name}
                          </h3>

                          <p className="venue-location">
                            {venue.location?.city &&
                              `${venue.location.city}, `}
                            {venue.location?.country ||
                              'Location not provided'}
                          </p>

                          <p className="venue-price mb-2">
                            {venue.price}{' '}
                            <span className="fw-normal">per night</span>
                          </p>

                          <p className="card-text text-secondary mb-0">
                            Up to {venue.maxGuests} guests
                          </p>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              ) : (
                <p>
                  No places found. Try a different destination or guest count.
                </p>
              )}
            </>
          )}
        </section>

        <section className="container py-5" id="about">
          <div className="row">
            <div className="col-lg-8 py-4">
              <h2 className="display-6 mb-3">
                Your next great stay starts here.
              </h2>

              <p>
                Holidaze helps you discover places to stay and find
                the perfect setting for your next adventure.
              </p>
            </div>
          </div>
        </section>
      </main>

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
