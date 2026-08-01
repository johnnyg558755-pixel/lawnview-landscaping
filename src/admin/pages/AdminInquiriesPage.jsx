import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import AddInquiryModal from "../components/AddInquiryModal";
import {
  createInquiry,
  fetchInquiries,
  updateInquiry,
} from "../services/adminData";


function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadInquiries() {
      try {
        const cloudInquiries = await fetchInquiries();

        if (isActive) {
          setInquiries(cloudInquiries);
        }
      } catch (error) {
        console.error("Unable to load inquiries:", error);

        if (isActive) {
          setDataError(
            "Unable to load inquiries. Check your connection and try again.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadInquiries();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleAddInquiry(inquiry) {
    setDataError("");

    try {
      const savedInquiry = await createInquiry(inquiry);

      setInquiries((currentInquiries) => [
        savedInquiry,
        ...currentInquiries,
      ]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Unable to create inquiry:", error);
      setDataError(
        "The inquiry could not be saved. Please try again.",
      );
    }
  }

  async function handleSaveInquiry(event) {
    event.preventDefault();
    setDataError("");

    try {
      const savedInquiry = await updateInquiry(
        selectedInquiry,
      );

      setInquiries((currentInquiries) =>
        currentInquiries.map((inquiry) =>
          inquiry.id === savedInquiry.id
            ? savedInquiry
            : inquiry,
        ),
      );

      setSelectedInquiry(null);
    } catch (error) {
      console.error("Unable to update inquiry:", error);
      setDataError(
        "The inquiry changes could not be saved.",
      );
    }
  }

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        inquiry.name.toLowerCase().includes(search) ||
        inquiry.phone.includes(searchTerm) ||
        inquiry.service.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        inquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Inquiries | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Lead management</p>
          <h2>Inquiries</h2>
          <p>Track new leads and move them toward a scheduled job.</p>
        </div>

        <button
          className="admin-primary-button"
          type="button"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Inquiry
        </button>
      </header>

      {dataError && (
        <p className="admin-login-error" role="alert">
          {dataError}
        </p>
      )}

      {isLoading && (
        <p className="admin-loading-message">
          Loading inquiries…
        </p>
      )}

      <section className="admin-panel admin-inquiries-panel">
        <div className="admin-toolbar">
          <label className="admin-search">
            <span className="sr-only">Search inquiries</span>
            <input
              type="search"
              placeholder="Search by name, phone, or service"
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
              <option value="All">All statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Estimate Sent">Estimate sent</option>
              <option value="Closed">Closed</option>
            </select>
          </label>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Received</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <strong>{inquiry.name}</strong>
                    <span>{inquiry.phone}</span>
                  </td>

                  <td>{inquiry.service}</td>

                  <td>
                    <span>{inquiry.date}</span>
                    <small>{inquiry.id}</small>
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${inquiry.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {inquiry.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="admin-text-button"
                      type="button"
                      onClick={() => setSelectedInquiry({ ...inquiry })}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInquiries.length === 0 && (
          <div className="admin-empty-state">
            <h4>No matching inquiries</h4>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </section>

      {selectedInquiry && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedInquiry(null)}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <p className="admin-eyebrow">{selectedInquiry.id}</p>
                <h3 id="inquiry-modal-title">{selectedInquiry.name}</h3>
              </div>

              <button
                className="admin-modal-close"
                type="button"
                aria-label="Close inquiry"
                onClick={() => setSelectedInquiry(null)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveInquiry}>
              <div className="admin-inquiry-details">
                <div>
                  <span>Phone</span>
                  <strong>{selectedInquiry.phone}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedInquiry.email}</strong>
                </div>

                <div>
                  <span>Service</span>
                  <strong>{selectedInquiry.service}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{selectedInquiry.address}</strong>
                </div>
              </div>

              <div className="admin-message-box">
                <span>Customer message</span>
                <p>{selectedInquiry.message}</p>
              </div>

              <label className="admin-form-field">
                <span>Status</span>

                <select
                  value={selectedInquiry.status}
                  onChange={(event) =>
                    setSelectedInquiry({
                      ...selectedInquiry,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Estimate Sent">Estimate sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>

              <label className="admin-form-field">
                <span>Internal notes</span>

                <textarea
                  rows="4"
                  placeholder="Add follow-up details or customer notes"
                  value={selectedInquiry.notes}
                  onChange={(event) =>
                    setSelectedInquiry({
                      ...selectedInquiry,
                      notes: event.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-modal-actions">
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
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
      )}
      {isAddModalOpen && (
        <AddInquiryModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddInquiry}
        />
      )}
    </>
  );
}

export default AdminInquiriesPage;