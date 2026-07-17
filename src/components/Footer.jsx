import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>Lawnview</h2>
          <p>
            Reliable lawn care helping properties throughout Mesquite look their
            best.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-services">
          <h3>Services</h3>
          <p>Lawn Mowing</p>
          <p>Edging & Trimming</p>
          <p>Mulch & Flower Beds</p>
          <p>Yard Cleanups</p>
        </div>

        <div className="footer-contact">
          <h3>Service Area</h3>
          <p>Mesquite, Texas</p>
          <p>Dallas–Fort Worth Area</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Lawnview. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;