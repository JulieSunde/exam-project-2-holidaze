const API_URL = 'https://v2.api.noroff.dev/holidaze/venues'

export async function getVenues() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Kunne ikke hente overnattingsstedene.')
  }

  const result = await response.json()

  return result.data
}