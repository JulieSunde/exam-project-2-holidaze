import { API_BASE_URL, API_KEY } from './config'

export async function updateProfile(name, accessToken, profileData) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.errors?.[0]?.message || 'Could not update profile.'
    )
  }

  return result.data
}