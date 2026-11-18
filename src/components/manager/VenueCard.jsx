import { Link } from 'react-router-dom'

function VenueCard({ venue, onEdit, onDelete, deleting }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <article className="card h-100 border-0 shadow-sm overflow-hidden">
        {venue.media?.[0]?.url ? (
          <img
            src={venue.media[0].url}
            className="card-img-top"
            alt={venue.media[0].alt || venue.name}
            style={{
              height: '220px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: '220px' }}
          >
            <span className="text-secondary">No image available</span>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <h3 className="h5 mb-2">{venue.name}</h3>

          <p className="text-secondary mb-3">
            {[venue.location?.city, venue.location?.country]
              .filter(Boolean)
              .join(', ') || 'Location not specified'}
          </p>

          <div className="border-top pt-3 mb-3">
            <p className="mb-2">
              <strong>Price:</strong> ${venue.price} per night
            </p>

            <p className="mb-0">
              <strong>Maximum guests:</strong> {venue.maxGuests}
            </p>
          </div>

          <div className="d-grid gap-2 mt-auto">
            <button
              type="button"
              className="btn btn-holidaze"
              onClick={() => onEdit(venue)}
              disabled={deleting}
            >
              Edit venue
            </button>

            <div className="d-flex gap-2">
              <Link
                to={`/venues/${venue.id}`}
                className="btn btn-outline-dark flex-fill"
              >
                View venue
              </Link>

              <button
                type="button"
                className="btn btn-outline-danger flex-fill"
                onClick={() => onDelete(venue)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default VenueCard
