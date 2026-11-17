import { formatDate } from '../../utils/bookingUtils'

function BookingSummary({
  upcomingCount,
  ongoingCount,
  completedCount,
  nextBooking,
  daysUntilNextBooking,
}) {
  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body">
              <p className="text-secondary mb-1">Upcoming</p>
              <p className="display-6 fw-semibold mb-0">{upcomingCount}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body">
              <p className="text-secondary mb-1">Ongoing</p>
              <p className="display-6 fw-semibold mb-0">{ongoingCount}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body">
              <p className="text-secondary mb-1">Completed</p>
              <p className="display-6 fw-semibold mb-0">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {nextBooking && (
        <div className="alert alert-info mb-5" role="status">
          <h2 className="h5">Your next stay</h2>

          <p className="mb-1">
            <strong>{nextBooking.venue?.name || 'Your next venue'}</strong>
            {' — '}
            {formatDate(nextBooking.dateFrom)}
          </p>

          <p className="mb-0">
            {daysUntilNextBooking === 0
              ? 'Your stay starts today!'
              : `Your stay starts in ${daysUntilNextBooking} ${
                  daysUntilNextBooking === 1 ? 'day' : 'days'
                }.`}
          </p>
        </div>
      )}
    </>
  )
}

export default BookingSummary
