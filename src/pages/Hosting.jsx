import { useEffect, useRef, useState } from 'react'
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getMyVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from '../api/venues'
import VenueForm from '../components/manager/VenueForm'
import VenueCard from '../components/manager/VenueCard'

const initialVenueForm = {
  name: '',
  description: '',
  price: '',
  maxGuests: '',
  imageUrl: '',
  imageAlt: '',
  city: '',
  country: '',
}

function getTodayKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function Hosting() {
  const { user, accessToken, isLoggedIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deletingVenueId, setDeletingVenueId] = useState(null)
  const [editingVenue, setEditingVenue] = useState(null)
  const [createError, setCreateError] = useState('')
  const [success, setSuccess] = useState('')
  const [venueForm, setVenueForm] = useState(initialVenueForm)

  useEffect(() => {
    async function loadMyVenues() {
      try {
        setLoading(true)
        setError('')

        const data = await getMyVenues(user.name, accessToken)
        setVenues(data)
      } catch (err) {
        setError(err.message || 'Could not load your venues.')
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn && user?.venueManager && user?.name && accessToken) {
      loadMyVenues()
    }
  }, [isLoggedIn, user?.venueManager, user?.name, accessToken])

  useEffect(() => {
    if (!loading && location.state?.openAddVenue) {
      requestAnimationFrame(() => {
        setEditingVenue(null)
        setVenueForm(initialVenueForm)
        setCreateError('')
        setSuccess('')
        setShowForm(true)
      })

      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        {
          replace: true,
          state: null,
        }
      )
    }
  }, [
    loading,
    location.state,
    location.pathname,
    location.search,
    location.hash,
    navigate,
  ])

  useEffect(() => {
    if (!showForm) return

    const frameId = requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => cancelAnimationFrame(frameId)
  }, [showForm])

  function handleVenueInputChange(event) {
    const { name, value } = event.target

    setVenueForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function resetVenueForm() {
    setVenueForm(initialVenueForm)
    setEditingVenue(null)
    setShowForm(false)
    setCreateError('')
  }

  function handleAddVenue() {
    setEditingVenue(null)
    setVenueForm(initialVenueForm)
    setCreateError('')
    setSuccess('')
    setShowForm(true)
  }

  function handleEditVenue(venue) {
    setEditingVenue(venue)

    setVenueForm({
      name: venue.name || '',
      description: venue.description || '',
      price: String(venue.price || ''),
      maxGuests: String(venue.maxGuests || ''),
      imageUrl: venue.media?.[0]?.url || '',
      imageAlt: venue.media?.[0]?.alt || '',
      city: venue.location?.city || '',
      country: venue.location?.country || '',
    })

    setShowForm(true)
    setCreateError('')
    setSuccess('')
  }

  function getVenueFormData() {
    return {
      name: venueForm.name.trim(),
      description: venueForm.description.trim(),
      price: Number(venueForm.price),
      maxGuests: Number(venueForm.maxGuests),
      media: venueForm.imageUrl.trim()
        ? [
            {
              url: venueForm.imageUrl.trim(),
              alt: venueForm.imageAlt.trim() || venueForm.name,
            },
          ]
        : [],
      location: {
        city: venueForm.city.trim(),
        country: venueForm.country.trim(),
      },
    }
  }

  async function handleCreateVenue(event) {
    event.preventDefault()

    setCreateError('')
    setSuccess('')

    try {
      setCreating(true)

      const newVenue = await createVenue(getVenueFormData(), accessToken)

      setVenues((currentVenues) => [newVenue, ...currentVenues])

      resetVenueForm()
      setSuccess('Your venue has been created!')
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdateVenue(event) {
    event.preventDefault()
    setCreateError('')
    setSuccess('')

    try {
      setUpdating(true)

      const updatedVenue = await updateVenue(
        editingVenue.id,
        getVenueFormData(),
        accessToken
      )

      setVenues((currentVenues) =>
        currentVenues.map((venue) =>
          venue.id === editingVenue.id ? updatedVenue : venue
        )
      )

      resetVenueForm()
      setSuccess('Your venue has been updated!')
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  async function handleDeleteVenue(venue) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${venue.name}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setCreateError('')
    setSuccess('')

    try {
      setDeletingVenueId(venue.id)

      await deleteVenue(venue.id, accessToken)

      setVenues((currentVenues) =>
        currentVenues.filter((item) => item.id !== venue.id)
      )

      setSuccess('Your venue has been deleted.')
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setDeletingVenueId(null)
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (!user?.venueManager) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <p className="text-center py-5">Loading your venues...</p>
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </main>
    )
  }

  const totalBookings = venues.reduce(
    (total, venue) => total + (venue.bookings?.length || 0),
    0
  )

  const upcomingBookings = venues.reduce((total, venue) => {
    const upcoming = (venue.bookings || []).filter(
      (booking) => booking.dateFrom.slice(0, 10) > getTodayKey()
    )

    return total + upcoming.length
  }, 0)

  return (
    <main className="container py-5">
      <div className="mb-4">
        <p className="text-uppercase small fw-semibold mb-2">HOSTING</p>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="display-6 mb-2">My venues</h1>

            <p className="text-secondary mb-0">
              Manage your properties and keep track of your listings.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-holidaze"
            onClick={showForm ? resetVenueForm : handleAddVenue}
          >
            {showForm ? 'Close form' : 'Add venue'}
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <Link to="/hosting" className="btn btn-holidaze">
          My Venues
        </Link>

        <Link to="/manager/bookings" className="btn btn-outline-secondary">
          Booking Overview
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body">
              <p className="text-secondary mb-1">Total venues</p>
              <p className="display-6 fw-semibold mb-0">{venues.length}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body">
              <p className="text-secondary mb-1">Total bookings</p>
              <p className="display-6 fw-semibold mb-0">{totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="card h-100 border-0 bg-light">
            <div className="card-body">
              <p className="text-secondary mb-1">Upcoming bookings</p>
              <p className="display-6 fw-semibold mb-0">{upcomingBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {createError && (
        <div className="alert alert-danger" role="alert">
          {createError}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      {showForm && (
        <div ref={formRef} style={{ scrollMarginTop: '100px' }}>
          <VenueForm
            venueForm={venueForm}
            editingVenue={editingVenue}
            creating={creating}
            updating={updating}
            onInputChange={handleVenueInputChange}
            onSubmit={editingVenue ? handleUpdateVenue : handleCreateVenue}
            onCancel={resetVenueForm}
          />
        </div>
      )}

      <section className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 mb-0">Your venues</h2>
          <span className="text-secondary small">
            {venues.length} {venues.length === 1 ? 'venue' : 'venues'}
          </span>
        </div>

        {venues.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="h5">No venues yet</h3>
            <p className="text-secondary">
              You haven't listed any accommodation yet.
            </p>

            <button
              type="button"
              className="btn btn-holidaze"
              onClick={handleAddVenue}
            >
              Add your first venue
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onEdit={handleEditVenue}
                onDelete={handleDeleteVenue}
                deleting={deletingVenueId === venue.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Hosting
