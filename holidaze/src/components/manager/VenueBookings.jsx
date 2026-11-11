function VenueBookings({ bookings }) {
  function formatDate(date) {
    return new Date(date).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function getBookingStatus(booking) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkIn = new Date(booking.dateFrom)
    checkIn.setHours(0, 0, 0, 0)

    const checkOut = new Date(booking.dateTo)
    checkOut.setHours(0, 0, 0, 0)

    if (checkOut <= today) {
      return 'Completed'
    }

    if (checkIn <= today && checkOut > today) {
      return 'Ongoing'
    }

    return 'Upcoming'
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(a.dateFrom) - new Date(b.dateFrom)
  })

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
          <div className="col-12 col-lg-6" key={booking.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                  <h2 className="h5 mb-0">{booking.venue.name}</h2>

                  <span
                    className={`badge ${
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

                {booking.venue.media?.[0]?.url && (
                  <img
                    src={booking.venue.media[0].url}
                    alt={booking.venue.media[0].alt || booking.venue.name}
                    className="img-fluid rounded mb-3"
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                  />
                )}

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

                <h3 className="h6 mb-2">Booking details</h3>

                <p className="mb-2">
                  <strong>Check-in:</strong> {formatDate(booking.dateFrom)}
                </p>

                <p className="mb-2">
                  <strong>Check-out:</strong> {formatDate(booking.dateTo)}
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
        )
      })}
    </div>
  )
}

export default VenueBookings
