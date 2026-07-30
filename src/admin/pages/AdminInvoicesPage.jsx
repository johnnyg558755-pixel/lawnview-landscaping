import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import CreateInvoiceModal from "../components/CreateInvoiceModal";
import InvoiceDetailsModal from "../components/InvoiceDetailsModal";

const INVOICES_STORAGE_KEY = "lawnview-admin-invoices";
const JOBS_STORAGE_KEY = "lawnview-admin-jobs";

const sampleInvoices = [
  {
    id: "INV-1003",
    jobId: "JOB-1001",
    customer: "Angela Williams",
    service: "Mulch Installation",
    amount: 285,
    issued: "Jul 25, 2026",
    due: "Aug 1, 2026",
    issuedValue: "2026-07-25",
    dueValue: "2026-08-01",
    status: "Paid",
    paymentMethod: "Zelle",
    notes: "",
  },
  {
    id: "INV-1002",
    jobId: "JOB-1002",
    customer: "David Thompson",
    service: "Property Cleanup",
    amount: 175,
    issued: "Jul 27, 2026",
    due: "Aug 3, 2026",
    issuedValue: "2026-07-27",
    dueValue: "2026-08-03",
    status: "Unpaid",
    paymentMethod: "",
    notes: "",
  },
  {
    id: "INV-1001",
    jobId: "JOB-1003",
    customer: "Maria Hernandez",
    service: "Weekly Lawn Mowing",
    amount: 55,
    issued: "Jul 20, 2026",
    due: "Jul 27, 2026",
    issuedValue: "2026-07-20",
    dueValue: "2026-07-27",
    status: "Overdue",
    paymentMethod: "",
    notes: "",
  },
];

function readStorage(key, fallback) {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : fallback;
  } catch {
    return fallback;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);
}

function getInvoiceStatus(invoice) {
  if (
    invoice.status === "Unpaid" &&
    invoice.dueValue &&
    invoice.dueValue < new Date().toISOString().split("T")[0]
  ) {
    return "Overdue";
  }

  return invoice.status;
}

function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState(() =>
    readStorage(INVOICES_STORAGE_KEY, sampleInvoices),
  );
  const [completedJobs, setCompletedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    const storedJobs = readStorage(JOBS_STORAGE_KEY, []);

    setCompletedJobs(
      storedJobs.filter((job) => job.status === "Completed"),
    );
  }, []);

  const invoicesWithCurrentStatus = useMemo(
    () =>
      invoices.map((invoice) => ({
        ...invoice,
        displayStatus: getInvoiceStatus(invoice),
      })),
    [invoices],
  );

  const availableCompletedJobs = useMemo(() => {
    const invoicedJobIds = new Set(
      invoices.map((invoice) => invoice.jobId).filter(Boolean),
    );

    return completedJobs.filter((job) => !invoicedJobIds.has(job.id));
  }, [completedJobs, invoices]);

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return invoicesWithCurrentStatus.filter((invoice) => {
      const matchesSearch =
        invoice.customer.toLowerCase().includes(search) ||
        invoice.service.toLowerCase().includes(search) ||
        invoice.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        invoice.displayStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoicesWithCurrentStatus, searchTerm, statusFilter]);

  const outstandingTotal = invoicesWithCurrentStatus
    .filter((invoice) =>
      ["Unpaid", "Overdue"].includes(invoice.displayStatus),
    )
    .reduce((total, invoice) => total + Number(invoice.amount), 0);

  const paidTotal = invoicesWithCurrentStatus
    .filter((invoice) => invoice.displayStatus === "Paid")
    .reduce((total, invoice) => total + Number(invoice.amount), 0);

  const overdueCount = invoicesWithCurrentStatus.filter(
    (invoice) => invoice.displayStatus === "Overdue",
  ).length;

  function handleCreateInvoice(invoice) {
    setInvoices((currentInvoices) => [
      invoice,
      ...currentInvoices,
    ]);
    setIsCreateModalOpen(false);
  }

  function handleSaveInvoice(updatedInvoice) {
    setInvoices((currentInvoices) =>
      currentInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id
          ? updatedInvoice
          : invoice,
      ),
    );

    setSelectedInvoice(null);
  }

  return (
    <>
      <Helmet>
        <title>Invoices | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Billing</p>
          <h2>Invoices</h2>
          <p>
            Bill completed work and track Lawnview customer payments.
          </p>
        </div>

        <button
          className="admin-primary-button"
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Invoice
        </button>
      </header>

      <section className="admin-metrics admin-estimate-metrics">
        <article className="admin-metric-card">
          <p>Outstanding</p>
          <strong>{formatCurrency(outstandingTotal)}</strong>
          <span>Unpaid and overdue</span>
        </article>

        <article className="admin-metric-card">
          <p>Paid</p>
          <strong>{formatCurrency(paidTotal)}</strong>
          <span>Collected revenue</span>
        </article>

        <article className="admin-metric-card">
          <p>Overdue</p>
          <strong>{overdueCount}</strong>
          <span>Needs follow-up</span>
        </article>
      </section>

      <section className="admin-panel admin-inquiries-panel">
        <div className="admin-toolbar">
          <label className="admin-search">
            <span className="sr-only">Search invoices</span>
            <input
              type="search"
              placeholder="Search by customer, service, or invoice ID"
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
              <option value="All">All invoices</option>
              <option value="Draft">Draft</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table admin-invoices-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Due date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.id}</strong>
                    <span>Issued {invoice.issued}</span>
                  </td>

                  <td>{invoice.customer}</td>
                  <td>{invoice.service}</td>
                  <td>{invoice.due}</td>

                  <td>
                    <strong>{formatCurrency(invoice.amount)}</strong>
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${invoice.displayStatus
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {invoice.displayStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      className="admin-text-button"
                      type="button"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="admin-empty-state">
            <h4>No matching invoices</h4>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <CreateInvoiceModal
          completedJobs={availableCompletedJobs}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateInvoice}
        />
      )}

      {selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onSave={handleSaveInvoice}
        />
      )}
    </>
  );
}

export default AdminInvoicesPage;