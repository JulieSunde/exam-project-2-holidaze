export function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTodayKey() {
  return getDateKey(new Date())
}

export function getBookingStatus(booking) {
  const today = getTodayKey()
  const checkIn = booking.dateFrom.slice(0, 10)
  const checkOut = booking.dateTo.slice(0, 10)

  if (checkOut <= today) return 'Completed'
  if (checkIn <= today && checkOut > today) return 'Ongoing'

  return 'Upcoming'
}

export function getDaysUntil(date) {
  const today = getTodayKey()
  const [todayYear, todayMonth, todayDay] = today.split('-').map(Number)
  const [year, month, day] = date.slice(0, 10).split('-').map(Number)

  const todayUTC = Date.UTC(todayYear, todayMonth - 1, todayDay)
  const bookingUTC = Date.UTC(year, month - 1, day)

  return Math.round((bookingUTC - todayUTC) / 86400000)
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function groupBookings(bookings) {
  const groups = {
    upcoming: [],
    ongoing: [],
    completed: [],
  }

  bookings.forEach((booking) => {
    const status = getBookingStatus(booking)

    if (status === 'Upcoming') {
      groups.upcoming.push(booking)
    } else if (status === 'Ongoing') {
      groups.ongoing.push(booking)
    } else {
      groups.completed.push(booking)
    }
  })

  groups.upcoming.sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
  groups.ongoing.sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
  groups.completed.sort((a, b) => b.dateFrom.localeCompare(a.dateFrom))

  return groups
}
