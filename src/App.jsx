import { Routes, Route } from "react-router-dom";
import "./App.css";

import GalleryPreview from "./components/GalleryPreview";
import Hero from "./components/Hero";
import Services from "./components/Services";
import GalleryPage from "./pages/GalleryPage";

function HomePage() {
  return (
    <div className="app">
      <Hero />
      <Services />
      <GalleryPreview />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
  );
}

export default App;