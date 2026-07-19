import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EstimatePage() {const [status, setStatus] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  setIsSubmitting(true);
  setStatus("");

  try {
    const response = await fetch("https://formspree.io/f/mnjedlga", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("The estimate request could not be submitted.");
    }

    form.reset();
    setStatus("success");
  } catch {
    setStatus("error");
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <div className="estimate-page">
      <Navbar />

      <main>
        <section className="estimate-hero">
          <p className="section-label">Free Estimate</p>
          <h1>Tell us about your property.</h1>
          <p>
            Complete the form below and Lawnview will contact you to discuss
            your lawn-care needs.
          </p>
        </section>

        <section className="estimate-section">
          <div className="estimate-intro">
            <p className="section-label">Request an Estimate</p>
            <h2>Let’s get your lawn looking its best.</h2>
            <p>
              Provide as much information as you can. We’ll review your request
              and reach out to discuss the next step.
            </p>
          </div>

          <form className="estimate-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(972) 555-1234"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Property Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street address and city"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service">Service Needed</label>
              <select id="service" name="service" required>
                <option value="">Select a service</option>
                <option value="lawn-mowing">Lawn Mowing</option>
                <option value="edging-trimming">Edging & Trimming</option>
                <option value="mulch-flower-beds">
                  Mulch & Flower Beds
                </option>
                <option value="yard-cleanup">Yard Cleanup</option>
                <option value="multiple-services">Multiple Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Service Frequency</label>
              <select id="frequency" name="frequency">
                <option value="">Select a frequency</option>
                <option value="one-time">One-Time Service</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every Two Weeks</option>
                <option value="unsure">Not Sure Yet</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="details">Property Details</label>
              <textarea
                id="details"
                name="details"
                rows="6"
                placeholder="Tell us about your lawn, its approximate size, and the work you need."
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="contact-method">
                Preferred Contact Method
              </label>
              <select id="contact-method" name="contactMethod">
                <option value="phone">Phone Call</option>
                <option value="text">Text Message</option>
                <option value="email">Email</option>
              </select>
            </div>

            <button 
              type="submit"
              className="estimate-submit"
              disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Request..." : "Request My Free Estimate"}
            </button>

            {status === "success" && (
              <p className="form-message form-success">
                Thank you! Your estimate request was sent successfully. Lawnview will
                contact you soon.
              </p>
            )}

            {status === "error" && (
              <p className="form-message form-error">
                Your request could not be sent. Please try again or call Lawnview at
                (972) 467-0903.
              </p>
            )}

            <p className="form-note">
              Lawnview will only use your information to respond to your
              estimate request.
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default EstimatePage;