import { useState } from "react";

function toDateInputValue(job) {
  if (job.dateValue) return job.dateValue;

  const date = new Date(job.date);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toTimeInputValue(job) {
  if (job.timeValue) return job.timeValue;

  const match = job.time.match(/(\d+):(\d+)\s(AM|PM)/i);

  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function formatTime(timeValue) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`2026-01-01T${timeValue}`));
}

function JobDetailsModal({ job, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...job,
    dateValue: toDateInputValue(job),
    timeValue: toTimeInputValue(job),
    notes: job.notes || "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      ...formData,
      amount: Number(formData.amount),
      date: formatDate(formData.dateValue),
      time: formatTime(formData.timeValue),
    });
  }

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="admin-modal admin-add-inquiry-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">{job.id}</p>
            <h3 id="job-details-title">{job.customer}</h3>
          </div>

          <button
            className="admin-modal-close"
            type="button"
            aria-label="Close job"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Customer *</span>
              <input
                name="customer"
                type="text"
                value={formData.customer}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Service *</span>
              <input
                name="service"
                type="text"
                value={formData.service}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Service date *</span>
              <input
                name="dateValue"
                type="date"
                value={formData.dateValue}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Start time *</span>
              <input
                name="timeValue"
                type="time"
                value={formData.timeValue}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Address *</span>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Job amount *</span>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Status *</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
          </div>

          <label className="admin-form-field">
            <span>Job notes</span>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Record scope details, access instructions, or completion notes"
            />
          </label>

          <div className="admin-modal-actions">
            <button
              className="admin-secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="admin-primary-button" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default JobDetailsModal;