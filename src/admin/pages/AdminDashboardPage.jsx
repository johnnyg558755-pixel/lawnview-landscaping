import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchEstimates,
  fetchInquiries,
  fetchInvoices,
  fetchJobs,
} from "../services/adminData";


function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
}

function getJobDate(job) {
  return (
    job.appointmentDateValue ||
    job.dateValue ||
    job.appointmentDate ||
    job.date ||
    ""
  );
}

function getJobTime(job) {
  return job.appointmentTime || job.time || "";
}

function formatJobDate(value) {
  if (!value) return "Date not set";

  const date = new Date(
    value.includes("T") ? value : `${value}T12:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatJobTime(value) {
  if (!value) return "Time not set";

  if (value.includes("AM") || value.includes("PM")) {
    return value;
  }

  const [hours, minutes] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInvoiceStatus(invoice) {
  const today = new Date().toISOString().split("T")[0];

  if (
    invoice.status === "Unpaid" &&
    invoice.dueValue &&
    invoice.dueValue < today
  ) {
    return "Overdue";
  }

  return invoice.status;
}

function AdminDashboardPage() {
  const navigate = useNavigate();

    const [inquiries, setInquiries] = useState([]);
    const [estimates, setEstimates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataError, setDataError] = useState("");

    useEffect(() => {
      let isActive = true;

      async function loadDashboard() {
        try {
          const [
            cloudInquiries,
            cloudEstimates,
            cloudJobs,
            cloudInvoices,
          ] = await Promise.all([
            fetchInquiries(),
            fetchEstimates(),
            fetchJobs(),
            fetchInvoices(),
          ]);

          if (isActive) {
            setInquiries(cloudInquiries);
            setEstimates(cloudEstimates);
            setJobs(cloudJobs);
            setInvoices(cloudInvoices);
          }
        } catch (error) {
          console.error("Unable to load dashboard:", error);

          if (isActive) {
            setDataError(
              "Unable to load dashboard data. Check your connection and try again.",
            );
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }

      loadDashboard();

      return () => {
        isActive = false;
      };
    }, []);

  const newInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "New",
  );

  const pendingEstimates = estimates.filter((estimate) =>
    ["Draft", "Sent"].includes(estimate.status),
  );

  const scheduledJobs = useMemo(
    () =>
      jobs
        .filter((job) => job.status === "Scheduled")
        .sort((firstJob, secondJob) => {
          const firstDate = new Date(getJobDate(firstJob)).getTime();
          const secondDate = new Date(getJobDate(secondJob)).getTime();

          return firstDate - secondDate;
        }),
    [jobs],
  );

  const outstandingInvoices = invoices.filter((invoice) =>
    ["Unpaid", "Overdue"].includes(getInvoiceStatus(invoice)),
  );

  const outstandingTotal = outstandingInvoices.reduce(
    (total, invoice) => total + Number(invoice.amount),
    0,
  );

  const recentInquiries = inquiries.slice(0, 3);
  const upcomingJobs = scheduledJobs.slice(0, 3);

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

        <button
          className="admin-primary-button"
          type="button"
          onClick={() => navigate("/admin/inquiries")}
        >
          Add Inquiry
        </button>
      </header>

      {dataError && (
        <p className="admin-login-error" role="alert">
          {dataError}
        </p>
      )}

      {isLoading && (
        <p className="admin-loading-message">
          Loading dashboard…
        </p>
      )}

      <section className="admin-metrics" aria-label="Business overview">
        <article className="admin-metric-card">
          <p>New Inquiries</p>
          <strong>{newInquiries.length}</strong>
          <span>Awaiting follow-up</span>
        </article>

        <article className="admin-metric-card">
          <p>Pending Estimates</p>
          <strong>{pendingEstimates.length}</strong>
          <span>Draft or awaiting approval</span>
        </article>

        <article className="admin-metric-card">
          <p>Scheduled Jobs</p>
          <strong>{scheduledJobs.length}</strong>
          <span>Upcoming work</span>
        </article>

        <article className="admin-metric-card">
          <p>Unpaid Invoices</p>
          <strong>{formatCurrency(outstandingTotal)}</strong>
          <span>
            Across {outstandingInvoices.length}{" "}
            {outstandingInvoices.length === 1
              ? "invoice"
              : "invoices"}
          </span>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Lead activity</p>
              <h3>Recent inquiries</h3>
            </div>

            <Link to="/admin/inquiries">View all</Link>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="admin-dashboard-list">
              {recentInquiries.map((inquiry) => (
                <div
                  className="admin-dashboard-list-item"
                  key={inquiry.id}
                >
                  <div>
                    <strong>
                      {inquiry.name ||
                        inquiry.customer ||
                        "Unnamed lead"}
                    </strong>

                    <span>
                      {inquiry.service || "Service not selected"}
                    </span>
                  </div>

                  <div className="admin-dashboard-list-meta">
                    <span
                      className={`admin-status admin-status-${inquiry.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {inquiry.status}
                    </span>

                    <small>
                      {inquiry.received ||
                        inquiry.date ||
                        inquiry.id}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <h4>Your newest leads will appear here</h4>
              <p>
                Phase 4 will connect website estimate requests directly
                to this dashboard.
              </p>
            </div>
          )}
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">Upcoming work</p>
              <h3>Schedule</h3>
            </div>

            <Link to="/admin/schedule">View schedule</Link>
          </div>

          {upcomingJobs.length > 0 ? (
            <div className="admin-dashboard-list">
              {upcomingJobs.map((job) => (
                <div
                  className="admin-dashboard-list-item"
                  key={job.id}
                >
                  <div>
                    <strong>
                      {job.customer || job.name || "Customer"}
                    </strong>

                    <span>{job.service}</span>
                  </div>

                  <div className="admin-dashboard-list-meta">
                    <strong>{formatJobDate(getJobDate(job))}</strong>
                    <small>{formatJobTime(getJobTime(job))}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <h4>No jobs scheduled yet</h4>
              <p>
                Approved estimates can be converted into scheduled
                Lawnview jobs.
              </p>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

export default AdminDashboardPage;