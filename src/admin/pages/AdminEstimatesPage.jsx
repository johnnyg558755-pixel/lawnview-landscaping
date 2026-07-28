import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import CreateEstimateModal from "../components/CreateEstimateModal";
import EstimateDetailsModal from "../components/EstimateDetailsModal";

const sampleEstimates = [
  {
    id: "EST-1003",
    customer: "Angela Williams",
    service: "Mulch Installation",
    amount: 285,
    created: "Jul 26, 2026",
    status: "Sent",
  },
  {
    id: "EST-1002",
    customer: "David Thompson",
    service: "Property Cleanup",
    amount: 175,
    created: "Jul 25, 2026",
    status: "Draft",
  },
  {
    id: "EST-1001",
    customer: "Maria Hernandez",
    service: "Weekly Lawn Mowing",
    amount: 55,
    created: "Jul 24, 2026",
    status: "Approved",
  },
];

const ESTIMATES_STORAGE_KEY = "lawnview-admin-estimates";
const CUSTOMERS_STORAGE_KEY = "lawnview-admin-customers";

function loadSavedEstimates() {
  try {
    const savedEstimates = localStorage.getItem(ESTIMATES_STORAGE_KEY);

    return savedEstimates ? JSON.parse(savedEstimates) : sampleEstimates;
  } catch {
    return sampleEstimates;
  }
}

function loadSavedCustomers() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMERS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function AdminEstimatesPage() {
  const [estimates, setEstimates] = useState(loadSavedEstimates);
  const [customers] = useState(loadSavedCustomers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
  localStorage.setItem(ESTIMATES_STORAGE_KEY, JSON.stringify(estimates));
  }, [estimates]);

function handleCreateEstimate(estimate) {
  setEstimates((currentEstimates) => [estimate, ...currentEstimates]);
  setIsCreateModalOpen(false);
}

function handleSaveEstimate(updatedEstimate) {
  setEstimates((currentEstimates) =>
    currentEstimates.map((estimate) =>
      estimate.id === updatedEstimate.id ? updatedEstimate : estimate,
    ),
  );

  setSelectedEstimate(null);
}

  const filteredEstimates = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return estimates.filter((estimate) => {
      const matchesSearch =
        estimate.customer.toLowerCase().includes(search) ||
        estimate.service.toLowerCase().includes(search) ||
        estimate.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || estimate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [estimates, searchTerm, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Estimates | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Sales pipeline</p>
          <h2>Estimates</h2>
          <p>Create pricing, track approvals, and prepare Lawnview jobs.</p>
        </div>

        <button 
          className="admin-primary-button"  
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Estimate
        </button>
      </header>

      <section className="admin-metrics admin-estimate-metrics">
        <article className="admin-metric-card">
          <p>Draft</p>
          <strong>
            {estimates.filter((estimate) => estimate.status === "Draft").length}
          </strong>
          <span>Still being prepared</span>
        </article>

        <article className="admin-metric-card">
          <p>Sent</p>
          <strong>
            {estimates.filter((estimate) => estimate.status === "Sent").length}
          </strong>
          <span>Awaiting customer response</span>
        </article>

        <article className="admin-metric-card">
          <p>Approved</p>
          <strong>
            {estimates.filter((estimate) => estimate.status === "Approved").length}
          </strong>
          <span>Ready to schedule</span>
        </article>
      </section>

      <section className="admin-panel admin-inquiries-panel">
        <div className="admin-toolbar">
          <label className="admin-search">
            <span className="sr-only">Search estimates</span>
            <input
              type="search"
              placeholder="Search by customer, service, or estimate ID"
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
              <option value="All">All estimates</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </label>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table admin-estimates-table">
            <thead>
              <tr>
                <th>Estimate</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEstimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td>
                    <strong>{estimate.id}</strong>
                    <span>{estimate.created}</span>
                  </td>

                  <td>{estimate.customer}</td>
                  <td>{estimate.service}</td>
                  <td>
                    <strong>{formatCurrency(estimate.amount)}</strong>
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${estimate.status.toLowerCase()}`}
                    >
                      {estimate.status}
                    </span>
                  </td>

                  <td>
                    <button 
                      className="admin-text-button" 
                      type="button"
                      onClick={() => setSelectedEstimate({ ...estimate})}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEstimates.length === 0 && (
          <div className="admin-empty-state">
            <h4>No matching estimates</h4>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </section>
      {isCreateModalOpen && (
        <CreateEstimateModal
          customers={customers}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateEstimate}
        />
      )}

      {selectedEstimate && (
        <EstimateDetailsModal
          estimate={selectedEstimate}
          onClose={() => setSelectedEstimate(null)}
          onSave={handleSaveEstimate}
        />
      )}
    </>
  );
}

export default AdminEstimatesPage;