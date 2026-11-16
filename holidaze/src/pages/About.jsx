
import { Link } from 'react-router-dom'

function About() {
  return (
    <main>
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <p className="text-uppercase small fw-semibold mb-2">
              ABOUT US
            </p>

            <h1 className="display-5 fw-semibold mb-4">
              A little closer to calm.
            </h1>

            <p className="lead mb-5">
              Holidaze makes it easy to discover and book unique places
              to stay. From cosy city apartments to peaceful cabins
              surrounded by nature, we're here to help you find the
              perfect place for your next getaway.
            </p>

            <h2 className="h3 mb-3">Our mission</h2>

            <p className="text-secondary mb-5">
              We believe that great experiences begin with the right
              place to stay. Our goal is to make finding and booking
              accommodation simple, enjoyable and accessible.
            </p>

            <div className="p-4 rounded-4 bg-light">
              <h2 className="h3 mb-3">Find your next escape</h2>

              <p className="text-secondary">
                Wherever you're going, let Holidaze help you find
                a place to feel at home.
              </p>

              <Link to="/venues" className="btn btn-holidaze">
                Explore stays
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
