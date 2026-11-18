import { Link } from 'react-router-dom'
import AvailabilityCalendar from '../AvailabilityCalendar'
import { formatDate, getBookingStatus } from '../../utils/bookingUtils'

function BookingCard({
  booking,
  isEditing,
  dateFrom,
  dateTo,
  venueBookings,
  loadingCalendar,
  saving,
  cancelling,
  onEdit,
  onCancelEdit,
  onDateSelect,
  onSave,
  onCancel,
}) {
  const canManage = getBookingStatus(booking) === 'Upcoming'

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
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
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
              <span>No image available</span>
            </div>
          )}
        </div>

        <div className="card-body">
          <h3 className="h5">{booking.venue?.name || 'Venue'}</h3>

          {isEditing ? (
            <div>
              <p className="small text-secondary">
                Select your new check-in and check-out dates.
              </p>

              <AvailabilityCalendar
                bookings={venueBookings}
                checkIn={dateFrom}
                checkOut={dateTo}
                onDateSelect={onDateSelect}
                excludeBookingId={booking.id}
              />

              <div className="d-flex justify-content-between gap-2 mt-3">
                <div>
                  <small className="text-secondary d-block">CHECK-IN</small>
                  <strong>{dateFrom || 'Select date'}</strong>
                </div>

                <div>
                  <small className="text-secondary d-block">CHECK-OUT</small>
                  <strong>{dateTo || 'Select date'}</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-holidaze me-2 mt-3"
                onClick={onSave}
                disabled={saving || loadingCalendar || !dateFrom || !dateTo}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary mt-3"
                onClick={onCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p>
                <strong>Check-in:</strong> {formatDate(booking.dateFrom)}
              </p>

              <p>
                <strong>Check-out:</strong> {formatDate(booking.dateTo)}
              </p>

              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>

              <div className="d-grid gap-2 mt-3">
                {canManage && (
                  <button
                    type="button"
                    className="btn btn-holidaze w-100"
                    onClick={onEdit}
                    disabled={cancelling || loadingCalendar}
                  >
                    Change dates
                  </button>
                )}

                <div className="d-flex gap-2">
                  {booking.venue?.id && (
                    <Link
                      to={`/venues/${booking.venue.id}`}
                      className="btn btn-outline-dark flex-fill"
                    >
                      View venue
                    </Link>
                  )}

                  {canManage && (
                    <button
                      type="button"
                      className="btn btn-outline-danger flex-fill"
                      onClick={onCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel booking'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingCard
