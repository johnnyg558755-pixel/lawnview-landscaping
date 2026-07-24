import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

const services = [
  {
    title: "Lawn Mowing",
    icon: "🌿",
    image: heroImage,
    alt: "Freshly mowed residential lawn",
    description:
      "A properly maintained lawn starts with consistent mowing. Lawnview provides clean, professional mowing that keeps your property looking healthy and well cared for.",
    features: [
      "Consistent cutting height",
      "Grass clipping cleanup",
      "Clean professional finish",
      "Reliable scheduling",
    ],
  },
  {
    title: "Edging & Trimming",
    icon: "✂️",
    image: heroImage,
    alt: "Clean lawn edging beside a sidewalk",
    description:
      "Sharp edging and detailed trimming create the clean borders that make a professionally maintained lawn stand out.",
    features: [
      "Sidewalk and driveway edging",
      "Fence-line trimming",
      "Flower-bed detailing",
      "Hard-to-reach areas",
    ],
  },
  {
    title: "Yard Cleanups",
    icon: "🍂",
    image: heroImage,
    alt: "Residential yard being cleaned of leaves and debris",
    description:
      "We remove leaves, branches, overgrowth, and unwanted debris to help restore a cleaner and more manageable outdoor space.",
    features: [
      "Leaf and branch cleanup",
      "Overgrown-area clearing",
      "Storm debris removal",
      "Seasonal property cleanup",
    ],
  },
  {
    title: "Mulch Installation",
    icon: "🌱",
    image: heroImage,
    alt: "Fresh mulch installed around a landscaped flower bed",
    description:
      "Fresh mulch improves curb appeal while helping flower beds retain moisture, control weeds, and protect plant roots.",
    features: [
      "Fresh bed preparation",
      "Even mulch installation",
      "Improved moisture retention",
      "Cleaner curb appeal",
    ],
  },
];

const faqs = [
  {
    question: "Do you offer free estimates?",
    answer:
      "Yes. Lawnview offers free estimates so you can understand the recommended work and expected price before scheduling service.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We primarily serve Mesquite and selected nearby communities, including Balch Springs, Sunnyvale, Garland, and East Dallas.",
  },
  {
    question: "How often should my lawn be mowed?",
    answer:
      "Most lawns benefit from weekly service during the active growing season. The ideal schedule may change depending on weather, grass type, and growth rate.",
  },
  {
    question: "Do I need to be home during the service?",
    answer:
      "No. As long as we can safely access the areas being serviced and any gates are unlocked, you do not normally need to be home.",
  },
  {
    question: "What happens if it rains on my scheduled day?",
    answer:
      "If weather conditions make the work unsafe or could damage your lawn, we will communicate with you and arrange another service time.",
  },
];

function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }
  return (
    <div className="services-page">
      <Helmet>
        <title>Professional Lawn Care Services | Lawnview Landscaping</title>

        <meta
          name="description"
          content="Professional lawn mowing, edging, mulching, and yard cleanup services in Mesquite, Texas. Request your free estimate today."
        />
      </Helmet>

      <Navbar />

      <section className="services-hero">
        <p className="section-label">OUR SERVICES</p>

        <h1>Professional Lawn Care Services</h1>

        <p>
          Reliable lawn maintenance and landscaping solutions designed to keep
          your property looking its best.
        </p>
      </section>

      <section className="services-intro">
        <h2>Keeping Your Property Beautiful</h2>

        <p>
          From routine lawn maintenance to seasonal cleanups, Lawnview
          Landscaping delivers dependable service with attention to detail. We
          believe every property deserves professional care.
        </p>
      </section>

      <section className="services-list">
        {services.map((service, index) => (
          <article
            className={`service-feature ${
              index % 2 !== 0 ? "service-feature-reverse" : ""
            }`}
            key={service.title}
          >
            <div className="service-image">
              <img
                src={service.image}
                alt={service.alt}
                loading="lazy"
              />
            </div>

            <div className="service-text">
              <span className="service-icon" aria-hidden="true">
                {service.icon}
              </span>

              <h2>{service.title}</h2>

              <p>{service.description}</p>

              <ul>
                {service.features.map((feature) => (
                  <li key={feature}>
                    <span aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/estimate" className="page-estimate-button">
                Get a Free Estimate
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="why-choose">

        <p className="section-label">WHY CHOOSE LAWNVIEW</p>

        <h2>Why Homeowners Choose Lawnview</h2>

        <p className="why-intro">
          We're committed to delivering dependable service, honest communication,
          and professional results that help your property stand out.
        </p>

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">🕒</div>
            <h3>Reliable Scheduling</h3>
            <p>
              We show up when promised and communicate clearly if plans ever change.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">⭐</div>
            <h3>Attention to Detail</h3>
            <p>
              Every property receives the care and precision it deserves.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">💵</div>
            <h3>Honest Pricing</h3>
            <p>
              Straightforward estimates with no hidden surprises.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">📍</div>
            <h3>Locally Owned</h3>
            <p>
              Proudly serving Mesquite and surrounding communities.
            </p>
          </div>

        </div>

      </section>

      <section className="service-area-section">
        <p className="section-label">SERVICE AREA</p>

        <h2>Proudly Serving Mesquite and Nearby Communities</h2>

        <p className="service-area-intro">
          Lawnview provides dependable lawn care for homeowners throughout Mesquite
          and selected surrounding areas.
        </p>

        <div className="service-area-grid">
          <div className="service-area-card">📍 Mesquite</div>
          <div className="service-area-card">📍 Balch Springs</div>
          <div className="service-area-card">📍 Garland</div>
          <div className="service-area-card">📍 Sunnyvale</div>
          <div className="service-area-card">📍 East Dallas</div>
        </div>
      </section>

      <section className="faq-section">
        <p className="section-label">FREQUENTLY ASKED QUESTIONS</p>

        <h2>Questions About Our Lawn Care Services</h2>

        <p className="faq-intro">
          Find answers to common questions about scheduling, service areas, estimates,
          and lawn maintenance.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={faq.question}>
                <button
                  className="faq-question"
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>

                  <span className="faq-symbol" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="services-cta">
        <div className="services-cta-content">
          <p className="section-label">GET STARTED</p>

          <h2>Ready for a Better-Looking Lawn?</h2>

          <p>
            Let Lawnview handle the mowing, trimming, cleanup, and maintenance so you
            can enjoy a cleaner, healthier outdoor space.
          </p>

          <Link to="/estimate" className="services-cta-button">
            Request Your Free Estimate
          </Link>
        </div>
      </section>


      <Footer />
    </div>
  );
}

export default ServicesPage;