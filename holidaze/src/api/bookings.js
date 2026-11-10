import { API_BASE_URL, API_KEY } from './config'

export async function getMyBookings(name, accessToken) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/bookings?_venue=true`,
    {
      headers: {
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Could not fetch bookings.')
  }

  return result.data
}

export async function createBooking(bookingData, accessToken) {
  const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bookingData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Could not create booking.')
  }

  return result.data
}

export async function cancelBooking(bookingId, accessToken) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/bookings/${bookingId}`,
    {
      method: 'DELETE',
      headers: {
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const result = await response.json()

    throw new Error(result.errors?.[0]?.message || 'Could not cancel booking.')
  }

  return true
}

export async function updateBooking(bookingId, bookingData, accessToken) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/bookings/${bookingId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bookingData),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Could not update booking.')
  }

  return result.data
}

export async function getManagerBookings(name, accessToken) {
  const headers = {
    'X-Noroff-API-Key': API_KEY,
    Authorization: `Bearer ${accessToken}`,
  }

  const allVenues = []
  let page = 1
  let pageCount = 1

  // Fetch all venues belonging to the manager
  do {
    const response = await fetch(
      `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/venues?_bookings=true&limit=100&page=${page}`,
      { headers }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message || 'Could not fetch venue bookings.'
      )
    }

    allVenues.push(...result.data)
    pageCount = result.meta?.pageCount || 1
    page++
  } while (page <= pageCount)

  const bookings = await Promise.all(
    allVenues.flatMap((venue) =>
      (venue.bookings || []).map(async (booking) => {
        const response = await fetch(
          `${API_BASE_URL}/holidaze/bookings/${encodeURIComponent(booking.id)}?_customer=true&_venue=true`,
          { headers }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.errors?.[0]?.message || 'Could not fetch booking details.'
          )
        }

        return {
          ...result.data,
          venue: {
            id: venue.id,
            name: venue.name,
            media: venue.media,
            location: venue.location,
          },
        }
      })
    )
  )

  return bookings
}
