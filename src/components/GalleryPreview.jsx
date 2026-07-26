import { Link } from "react-router-dom";

function GalleryPreview() {
  return (
    <section className="gallery" id="gallery">
      <p className="section-label">Real Local Results</p>
      <h2>Our Work</h2>

      <p className="section-intro">
        Lawnview is documenting real projects around Mesquite so homeowners
        can see authentic before-and-after results.
      </p>

      <div className="gallery-preview-empty">
        <div className="gallery-preview-icon" aria-hidden="true">
          🌱
        </div>

        <div className="gallery-preview-content">
          <h3>Our project gallery is growing.</h3>

          <p>
            Real lawn maintenance, edging, cleanup, and landscaping photos will
            be added as projects are completed.
          </p>
        </div>

        <div className="gallery-preview-actions">
          <Link className="gallery-preview-primary" to="/estimate">
            Start Your Project
          </Link>

          <Link className="gallery-preview-secondary" to="/gallery">
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;