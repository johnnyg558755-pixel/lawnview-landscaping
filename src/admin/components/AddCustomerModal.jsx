import { useState } from "react";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "Lawn Mowing",
  status: "Active",
  notes: "",
};

function AddCustomerModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const customer = {
      ...formData,
      id: `CUST-${Date.now().toString().slice(-6)}`,
      jobs: 0,
      lastService: "No services yet",
    };

    onAdd(customer);
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
        aria-labelledby="add-customer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">New customer</p>
            <h3 id="add-customer-title">Add Customer</h3>
          </div>

          <button
            className="admin-modal-close"
            type="button"
            aria-label="Close form"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Customer name *</span>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Phone number *</span>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label className="admin-form-field">
              <span>Address</span>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
            </label>

            <label className="admin-form-field">
              <span>Primary service *</span>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="Lawn Mowing">Lawn Mowing</option>
                <option value="Edging">Edging</option>
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
              <span>Customer status *</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          <label className="admin-form-field">
            <span>Internal notes</span>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add service preferences or customer notes"
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
              Add Customer
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddCustomerModal;