function GalleryPreview() {
  return (
    <section className="gallery" id="gallery">
      <h2>Our Work</h2>

      <p className="section-intro">
        Every lawn deserves professional care. Here are examples of the
        beautiful outdoor spaces we're proud to create.
      </p>

      <div className="gallery-grid">

        <div className="gallery-card">
          <img
            src="https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=900&q=80"
            alt="Freshly mowed lawn"
          />

          <div className="gallery-overlay">
            <h3>Weekly Lawn Maintenance</h3>
          </div>
        </div>

        <div className="gallery-card">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80"
            alt="Landscape design"
          />

          <div className="gallery-overlay">
            <h3>Landscape Enhancement</h3>
          </div>
        </div>

        <div className="gallery-card">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80"
            alt="Clean property"
          />

          <div className="gallery-overlay">
            <h3>Property Cleanup</h3>
          </div>
        </div>

      </div>
    </section>
  );
}

export default GalleryPreview;