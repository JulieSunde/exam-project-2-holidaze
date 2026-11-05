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
    throw new Error(
      result.errors?.[0]?.message || 'Could not fetch bookings.'
    )
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
    throw new Error(
      result.errors?.[0]?.message || 'Could not create booking.'
    )
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

    throw new Error(
      result.errors?.[0]?.message || 'Could not cancel booking.'
    )
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
    throw new Error(
      result.errors?.[0]?.message || 'Could not update booking.'
    )
  }

  return result.data
}
