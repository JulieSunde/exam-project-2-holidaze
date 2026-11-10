import { useState } from 'react'
import { registerUser } from '../api/auth'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    venueManager: false,
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!formData.email.endsWith('@stud.noroff.no')) {
      setError('Please use your @stud.noroff.no email address.')
      return
    }

    if (formData.password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      await registerUser(formData)
      setMessage('Your account has been created successfully!')
      setFormData({
        name: '',
        email: '',
        password: '',
        venueManager: false,
      })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <h1 className="mb-2">Create an account</h1>
          <p className="text-muted mb-4">
            Join Holidaze and start planning your next stay.
          </p>

          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Student email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@stud.noroff.no"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
              <div className="form-text">
                Password must be at least 8 characters.
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                id="venueManager"
                name="venueManager"
                type="checkbox"
                className="form-check-input"
                checked={formData.venueManager}
                onChange={handleChange}
              />
              <label htmlFor="venueManager" className="form-check-label">
                I want to register as a venue manager
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-holidaze w-100"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register
