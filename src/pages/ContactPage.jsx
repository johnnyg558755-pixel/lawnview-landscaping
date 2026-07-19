import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ContactPage() {
  return (
    <div className="contact-page">
      <Navbar />

      <main>
        <section className="contact-hero">
          <p className="section-label">Contact Lawnview</p>
          <h1>Let’s talk about your lawn.</h1>
          <p>
            Have a question or need lawn care in the Mesquite area? Call,
            text, or email Lawnview to get started.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-intro">
            <p className="section-label">Get in Touch</p>
            <h2>We’re ready to hear from you.</h2>
            <p>
              Reach out to discuss your property, the services you need, and
              how Lawnview can help keep your yard looking its best.
            </p>
            <Link to="/estimate" className="page-estimate-button">
              Request a Free Estimate
            </Link>
          </div>

          <div className="contact-cards">
            <article className="contact-card">
              <span className="contact-number">01</span>
              <h3>Call or Text</h3>
              <p>Speak directly with Lawnview about your lawn-care needs.</p>
              <a href="tel:+19724670903">(972) 467-0903</a>
            </article>

            <article className="contact-card">
              <span className="contact-number">02</span>
              <h3>Email</h3>
              <p>Send us details about your property and requested service.</p>
              <a href="mailto:johnnyg558755@gmail.com">
                johnnyg558755@gmail.com
              </a>
            </article>

            <article className="contact-card">
              <span className="contact-number">03</span>
              <h3>Service Area</h3>
              <p>
                Proudly serving homeowners in Mesquite and surrounding areas.
              </p>
              <strong>Mesquite, Texas</strong>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;