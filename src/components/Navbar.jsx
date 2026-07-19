import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <h2>Lawnview Landscaping</h2>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={menuOpen ? "nav-links open" : "nav-links"}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>

        <li>
          <a href="#services" onClick={closeMenu}>
            Services
          </a>
        </li>

        <li>
          <Link to="/gallery" onClick={closeMenu}>
            Gallery
          </Link>
        </li>

        <li>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
        </li>

        <li>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </li>

        <li>
          <Link
            to="/estimate"
            className="nav-estimate-button"
            onClick={closeMenu}
          >
            Free Estimate
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;