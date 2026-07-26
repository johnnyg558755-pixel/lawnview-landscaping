import { Helmet } from "react-helmet-async";

function AdminDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Overview</p>
          <h2>Dashboard</h2>
          <p>Manage Lawnview’s leads, jobs, estimates, and payments.</p>
        </div>

        <button className="admin-primary-button" type="button">
          Add Inquiry
        </button>
      </header>

      <section className="admin-metrics" aria-label="Business overview">
        <article className="admin-metric-card">
          <p>New Inquiries</p>
          <strong>4</strong>
          <span>Awaiting follow-up</span>
        </article>

        <article className="admin-metric-card">
          <p>Pending Estimates</p>
          <strong>3</strong>
          <span>Needs customer approval</span>
        </article>

        <article className="admin-metric-card">
          <p>Scheduled Jobs</p>
          <strong>5</strong>
          <span>This week</span>
        </article>

        <article className="admin-metric-card">
          <p>Unpaid Invoices</p>
          <strong>$420</strong>
          <span>Across 2 customers</span>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Lead activity</p>
              <h3>Recent inquiries</h3>
            </div>

            <a href="/admin/inquiries">View all</a>
          </div>

          <div className="admin-empty-state">
            <h4>Your newest leads will appear here</h4>
            <p>
              During Phase 4, estimate requests from the Lawnview website will
              automatically enter this dashboard.
            </p>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Upcoming work</p>
              <h3>Schedule</h3>
            </div>

            <a href="/admin/schedule">View schedule</a>
          </div>

          <div className="admin-empty-state">
            <h4>No jobs scheduled yet</h4>
            <p>Approved estimates will become scheduled Lawnview jobs.</p>
          </div>
        </article>
      </section>
    </>
  );
}

export default AdminDashboardPage;