import { API_BASE_URL, API_KEY } from './config'

const AUTH_URL = `${API_BASE_URL}/auth`

export async function registerUser(userData) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(userData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Registration failed.')
  }

  return result.data
}

export async function loginUser(credentials) {
  const response = await fetch(`${AUTH_URL}/login?_holidaze=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(credentials),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Login failed.')
  }

  return result.data
}
