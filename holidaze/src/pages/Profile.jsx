
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../api/profiles'

function Profile() {
  const { user, accessToken, updateUser } = useAuth()

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || '')
  const [avatarAlt, setAvatarAlt] = useState(user?.avatar?.alt || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!user) {
    return (
      <p className="text-center mt-5">
        Please log in to view your profile.
      </p>
    )
  }

  async function handleAvatarUpdate(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const updatedProfile = await updateProfile(
        user.name,
        accessToken,
        {
          avatar: {
            url: avatarUrl,
            alt: avatarAlt,
          },
        }
      )

      updateUser(updatedProfile)
      setSuccess('Your profile picture has been updated!')
    } catch (err) {
      setError(err.message || 'Could not update your profile picture.')
    } finally {
      setLoading(false)
    }
  }

  async function handleHostingAccessToggle() {
    const isRemovingAccess = user.venueManager

    const confirmed = window.confirm(
      isRemovingAccess
        ? 'Are you sure you want to remove your hosting access? Your venues and bookings will not be deleted.'
        : 'Are you sure you want to become a venue manager?'
    )

    if (!confirmed) return

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const updatedProfile = await updateProfile(
        user.name,
        accessToken,
        { venueManager: !isRemovingAccess }
      )

      updateUser(updatedProfile)

      setSuccess(
        isRemovingAccess
          ? 'Hosting access removed. Your venues and bookings are preserved.'
          : 'Congratulations! You are now a venue manager.'
      )
    } catch (err) {
      setError(err.message || 'Could not update your hosting access.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container profile-page">
      <div className="profile-heading">
        <p className="profile-eyebrow">YOUR ACCOUNT</p>
        <h1>My profile</h1>
        <p className="text-muted mb-0">
          Manage your personal information and Holidaze experience.
        </p>
      </div>

      {/* Profile header */}
      <section className="profile-header profile-header-compact">
        <img
          src={
            user.avatar?.url ||
            'https://placehold.co/130x130?text=Profile'
          }
          alt={user.avatar?.alt || 'Profile'}
          className="profile-avatar"
        />

        <div className="profile-header-content">
          <p className="profile-eyebrow mb-1">WELCOME BACK</p>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          <span className="profile-role">
            <i className="bi bi-person-check me-2"></i>
            {user.venueManager ? 'Venue manager' : 'Holidaze member'}
          </span>
        </div>
      </section>

      <div className="row g-3 profile-dashboard">
        <div className="col-lg-7">
          <div className="profile-section profile-section-compact">
            <h2>
              <i className="bi bi-person-lines-fill me-2"></i>
              Account information
            </h2>

            <div className="row g-3">
              <div className="col-sm-6">
                <p className="profile-info-label">Username</p>
                <p className="profile-info-value">{user.name}</p>
              </div>

              <div className="col-sm-6">
                <p className="profile-info-label">Email address</p>
                <p className="profile-info-value">{user.email}</p>
              </div>

              <div className="col-sm-6">
                <p className="profile-info-label">Account type</p>
                <p className="profile-info-value">
                  {user.venueManager ? 'Venue manager' : 'Customer'}
                </p>
              </div>
            </div>
          </div>

          <div className="profile-section profile-section-compact">
            <h2>
              <i className="bi bi-camera me-2"></i>
              Profile picture
            </h2>

            <p className="text-muted small">
              Personalise your account with a profile picture.
            </p>

            <form onSubmit={handleAvatarUpdate}>
              <div className="mb-3">
                <label htmlFor="avatarUrl" className="form-label">
                  Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="avatarAlt" className="form-label">
                  Image description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="avatarAlt"
                  value={avatarAlt}
                  onChange={(event) => setAvatarAlt(event.target.value)}
                  placeholder="Describe your profile picture"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-holidaze"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save picture'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="profile-section profile-host-section">
            {user.venueManager ? (
              <>
                <div className="profile-host-icon">
                  <i className="bi bi-house-heart"></i>
                </div>

                <p className="profile-eyebrow">YOUR HOST ACCOUNT</p>
                <h2>You're a host!</h2>

                <p className="text-muted">
                  You can share your accommodation with travellers
                  through Holidaze.
                </p>

                <ul className="profile-host-list">
                  <li>Create and manage your venues</li>
                  <li>Keep track of your bookings</li>
                  <li>Welcome travellers</li>
                </ul>

                <a href="/hosting" className="btn btn-holidaze w-100">
                  Go to hosting dashboard
                </a>

                <button
                  type="button"
                  className="profile-remove-host"
                  onClick={handleHostingAccessToggle}
                  disabled={loading}
                >
                  Remove hosting access
                </button>
              </>
            ) : (
              <>
                <div className="profile-host-icon">
                  <i className="bi bi-house-heart"></i>
                </div>

                <p className="profile-eyebrow">BECOME A HOST</p>
                <h2>Share your place with the world</h2>

                <p className="text-muted">
                  Turn your accommodation into an opportunity.
                  Become a Holidaze host and start welcoming travellers.
                </p>

                <ul className="profile-host-list">
                  <li>Create and manage your own venues</li>
                  <li>Manage your bookings</li>
                  <li>Welcome travellers from around the world</li>
                </ul>

                <button
                  type="button"
                  className="btn btn-holidaze w-100"
                  onClick={handleHostingAccessToggle}
                  disabled={loading}
                >
                  {loading ? 'Updating account...' : 'Become a host'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {(error || success) && (
        <div
          className={`profile-feedback ${
            error ? 'profile-error' : 'profile-success'
          }`}
          role={error ? 'alert' : 'status'}
        >
          {error || success}
        </div>
      )}
    </main>
  )
}

export default Profile
