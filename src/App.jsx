import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import GalleryPreview from "./components/GalleryPreview";
import Hero from "./components/Hero";
import Services from "./components/Services";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import EstimatePage from "./pages/EstimatePage";

function HomePage() {
  return (
    <div className="app">
      <Hero />
      <Services />
      <GalleryPreview />
      <Footer />
    </div>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
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
    </Routes>
  );
}

export default App;