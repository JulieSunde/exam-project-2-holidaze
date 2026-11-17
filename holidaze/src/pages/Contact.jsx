import { useState } from 'react'
import { Link } from 'react-router-dom'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })

    setIsSubmitted(true)
  }

  function handleNewMessage() {
    setIsSubmitted(false)
  }

  return (
    <main>
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <p className="text-uppercase small fw-semibold mb-2">
              GET IN TOUCH
            </p>

            <h1 className="display-5 fw-semibold mb-3">
              We'd love to hear from you.
            </h1>

            <p className="lead text-secondary mb-5">
              Have a question about a booking, a venue or your Holidaze
              experience? Send us a message and we'll be happy to help.
            </p>

            {isSubmitted ? (
              <div className="bg-light rounded-4 p-5 text-center" role="status">
                <h2 className="h3 mb-3">Thank you!</h2>

                <p className="text-secondary mb-4">
                  Your message has been received. We appreciate you getting in
                  touch with Holidaze.
                </p>

                <button
                  type="button"
                  className="btn btn-holidaze"
                  onClick={handleNewMessage}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Your name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your message about?"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label">
                    Your message
                  </label>

                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-holidaze">
                  Send message
                </button>
              </form>
            )}

            <div className="mt-5 pt-4 border-top">
              <h2 className="h4 mb-3">Planning your next escape?</h2>

              <p className="text-secondary">
                Explore our available stays and find somewhere special for your
                next trip.
              </p>

              <Link to="/venues" className="btn btn-outline-dark">
                Explore stays
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
