import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import CreateJobModal from "../components/CreateJobModal";
import JobDetailsModal from "../components/JobDetailsModal";
import {
  createJob,
  fetchCustomers,
  fetchEstimates,
  fetchJobs,
  updateJob,
} from "../services/adminData";



function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [approvedEstimates, setApprovedEstimates] =
    useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadJobData() {
      try {
        const [cloudJobs, cloudEstimates, cloudCustomers] =
          await Promise.all([
            fetchJobs(),
            fetchEstimates(),
            fetchCustomers(),
          ]);

        if (isActive) {
          setJobs(cloudJobs);
          setApprovedEstimates(
            cloudEstimates.filter(
              (estimate) => estimate.status === "Approved",
            ),
          );
          setCustomers(cloudCustomers);
        }
      } catch (error) {
        console.error("Unable to load jobs:", error);

        if (isActive) {
          setDataError(
            "Unable to load jobs. Check your connection and try again.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadJobData();

    return () => {
      isActive = false;
    };
  }, []);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");


async function handleCreateJob(job) {
  setDataError("");

  try {
    const savedJob = await createJob(job);

    setJobs((currentJobs) => [
      savedJob,
      ...currentJobs,
    ]);
    setIsCreateModalOpen(false);
  } catch (error) {
    console.error("Unable to create job:", error);
    setDataError(
      "The job could not be saved. Please try again.",
    );
  }
}

async function handleSaveJob(updatedJob) {
  setDataError("");

  try {
    const savedJob = await updateJob(updatedJob);

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === savedJob.id ? savedJob : job,
      ),
    );

    setSelectedJob(null);
  } catch (error) {
    console.error("Unable to update job:", error);
    setDataError("The job changes could not be saved.");
  }
}

  const filteredJobs = useMemo(() => {
  const search = searchTerm.toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        job.customer.toLowerCase().includes(search) ||
        job.service.toLowerCase().includes(search) ||
        job.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

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

        <button 
          className="admin-primary-button" 
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Job
        </button>
      </header>

      {dataError && (
        <p className="admin-login-error" role="alert">
          {dataError}
        </p>
      )}

      {isLoading && (
        <p className="admin-loading-message">
          Loading jobs…
        </p>
      )}

      <section className="admin-metrics admin-estimate-metrics">
        <article className="admin-metric-card">
          <p>Scheduled</p>
          <strong>
            {jobs.filter((job) => job.status === "Scheduled").length}
          </strong>
          <span>Upcoming work</span>
        </article>

        <article className="admin-metric-card">
          <p>In Progress</p>
          <strong>
            {jobs.filter((job) => job.status === "In Progress").length}
          </strong>
          <span>Currently being serviced</span>
        </article>

        <article className="admin-metric-card">
          <p>Completed</p>
          <strong>
            {jobs.filter((job) => job.status === "Completed").length}
          </strong>
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
                    <button 
                      className="admin-text-button" 
                      type="button"
                      onClick={() => setSelectedJob({ ...job })}
                    >
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
      {isCreateModalOpen && (
        <CreateJobModal
          approvedEstimates={approvedEstimates}
          customers={customers}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateJob}
        />
      )}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleSaveJob}
        />
      )}
    </>
  );
}

export default AdminJobsPage;