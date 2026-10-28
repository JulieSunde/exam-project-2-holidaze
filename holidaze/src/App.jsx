
import { useEffect, useState } from 'react'
import { getVenues } from './api/venues'

function App() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await getVenues()
        setVenues(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadVenues()
  }, [])

  return (
    <main className="container py-5">
      <h1 className="display-4 mb-3">Holidaze</h1>
      <p className="lead mb-4">
        Finn ditt neste favorittsted å bo.
      </p>

      {loading && <p>Laster inn overnattingssteder...</p>}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row g-4">
          {venues.map((venue) => (
            <div className="col-12 col-md-6 col-lg-4" key={venue.id}>
              <article className="card h-100">
                {venue.media?.[0]?.url && (
                  <img
                    src={venue.media[0].url}
                    className="card-img-top"
                    alt={venue.media[0].alt || venue.name}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                )}

                <div className="card-body">
                  <h2 className="card-title h5">{venue.name}</h2>

                  <p className="card-text">
                    {venue.location?.city && `${venue.location.city}, `}
                    {venue.location?.country || 'Sted ikke oppgitt'}
                  </p>

                  <p className="card-text">
                    <strong>{venue.price} kr</strong> per natt
                  </p>

                  <p className="card-text">
                    Plass til {venue.maxGuests} gjester
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && venues.length === 0 && (
        <p>Ingen overnattingssteder funnet.</p>
      )}
    </main>
  )
}

export default App
