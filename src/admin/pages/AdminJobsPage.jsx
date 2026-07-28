import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const sampleJobs = [
  {
    id: "JOB-1003",
    customer: "Maria Hernandez",
    service: "Weekly Lawn Mowing",
    date: "Jul 28, 2026",
    time: "10:00 AM",
    address: "Mesquite, TX",
    amount: 55,
    status: "Scheduled",
  },
  {
    id: "JOB-1002",
    customer: "David Thompson",
    service: "Property Cleanup",
    date: "Jul 27, 2026",
    time: "1:30 PM",
    address: "Mesquite, TX",
    amount: 175,
    status: "In Progress",
  },
  {
    id: "JOB-1001",
    customer: "Angela Williams",
    service: "Mulch Installation",
    date: "Jul 25, 2026",
    time: "9:00 AM",
    address: "Mesquite, TX",
    amount: 285,
    status: "Completed",
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function AdminJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredJobs = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return sampleJobs.filter((job) => {
      const matchesSearch =
        job.customer.toLowerCase().includes(search) ||
        job.service.toLowerCase().includes(search) ||
        job.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Jobs | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Operations</p>
          <h2>Jobs</h2>
          <p>Track Lawnview work from scheduling through completion.</p>
        </div>

        <button className="admin-primary-button" type="button">
          Create Job
        </button>
      </header>

      <section className="admin-metrics admin-estimate-metrics">
        <article className="admin-metric-card">
          <p>Scheduled</p>
          <strong>1</strong>
          <span>Upcoming work</span>
        </article>

        <article className="admin-metric-card">
          <p>In Progress</p>
          <strong>1</strong>
          <span>Currently being serviced</span>
        </article>

        <article className="admin-metric-card">
          <p>Completed</p>
          <strong>1</strong>
          <span>Finished jobs</span>
        </article>
      </section>

      <section className="admin-panel admin-inquiries-panel">
        <div className="admin-toolbar">
          <label className="admin-search">
            <span className="sr-only">Search jobs</span>
            <input
              type="search"
              placeholder="Search by customer, service, or job ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="admin-filter">
            <span>Filter by status</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All jobs</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table admin-jobs-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Appointment</th>
                <th>Amount</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.id}</strong>
                    <span>{job.address}</span>
                  </td>

                  <td>{job.customer}</td>
                  <td>{job.service}</td>

                  <td>
                    <strong>{job.date}</strong>
                    <span>{job.time}</span>
                  </td>

                  <td>
                    <strong>{formatCurrency(job.amount)}</strong>
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${job.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td>
                    <button className="admin-text-button" type="button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="admin-empty-state">
            <h4>No matching jobs</h4>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default AdminJobsPage;