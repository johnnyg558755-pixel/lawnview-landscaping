import { NavLink, Outlet } from "react-router-dom";
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
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">L</span>

          <div>
            <h1>Lawnview</h1>
            <p>Admin Dashboard</p>
          </div>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/">View Website</NavLink>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;