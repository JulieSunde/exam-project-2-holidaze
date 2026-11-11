import { Link } from 'react-router-dom'

function VenueCard({ venue, onEdit, onDelete, deleting }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100">
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

        <div className="card-body">
          <h2 className="h5">{venue.name}</h2>

          <p>
            <strong>Location:</strong> {venue.location?.city || 'Not specified'}
            {venue.location?.country ? `, ${venue.location.country}` : ''}
          </p>

          <p>
            <strong>Price:</strong> ${venue.price} per night
          </p>

          <p>
            <strong>Maximum guests:</strong> {venue.maxGuests}
          </p>

          <div className="d-grid gap-2 mt-3">
            <button
              type="button"
              className="btn btn-holidaze w-100"
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
                {deleting ? 'Deleting...' : 'Delete venue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueCard
