import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

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
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/inquiries">
            Inquiries
          </NavLink>

          <NavLink to="/admin/customers">
            Customers
          </NavLink>

          <NavLink to="/admin/estimates">
            Estimates
          </NavLink>

          <NavLink to="/admin/jobs">
            Jobs
          </NavLink>

          <NavLink to="/admin/schedule">
            Schedule
          </NavLink>

          <NavLink to="/admin/invoices">
            Invoices
          </NavLink>
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