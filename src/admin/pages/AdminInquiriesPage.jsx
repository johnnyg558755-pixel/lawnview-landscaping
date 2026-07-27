import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import AddInquiryModal from "../components/AddInquiryModal";


const sampleInquiries = [
  {
    id: "LV-1004",
    name: "Maria Hernandez",
    phone: "(214) 555-0148",
    email: "maria@example.com",
    address: "Mesquite, TX",
    service: "Lawn Mowing",
    date: "Jul 26, 2026",
    status: "New",
    message: "Interested in weekly mowing and edging service.",
    notes: "",
  },
  {
    id: "LV-1003",
    name: "David Thompson",
    phone: "(469) 555-0182",
    email: "david@example.com",
    address: "Mesquite, TX",
    service: "Property Cleanup",
    date: "Jul 25, 2026",
    status: "Contacted",
    message: "Needs leaves, branches, and debris removed.",
    notes: "Called and left a voicemail.",
  },
  {
    id: "LV-1002",
    name: "Angela Williams",
    phone: "(972) 555-0165",
    email: "angela@example.com",
    address: "Mesquite, TX",
    service: "Mulch Installation",
    date: "Jul 24, 2026",
    status: "Estimate Sent",
    message: "Would like new mulch installed in the front flower beds.",
    notes: "Estimate sent by text.",
  },
  {
    id: "LV-1001",
    name: "Carlos Ramirez",
    phone: "(214) 555-0191",
    email: "carlos@example.com",
    address: "Mesquite, TX",
    service: "Lawn Mowing",
    date: "Jul 23, 2026",
    status: "Closed",
    message: "Requested a one-time mowing service.",
    notes: "Customer hired another company.",
  },
];

const INQUIRIES_STORAGE_KEY = "lawnview-admin-inquiries";

function loadSavedInquiries() {
  try {
    const savedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY);

    return savedInquiries ? JSON.parse(savedInquiries) : sampleInquiries;
  } catch {
    return sampleInquiries;
  }
}

function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState(loadSavedInquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));

  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        inquiry.name.toLowerCase().includes(search) ||
        inquiry.phone.includes(searchTerm) ||
        inquiry.service.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || inquiry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  function handleAddInquiry(inquiry) {
    setInquiries((currentInquiries) => [inquiry, ...currentInquiries]);
    setIsAddModalOpen(false);
  }

  function handleSaveInquiry(event) {
    event.preventDefault();

    setInquiries((currentInquiries) =>
      currentInquiries.map((inquiry) =>
        inquiry.id === selectedInquiry.id ? selectedInquiry : inquiry,
      ),
    );

    setSelectedInquiry(null);
  }

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