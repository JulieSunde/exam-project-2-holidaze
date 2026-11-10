import { useState, useEffect } from 'react'

function AvailabilityCalendar({
  bookings = [],
  checkIn,
  checkOut,
  onDateSelect,
  excludeBookingId = null,
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const initialDate = checkIn ? new Date(`${checkIn}T00:00:00`) : new Date()

    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  })

  useEffect(() => {
    if (checkIn) {
      const date = new Date(`${checkIn}T00:00:00`)

      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }, [checkIn])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const otherBookings = bookings.filter(
    (booking) => booking.id !== excludeBookingId
  )

  function isUnavailable(date) {
    const dateString = formatDate(date)

    if (date < today) return true

    return otherBookings.some((booking) => {
      const start = booking.dateFrom.slice(0, 10)
      const end = booking.dateTo.slice(0, 10)

      return dateString >= start && dateString < end
    })
  }

  function handleDateClick(date) {
    const selectedDate = formatDate(date)

    if (!checkIn || checkOut || selectedDate <= checkIn) {
      onDateSelect(selectedDate, '')
      return
    }

    const hasConflict = otherBookings.some((booking) => {
      const start = booking.dateFrom.slice(0, 10)
      const end = booking.dateTo.slice(0, 10)

      return selectedDate > start && checkIn < end
    })

    if (!hasConflict) {
      onDateSelect(checkIn, selectedDate)
    }
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startingDay = (firstDay.getDay() + 6) % 7

  const days = [
    ...Array(startingDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  function changeMonth(amount) {
    setCurrentMonth(new Date(year, month + amount, 1))
  }

  return (
    <div className="availability-calendar">
      <div className="availability-calendar-header">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
        >
          ‹
        </button>

        <h3>
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="availability-calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <span className="calendar-weekday" key={day}>
            {day}
          </span>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} />
          }

          const date = new Date(year, month, day)
          const dateString = formatDate(date)
          const unavailable = isUnavailable(date)
          const selected = dateString === checkIn || dateString === checkOut
          const inRange =
            checkIn && checkOut && dateString > checkIn && dateString < checkOut

          return (
            <button
              key={dateString}
              type="button"
              disabled={unavailable}
              className={[
                'calendar-day',
                unavailable ? 'unavailable' : '',
                selected ? 'selected' : '',
                inRange ? 'in-range' : '',
              ].join(' ')}
              onClick={() => handleDateClick(date)}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span>
          <i className="legend-available" /> Available
        </span>
        <span>
          <i className="legend-unavailable" /> Booked
        </span>
      </div>
    </div>
  )
}

export default AvailabilityCalendar
