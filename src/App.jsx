import { Routes, Route } from "react-router-dom";
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