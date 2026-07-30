import { useState } from "react";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getDefaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CreateInvoiceModal({ completedJobs, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    jobId: "",
    customer: "",
    address: "",
    service: "",
    amount: "",
    issuedValue: getToday(),
    dueValue: getDefaultDueDate(),
    status: "Unpaid",
    paymentMethod: "",
    notes: "",
  });

  function handleJobChange(event) {
    const jobId = event.target.value;
    const selectedJob = completedJobs.find((job) => job.id === jobId);

    setFormData((current) => ({
      ...current,
      jobId,
      customer: selectedJob?.customer || selectedJob?.name || "",
      address: selectedJob?.address || selectedJob?.location || "",
      service: selectedJob?.service || "",
      amount: selectedJob?.amount ?? "",
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      jobId: formData.jobId,
      customer: formData.customer.trim(),
      address: formData.address.trim(),
      service: formData.service.trim(),
      amount: Number(formData.amount),
      issued: formatDate(formData.issuedValue),
      due: formatDate(formData.dueValue),
      issuedValue: formData.issuedValue,
      dueValue: formData.dueValue,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim(),
    };

    onCreate(invoice);
  }

  return (
    <div className="admin-modal-overlay" onMouseDown={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-invoice-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">Billing</p>
            <h2 id="create-invoice-title">Create Invoice</h2>
          </div>

          <button
            className="admin-modal-close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <label>
            Completed job
            <select
              name="jobId"
              value={formData.jobId}
              onChange={handleJobChange}
            >
              <option value="">Select a completed job</option>

              {completedJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.id} — {job.customer || job.name} — {job.service}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-form-grid">
            <label>
              Customer name *
              <input
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Service *
              <input
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Amount *
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

            <label>
              Status *
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </label>

            <label>
              Issue date *
              <input
                name="issuedValue"
                type="date"
                value={formData.issuedValue}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Due date *
              <input
                name="dueValue"
                type="date"
                value={formData.dueValue}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Payment method
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Not selected</option>
              <option value="Zelle">Zelle</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Check">Check</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Internal notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add payment details or customer notes"
              rows="4"
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
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInvoiceModal;