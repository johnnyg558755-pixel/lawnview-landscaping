import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />
      <Helmet>
        <title>About Lawnview Landscaping</title>

        <meta
          name="description"
          content="Learn about Lawnview Landscaping and our commitment to reliable lawn care and customer satisfaction in Mesquite, Texas."
        />
      </Helmet>

      <main>
        <section className="about-hero">
          <p className="section-label">Our Story</p>
          <h1>Local roots. Dependable lawn care.</h1>
          <p>
            Lawnview was created to help homeowners throughout Mesquite take
            pride in the place they call home.
          </p>
        </section>

        <section className="about-story">
          <div className="about-story-image"></div>

          <div className="about-story-content">
            <p className="section-label">Why Lawnview?</p>
            <h2>A name connected to home</h2>

            <p>
              The name Lawnview comes from a street near a place that was once
              home. That personal connection inspired a business built around
              something simple: helping people feel proud when they look at
              their own property.
            </p>

            <p>
              We believe a well-maintained yard does more than improve curb
              appeal. It makes a home feel cared for, welcoming, and ready to
              enjoy.
            </p>
          </div>
        </section>

        <section className="about-values">
          <p className="section-label">What You Can Expect</p>
          <h2>Service built on trust</h2>

          <div className="values-grid">
            <article className="value-card">
              <span>01</span>
              <h3>Dependable Service</h3>
              <p>We show up ready to work and respect your time.</p>
            </article>

            <article className="value-card">
              <span>02</span>
              <h3>Clear Communication</h3>
              <p>
                You receive straightforward information about what your
                property needs.
              </p>
            </article>

            <article className="value-card">
              <span>03</span>
              <h3>Pride in the Details</h3>
              <p>
                We approach every lawn with care and leave it looking clean and
                complete.
              </p>
            </article>
          </div>
        </section>

        <section className="about-cta">
          <p className="section-label">Your Property, Our Priority</p>
          <h2>Let’s give your lawn a better view.</h2>
          <p>
            Tell us about your property and receive a free estimate for the service
            you need.
          </p>

          <Link to="/estimate" className="page-estimate-button">
            Request a Free Estimate
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;