function VenueBookings({ bookings }) {
  function formatDate(date) {
    return new Date(date).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (bookings.length === 0) {
    return (
      <div className="alert alert-light border">
        <h2 className="h5">No bookings yet</h2>
        <p className="mb-0">
          Your venues do not have any bookings yet.
        </p>
      </div>
    )
  }

  return (
    <div className="row g-4">
      {bookings.map((booking) => (
        <div className="col-12 col-lg-6" key={booking.id}>
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">
                {booking.venue.name}
              </h2>

              {booking.venue.media?.[0]?.url && (
                <img
                  src={booking.venue.media[0].url}
                  alt={
                    booking.venue.media[0].alt ||
                    booking.venue.name
                  }
                  className="img-fluid rounded mb-3"
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                  }}
                />
              )}

              <p className="mb-2">
                <strong>Check-in:</strong>{' '}
                {formatDate(booking.dateFrom)}
              </p>

              <p className="mb-2">
                <strong>Check-out:</strong>{' '}
                {formatDate(booking.dateTo)}
              </p>

              <p className="mb-2">
                <strong>Guests:</strong> {booking.guests}
              </p>

              <p className="text-secondary small mb-0">
                Booking ID: {booking.id}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VenueBookings
