import { API_BASE_URL, API_KEY } from './config'

const API_URL = `${API_BASE_URL}/holidaze/venues`

export async function getVenues() {
  const response = await fetch(API_URL, {
    headers: {
      'X-Noroff-API-Key': API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error('Kunne ikke hente overnattingsstedene.')
  }

  const result = await response.json()

  return result.data
}