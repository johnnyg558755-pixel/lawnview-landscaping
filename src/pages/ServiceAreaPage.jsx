import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function ServiceAreaPage() {
  return (
    <div className="service-area-page">
      <Navbar />

      <Helmet>
        <title>Service Area | Lawnview Landscaping</title>

        <meta
          name="description"
          content="Lawnview Landscaping provides professional lawn care in Mesquite, Texas and nearby communities. Check whether your property is within our service area."
        />
      </Helmet>

      <main>
        <section className="service-area-hero">
          <p className="section-label">Service Area</p>
          <h1>Local lawn care in Mesquite, Texas.</h1>
          <p>
            Lawnview proudly serves homeowners throughout Mesquite and may
            accept properties in nearby communities depending on location and
            availability.
          </p>
        </section>

        <section className="service-area-section">
          <div className="service-area-content">
            <p className="section-label">Where We Work</p>
            <h2>Serving Mesquite and nearby neighborhoods.</h2>

            <p>
              Our primary service area is Mesquite, Texas. Keeping our routes
              local allows us to provide reliable scheduling, quicker
              communication, and consistent lawn care.
            </p>

            <ul className="service-area-list">
              <li>Mesquite neighborhoods</li>
              <li>Residential properties</li>
              <li>Nearby areas based on availability</li>
            </ul>

            <p>
              Not sure whether your property is within our service area? Send
              us your address through the free estimate form and we’ll confirm
              availability.
            </p>

            <Link className="service-area-cta" to="/estimate">
              Check My Address
            </Link>
          </div>

          <div className="service-area-map">
            <iframe
              title="Lawnview Landscaping service area in Mesquite, Texas"
              src="https://www.google.com/maps?q=Mesquite%2C%20Texas&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ServiceAreaPage;