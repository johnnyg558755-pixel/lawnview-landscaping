import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import "./AdminLayout.css";

const adminLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/estimates", label: "Estimates" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/schedule", label: "Schedule" },
  { to: "/admin/invoices", label: "Invoices" },
];

function AdminLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="admin-layout">
      <header className="admin-mobile-header">
        <NavLink
          className="admin-mobile-brand"
          to="/admin"
          aria-label="Lawnview admin dashboard"
        >
          <span className="admin-brand-mark">L</span>

          <div>
            <strong>Lawnview</strong>
            <span>Admin</span>
          </div>
        </NavLink>

        <button
          className="admin-mobile-menu-button"
          type="button"
          aria-label={
            isMenuOpen
              ? "Close admin navigation"
              : "Open admin navigation"
          }
          aria-expanded={isMenuOpen}
          aria-controls="admin-sidebar"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <button
        className={`admin-sidebar-overlay ${
          isMenuOpen ? "is-visible" : ""
        }`}
        type="button"
        aria-label="Close admin navigation"
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${
          isMenuOpen ? "is-open" : ""
        }`}
      >
        <div className="admin-brand">
          <span className="admin-brand-mark">L</span>

          <div>
            <h1>Lawnview</h1>
            <p>Admin Dashboard</p>
          </div>
        </div>

        <nav
          className="admin-navigation"
          aria-label="Admin navigation"
        >
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
          >
            View Website
          </NavLink>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;