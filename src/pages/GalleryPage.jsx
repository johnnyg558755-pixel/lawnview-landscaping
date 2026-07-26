import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function GalleryPage() {
  const projects = [];

  return (
    <div className="gallery-page">
      <Helmet>
        <title>Project Gallery | Lawnview Landscaping</title>

        <meta
          name="description"
          content="View before-and-after lawn care projects completed by Lawnview Landscaping in Mesquite, Texas."
        />
      </Helmet>

      <Navbar />

      <main>
        <section className="gallery-page-hero">
          <p className="section-label">Real Local Projects</p>
          <h1>Lawnview Project Gallery</h1>

          <p>
            Explore before-and-after results from lawn maintenance, property
            cleanups, edging, trimming, and landscape improvements completed
            around Mesquite.
          </p>
        </section>

        <section className="gallery-page-content">
          {projects.length > 0 ? (
            <div className="project-gallery-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="before-after-grid">
                    <figure>
                      <img src={project.before} alt={project.beforeAlt} />
                      <figcaption>Before</figcaption>
                    </figure>

                    <figure>
                      <img src={project.after} alt={project.afterAlt} />
                      <figcaption>After</figcaption>
                    </figure>
                  </div>

                  <div className="project-info">
                    <p className="project-service">{project.service}</p>
                    <h2>{project.title}</h2>
                    <p>{project.location}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <span className="gallery-empty-icon" aria-hidden="true">
                🌱
              </span>

              <p className="section-label">Portfolio Growing Soon</p>
              <h2>Real Lawnview projects are on the way.</h2>

              <p>
                We’re currently documenting our local work so you can see
                authentic before-and-after results from properties around
                Mesquite.
              </p>

              <Link className="gallery-estimate-button" to="/estimate">
                Request a Free Estimate
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default GalleryPage;