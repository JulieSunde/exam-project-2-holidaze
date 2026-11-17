import { formatDate, getBookingStatus } from '../../utils/bookingUtils'

function VenueBookings({ bookings }) {
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  )

  if (bookings.length === 0) {
    return (
      <div className="alert alert-light border">
        <h2 className="h5">No bookings yet</h2>
        <p className="mb-0">Your venues do not have any bookings yet.</p>
      </div>
    )
  }

  return (
    <div className="row g-4">
      {sortedBookings.map((booking) => {
        const status = getBookingStatus(booking)

        return (
          <div className="col-md-6 col-lg-4" key={booking.id}>
            <article className="card h-100 shadow-sm">
              <div
                className="card-img-top"
                style={{
                  height: '220px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f1f1',
                }}
              >
                {booking.venue?.media?.[0]?.url ? (
                  <img
                    src={booking.venue.media[0].url}
                    alt={booking.venue.media[0].alt || booking.venue.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
                    <span>No image available</span>
                  </div>
                )}
              </div>

              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <h2 className="h5 mb-0">{booking.venue?.name || 'Venue'}</h2>

                  <span
                    className={`badge flex-shrink-0 ${
                      status === 'Upcoming'
                        ? 'text-bg-primary'
                        : status === 'Ongoing'
                          ? 'text-bg-success'
                          : 'text-bg-secondary'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="border-bottom pb-3 mb-3">
                  <h3 className="h6 mb-2">Customer information</h3>

                  <p className="mb-1">
                    <strong>Name:</strong>{' '}
                    {booking.customer?.name || 'Not available'}
                  </p>

                  <p className="mb-0">
                    <strong>Email:</strong>{' '}
                    {booking.customer?.email ? (
                      <a href={`mailto:${booking.customer.email}`}>
                        {booking.customer.email}
                      </a>
                    ) : (
                      'Not available'
                    )}
                  </p>
                </div>

                <h3 className="h6 mb-3">Booking details</h3>

                <p className="mb-2">
                  <strong>Check-in:</strong> {formatDate(booking.dateFrom)}
                </p>

                <p className="mb-2">
                  <strong>Check-out:</strong> {formatDate(booking.dateTo)}
                </p>

                <p className="mb-3">
                  <strong>Guests:</strong> {booking.guests}
                </p>

                <p className="text-secondary small border-top pt-3 mt-auto mb-0">
                  Booking ID: {booking.id}
                </p>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}

export default VenueBookings
