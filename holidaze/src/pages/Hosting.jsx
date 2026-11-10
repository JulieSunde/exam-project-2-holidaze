import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMyVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../api/venues";

import VenueForm from "../components/manager/VenueForm";
import VenueCard from "../components/manager/VenueCard";

const initialVenueForm = {
  name: "",
  description: "",
  price: "",
  maxGuests: "",
  imageUrl: "",
  imageAlt: "",
  city: "",
  country: "",
};

function Hosting() {
  const { user, accessToken, isLoggedIn } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingVenueId, setDeletingVenueId] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
  const [createError, setCreateError] = useState("");
  const [success, setSuccess] = useState("");
  const [venueForm, setVenueForm] = useState(initialVenueForm);

  useEffect(() => {
    async function loadMyVenues() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyVenues(user.name, accessToken);
        setVenues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (isLoggedIn && user?.venueManager && user?.name && accessToken) {
      loadMyVenues();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user?.venueManager, user?.name, accessToken]);

  function handleVenueInputChange(event) {
    const { name, value } = event.target;

    setVenueForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }
  function resetVenueForm() {
    setVenueForm(initialVenueForm);
    setEditingVenue(null);
    setShowForm(false);
    setCreateError("");
  }

  function handleAddVenue() {
    setEditingVenue(null);
    setVenueForm(initialVenueForm);
    setCreateError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleEditVenue(venue) {
    setEditingVenue(venue);

    setVenueForm({
      name: venue.name || "",
      description: venue.description || "",
      price: String(venue.price || ""),
      maxGuests: String(venue.maxGuests || ""),
      imageUrl: venue.media?.[0]?.url || "",
      imageAlt: venue.media?.[0]?.alt || "",
      city: venue.location?.city || "",
      country: venue.location?.country || "",
    });

    setShowForm(true);
    setCreateError("");
    setSuccess("");
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
    };
  }

  async function handleCreateVenue(event) {
    event.preventDefault();

    setCreateError("");
    setSuccess("");

    try {
      setCreating(true);

      const newVenue = await createVenue(getVenueFormData(), accessToken);

      setVenues((currentVenues) => [newVenue, ...currentVenues]);

      resetVenueForm();
      setSuccess("Your venue has been created!");
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateVenue(event) {
    event.preventDefault();
    setCreateError("");
    setSuccess("");

    try {
      setUpdating(true);

      const updatedVenue = await updateVenue(
        editingVenue.id,
        getVenueFormData(),
        accessToken,
      );

      setVenues((currentVenues) =>
        currentVenues.map((venue) =>
          venue.id === editingVenue.id ? updatedVenue : venue,
        ),
      );

      resetVenueForm();
      setSuccess("Your venue has been updated!");
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteVenue(venue) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${venue.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setCreateError("");
    setSuccess("");

    try {
      setDeletingVenueId(venue.id);

      await deleteVenue(venue.id, accessToken);

      setVenues((currentVenues) =>
        currentVenues.filter((item) => item.id !== venue.id),
      );

      setSuccess("Your venue has been deleted.");
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setDeletingVenueId(null);
    }
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.venueManager) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p className="text-center py-5">Loading your venues...</p>;
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My hosting</h1>

        <button
          type="button"
          className="btn btn-holidaze"
          onClick={showForm ? resetVenueForm : handleAddVenue}
        >
          {showForm ? "Close form" : "Add venue"}
        </button>
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
        <VenueForm
          venueForm={venueForm}
          editingVenue={editingVenue}
          creating={creating}
          updating={updating}
          onInputChange={handleVenueInputChange}
          onSubmit={editingVenue ? handleUpdateVenue : handleCreateVenue}
          onCancel={resetVenueForm}
        />
      )}

      {venues.length === 0 ? (
        <div className="text-center py-5">
          <h2>No venues yet</h2>
          <p>You haven't listed any accommodation yet.</p>

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
    </main>
  );
}

export default Hosting;
