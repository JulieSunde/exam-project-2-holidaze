import BookingCard from './BookingCard'

function BookingSection({
  title,
  bookings,
  editingBookingId,
  dateFrom,
  dateTo,
  venueBookings,
  loadingCalendar,
  savingId,
  cancellingId,
  onEdit,
  onCancelEdit,
  onDateSelect,
  onSave,
  onCancel,
}) {
  if (bookings.length === 0) return null

  return (
    <section className="mb-5">
      <h2 className="h3 mb-3">{title}</h2>

      <div className="row g-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isEditing={editingBookingId === booking.id}
            dateFrom={dateFrom}
            dateTo={dateTo}
            venueBookings={venueBookings}
            loadingCalendar={loadingCalendar}
            saving={savingId === booking.id}
            cancelling={cancellingId === booking.id}
            onEdit={() => onEdit(booking)}
            onCancelEdit={onCancelEdit}
            onDateSelect={onDateSelect}
            onSave={() => onSave(booking.id)}
            onCancel={() => onCancel(booking.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default BookingSection
