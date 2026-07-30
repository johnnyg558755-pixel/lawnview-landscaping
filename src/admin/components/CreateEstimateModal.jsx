import { useMemo, useState } from "react";

function CreateEstimateModal({ customers, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    customer: customers[0]?.name || "",
    service: "Lawn Mowing",
    labor: "",
    materials: "",
    additional: "",
    status: "Draft",
    notes: "",
  });

  const total = useMemo(() => {
    return (
      Number(formData.labor || 0) +
      Number(formData.materials || 0) +
      Number(formData.additional || 0)
    );
  }, [formData.labor, formData.materials, formData.additional]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const estimate = {
      ...formData,
      id: `EST-${Date.now().toString().slice(-6)}`,
      amount: total,
      created: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    };

    onCreate(estimate);
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
        aria-labelledby="create-estimate-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">New pricing</p>
            <h3 id="create-estimate-title">Create Estimate</h3>
          </div>

          <button
            className="admin-modal-close"
            type="button"
            aria-label="Close estimate"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Customer *</span>

              {customers.length > 0 ? (
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                >
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="customer"
                  type="text"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                />
              )}
            </label>

            <label className="admin-form-field">
              <span>Service *</span>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="Lawn Mowing">Lawn Mowing</option>
                <option value="Weekly Lawn Mowing">
                  Weekly Lawn Mowing
                </option>
                <option value="Property Cleanup">Property Cleanup</option>
                <option value="Mulch Installation">
                  Mulch Installation
                </option>
                <option value="Landscape Enhancement">
                  Landscape Enhancement
                </option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="admin-form-field">
              <span>Labor</span>
              <input
                name="labor"
                type="number"
                min="0"
                step="0.01"
                value={formData.labor}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label className="admin-form-field">
              <span>Materials</span>
              <input
                name="materials"
                type="number"
                min="0"
                step="0.01"
                value={formData.materials}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label className="admin-form-field">
              <span>Additional costs</span>
              <input
                name="additional"
                type="number"
                min="0"
                step="0.01"
                value={formData.additional}
                onChange={handleChange}
                placeholder="0.00"
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
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>
            </label>
          </div>

          <div className="admin-estimate-total">
            <span>Estimate total</span>
            <strong>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(total)}
            </strong>
          </div>

          <label className="admin-form-field">
            <span>Estimate notes</span>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Describe the work included in this estimate"
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

            <button
              className="admin-primary-button"
              type="submit"
              disabled={total <= 0}
            >
              Create Estimate
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateEstimateModal;