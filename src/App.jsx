import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { Helmet } from "react-helmet-async";

import GalleryPreview from "./components/GalleryPreview";
import Hero from "./components/Hero";
import Services from "./components/Services";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import EstimatePage from "./pages/EstimatePage";
import ServicesPage from "./pages/ServicesPage";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>
          Lawnview Landscaping | Professional Lawn Care in Mesquite, TX
        </title>
        <meta 
          name="description"
          content="Professional lawn mowing, edging, mulching, and landscaping service in Mesquite, Texas. Get a free estimate today."
        />
      </Helmet>

    <div className="app">
      <Hero />
      <Services />
      <GalleryPreview />
      <Footer />
    </div>
    </>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    
    const elements = document.querySelectorAll(`
      .services h2,
      .services .section-intro,
      .service-card,
      .gallery h2,
      .gallery .section-intro,
      .gallery-card,
      .gallery-page-hero,
      .about-story-image,
      .about-story-content,
      .value-card,
      .about-cta,
      .contact-intro,
      .contact-card,
      .estimate-intro,
      .estimate-form,
      .footer-content
    `);

    elements.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.transitionDelay = `${(index % 3) * 100}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/estimate" element={<EstimatePage />} />
      <Route path="/services" element={<ServicesPage />} />
    </Routes>
  );
}

export default App;