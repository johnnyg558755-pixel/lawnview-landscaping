import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";

function GalleryPage() {
  return (
    <div className="gallery-page">
      <Helmet>
        <title>Gallery | Lawnview Landscaping</title>

        <meta
          name="description"
          content="View examples of Lawnview Landscaping's lawn mowing, edging, mulching, and landscaping work in Mesquite, Texas."
        />
      </Helmet>
      <Navbar />

      <main>
        <section className="gallery-page-hero">
          <p className="section-label">Lawnview Portfolio</p>
          <h1>Lawnview Project Gallery</h1>
          <p>
            View examples of lawn maintenance, landscape improvements,
            property cleanups, and outdoor projects.
          </p>
        </section>

        <section className="gallery-page-content">
          <div className="gallery-grid">
            <article className="gallery-card">
              <img
                src="https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=900&q=80"
                alt="Freshly maintained lawn"
              />
              <div className="gallery-overlay">
                <h3>Weekly Lawn Maintenance</h3>
              </div>
            </article>

            <article className="gallery-card">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
                alt="Green landscape"
              />
              <div className="gallery-overlay">
                <h3>Landscape Enhancement</h3>
              </div>
            </article>

            <article className="gallery-card">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80"
                alt="Clean outdoor property"
              />
              <div className="gallery-overlay">
                <h3>Property Cleanup</h3>
              </div>
            </article>
          </div>
        </section>
      </main>

      
    </div>
  );
}

export default GalleryPage;