import { useState } from "react";

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

function CreateJobModal({
  approvedEstimates,
  customers,
  onClose,
  onCreate,
}) {
  const firstEstimate = approvedEstimates[0];

  const findAddress = (customerName) => {
    return (
      customers.find((customer) => customer.name === customerName)?.address ||
      ""
    );
  };

  const [formData, setFormData] = useState({
    estimateId: firstEstimate?.id || "",
    customer: firstEstimate?.customer || "",
    service: firstEstimate?.service || "Lawn Mowing",
    amount: firstEstimate?.amount || "",
    address: findAddress(firstEstimate?.customer),
    dateValue: "",
    timeValue: "",
    status: "Scheduled",
    notes: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleEstimateChange(event) {
    const estimateId = event.target.value;
    const estimate = approvedEstimates.find(
      (item) => item.id === estimateId,
    );

    if (!estimate) {
      setFormData((currentData) => ({
        ...currentData,
        estimateId: "",
      }));
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      estimateId: estimate.id,
      customer: estimate.customer,
      service: estimate.service,
      amount: estimate.amount,
      address: findAddress(estimate.customer),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onCreate({
      ...formData,
      id: `JOB-${Date.now().toString().slice(-6)}`,
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
        aria-labelledby="create-job-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">New work order</p>
            <h3 id="create-job-title">Create Job</h3>
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
          <label className="admin-form-field">
            <span>Approved estimate</span>
            <select
              name="estimateId"
              value={formData.estimateId}
              onChange={handleEstimateChange}
            >
              <option value="">Manual job</option>

              {approvedEstimates.map((estimate) => (
                <option key={estimate.id} value={estimate.id}>
                  {estimate.id} — {estimate.customer} — ${estimate.amount}
                </option>
              ))}
            </select>
          </label>

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
              placeholder="Add access instructions, scope details, or reminders"
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
              Create Job
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateJobModal;