function VenueForm({
  venueForm,
  editingVenue,
  creating,
  updating,
  onInputChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="card p-4 mb-4"
    >
      <h2 className="h4 mb-4">
        {editingVenue ? 'Edit venue' : 'Add a new venue'}
      </h2>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Venue name
        </label>
        <input
          id="name"
          name="name"
          className="form-control"
          value={venueForm.name}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          rows="4"
          value={venueForm.description}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="price" className="form-label">
            Price per night ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            className="form-control"
            value={venueForm.price}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="maxGuests" className="form-label">
            Maximum guests
          </label>
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            className="form-control"
            value={venueForm.maxGuests}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="imageUrl" className="form-label">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          className="form-control"
          value={venueForm.imageUrl}
          onChange={onInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="imageAlt" className="form-label">
          Image description
        </label>
        <input
          id="imageAlt"
          name="imageAlt"
          className="form-control"
          value={venueForm.imageAlt}
          onChange={onInputChange}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            id="city"
            name="city"
            className="form-control"
            value={venueForm.city}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            id="country"
            name="country"
            className="form-control"
            value={venueForm.country}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="d-flex gap-2 mt-2">
        <button
          type="submit"
          className="btn btn-holidaze"
          disabled={creating || updating}
        >
          {editingVenue
            ? updating
              ? 'Saving...'
              : 'Save changes'
            : creating
              ? 'Creating...'
              : 'Create venue'}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={creating || updating}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default VenueForm
