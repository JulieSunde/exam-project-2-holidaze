import { API_BASE_URL, API_KEY } from './config'

const API_URL = `${API_BASE_URL}/holidaze/venues`

export async function getVenues() {
  const headers = {
    'X-Noroff-API-Key': API_KEY,
  }

  const firstResponse = await fetch(`${API_URL}?limit=100&page=1`, {
    headers,
  })

  const firstResult = await firstResponse.json()

  if (!firstResponse.ok) {
    throw new Error(
      firstResult.errors?.[0]?.message ||
        'Could not fetch venues.'
    )
  }

  const allVenues = [...firstResult.data]
  const pageCount = firstResult.meta?.pageCount || 1

  for (let page = 2; page <= pageCount; page++) {
    const response = await fetch(`${API_URL}?limit=100&page=${page}`, {
      headers,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message ||
          'Could not fetch all venues.'
      )
    }

    allVenues.push(...result.data)
  }

  return allVenues
}

export async function getMyVenues(name, accessToken) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/venues`,
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
      result.errors?.[0]?.message || 'Could not fetch your venues.'
    )
  }

  return result.data
}

export async function createVenue(venueData, accessToken) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(venueData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Could not create venue.')
  }

  return result.data
}

export async function updateVenue(venueId, venueData, accessToken) {
  const response = await fetch(`${API_URL}/${venueId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(venueData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Could not update venue.')
  }

  return result.data
}

export async function deleteVenue(venueId, accessToken) {
  const response = await fetch(`${API_URL}/${venueId}`, {
    method: 'DELETE',
    headers: {
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const result = await response.json()

    throw new Error(result.errors?.[0]?.message || 'Could not delete venue.')
  }

  return true
}
