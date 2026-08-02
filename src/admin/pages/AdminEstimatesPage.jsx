import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import CreateEstimateModal from "../components/CreateEstimateModal";
import EstimateDetailsModal from "../components/EstimateDetailsModal";
import {
  createEstimate,
  fetchCustomers,
  fetchEstimates,
  updateEstimate,
} from "../services/adminData";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function AdminEstimatesPage() {
  const [estimates, setEstimates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let isActive = true;

    async function loadEstimateData() {
      try {
        const [cloudEstimates, cloudCustomers] =
          await Promise.all([
            fetchEstimates(),
            fetchCustomers(),
          ]);

        if (isActive) {
          setEstimates(cloudEstimates);
          setCustomers(cloudCustomers);
        }
      } catch (error) {
        console.error("Unable to load estimates:", error);

        if (isActive) {
          setDataError(
            "Unable to load estimates. Check your connection and try again.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadEstimateData();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleCreateEstimate(estimate) {
    setDataError("");

    try {
      const savedEstimate = await createEstimate(estimate);

      setEstimates((currentEstimates) => [
        savedEstimate,
        ...currentEstimates,
      ]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Unable to create estimate:", error);
      setDataError(
        "The estimate could not be saved. Please try again.",
      );
    }
  }

  async function handleSaveEstimate(updatedEstimate) {
    setDataError("");

    try {
      const savedEstimate = await updateEstimate(
        updatedEstimate,
      );

      setEstimates((currentEstimates) =>
        currentEstimates.map((estimate) =>
          estimate.id === savedEstimate.id
            ? savedEstimate
            : estimate,
        ),
      );

      setSelectedEstimate(null);
    } catch (error) {
      console.error("Unable to update estimate:", error);
      setDataError(
        "The estimate changes could not be saved.",
      );
    }
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
      {dataError && (
        <p className="admin-login-error" role="alert">
          {dataError}
        </p>
      )}

      {isLoading && (
        <p className="admin-loading-message">
          Loading estimates…
        </p>
      )}
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
          customers={customers}
          onClose={() => setSelectedEstimate(null)}
          onSave={handleSaveEstimate}
        />
      )}
    </>
  );
}

export default AdminEstimatesPage;