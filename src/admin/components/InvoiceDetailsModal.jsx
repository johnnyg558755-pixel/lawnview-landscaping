import { useState } from "react";

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function InvoiceDetailsModal({ invoice, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: invoice.displayStatus || invoice.status,
    dueValue: invoice.dueValue || "",
    paymentMethod: invoice.paymentMethod || "",
    notes: invoice.notes || "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function saveInvoice(statusOverride) {
    const status = statusOverride || formData.status;

    onSave({
      ...invoice,
      status,
      dueValue: formData.dueValue,
      due: formData.dueValue
        ? formatDate(formData.dueValue)
        : invoice.due,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim(),
      paidAt:
        status === "Paid"
          ? invoice.paidAt || new Date().toISOString()
          : "",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveInvoice();
  }

  return (
    <div className="admin-modal-overlay" onMouseDown={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">{invoice.id}</p>
            <h2 id="invoice-details-title">{invoice.customer}</h2>
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
          <div className="admin-detail-grid">
            <div>
              <span>Customer</span>
              <strong>{invoice.customer}</strong>
            </div>

            <div>
              <span>Service</span>
              <strong>{invoice.service}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(invoice.amount)}
              </strong>
            </div>

            <div>
              <span>Issued</span>
              <strong>{invoice.issued}</strong>
            </div>

            {invoice.jobId && (
              <div>
                <span>Job</span>
                <strong>{invoice.jobId}</strong>
              </div>
            )}
          </div>

          <div className="admin-form-grid">
            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>

            <label>
              Due date
              <input
                name="dueValue"
                type="date"
                value={formData.dueValue}
                onChange={handleChange}
              />
            </label>

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
          </div>

          <label>
            Internal notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add payment details or follow-up notes"
              rows="5"
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

            {formData.status !== "Paid" && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={() => saveInvoice("Paid")}
              >
                Mark Paid
              </button>
            )}

            <button className="admin-primary-button" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvoiceDetailsModal;