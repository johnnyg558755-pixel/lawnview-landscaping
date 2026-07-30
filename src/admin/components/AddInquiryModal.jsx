import { useState } from "react";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "Lawn Mowing",
  source: "Door Knocking",
  message: "",
  notes: "",
};

function AddInquiryModal({ onClose, onAdd }) {
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

    const inquiry = {
      ...formData,
      id: `LV-${Date.now().toString().slice(-6)}`,
      date: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
      status: "New",
    };

    onAdd(inquiry);
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
        aria-labelledby="add-inquiry-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <p className="admin-eyebrow">New lead</p>
            <h3 id="add-inquiry-title">Add Inquiry</h3>
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
              <span>Service *</span>
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
              <span>Lead source *</span>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
              >
                <option value="Door Knocking">Door Knocking</option>
                <option value="Website">Website</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <label className="admin-form-field">
            <span>Customer request</span>
            <textarea
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleChange}
              placeholder="What service does the customer need?"
            />
          </label>

          <label className="admin-form-field">
            <span>Internal notes</span>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add follow-up details"
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
              Add Inquiry
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddInquiryModal;