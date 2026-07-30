import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const JOBS_STORAGE_KEY = "lawnview-admin-jobs";

function loadJobs() {
  try {
    return JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function getDateValue(job) {
  if (job.dateValue) return job.dateValue;

  const date = new Date(job.date);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatHeading(dateValue) {
  const today = new Date();
  const date = new Date(`${dateValue}T12:00:00`);

  const todayValue = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowValue = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");

  if (dateValue === todayValue) return "Today";
  if (dateValue === tomorrowValue) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function AdminSchedulePage() {
  const [jobs] = useState(loadJobs);
  const [statusFilter, setStatusFilter] = useState("Active");

  const todayValue = useMemo(() => {
    const today = new Date();

    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
  }, []);

  const scheduledJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const hasDate = Boolean(getDateValue(job));

        if (!hasDate) return false;

        if (statusFilter === "All") return true;

        if (statusFilter === "Active") {
          return ["Scheduled", "In Progress"].includes(job.status);
        }

        return job.status === statusFilter;
      })
      .sort((firstJob, secondJob) => {
        const firstDate = `${getDateValue(firstJob)} ${
          firstJob.timeValue || firstJob.time
        }`;

        const secondDate = `${getDateValue(secondJob)} ${
          secondJob.timeValue || secondJob.time
        }`;

        return firstDate.localeCompare(secondDate);
      });
  }, [jobs, statusFilter]);

  const groupedJobs = useMemo(() => {
    return scheduledJobs.reduce((groups, job) => {
      const dateValue = getDateValue(job);

      if (!groups[dateValue]) {
        groups[dateValue] = [];
      }

      groups[dateValue].push(job);
      return groups;
    }, {});
  }, [scheduledJobs]);

  const todayJobs = jobs.filter(
    (job) =>
      getDateValue(job) === todayValue &&
      ["Scheduled", "In Progress"].includes(job.status),
  ).length;

  const upcomingJobs = jobs.filter(
    (job) =>
      getDateValue(job) > todayValue &&
      ["Scheduled", "In Progress"].includes(job.status),
  ).length;

  return (
    <>
      <Helmet>
        <title>Schedule | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Calendar</p>
          <h2>Schedule</h2>
          <p>See Lawnview appointments generated from scheduled jobs.</p>
        </div>

        <label className="admin-filter admin-schedule-filter">
          <span>Show</span>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="Active">Active jobs</option>
            <option value="All">All jobs</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
      </header>

      <section className="admin-metrics admin-schedule-metrics">
        <article className="admin-metric-card">
          <p>Today</p>
          <strong>{todayJobs}</strong>
          <span>Appointments today</span>
        </article>

        <article className="admin-metric-card">
          <p>Upcoming</p>
          <strong>{upcomingJobs}</strong>
          <span>Future appointments</span>
        </article>
      </section>

      <section className="admin-schedule-list">
        {Object.entries(groupedJobs).map(([dateValue, dateJobs]) => (
          <article className="admin-schedule-day" key={dateValue}>
            <div className="admin-schedule-day-heading">
              <div>
                <p className="admin-eyebrow">{dateValue}</p>
                <h3>{formatHeading(dateValue)}</h3>
              </div>

              <span>
                {dateJobs.length} {dateJobs.length === 1 ? "job" : "jobs"}
              </span>
            </div>

            <div className="admin-schedule-items">
              {dateJobs.map((job) => (
                <div className="admin-schedule-item" key={job.id}>
                  <div className="admin-schedule-time">
                    <strong>{job.time}</strong>
                    <span>{job.id}</span>
                  </div>

                  <div className="admin-schedule-details">
                    <strong>{job.customer}</strong>
                    <span>{job.service}</span>
                    <small>{job.address}</small>
                  </div>

                  <span
                    className={`admin-status admin-status-${job.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}

        {Object.keys(groupedJobs).length === 0 && (
          <article className="admin-panel">
            <div className="admin-empty-state">
              <h4>No scheduled jobs found</h4>
              <p>Create or update a job to add it to the schedule.</p>
            </div>
          </article>
        )}
      </section>
    </>
  );
}

export default AdminSchedulePage;