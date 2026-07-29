import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const sampleInvoices = [
  {
    id: "INV-1003",
    customer: "Angela Williams",
    service: "Mulch Installation",
    amount: 285,
    issued: "Jul 25, 2026",
    due: "Aug 1, 2026",
    status: "Paid",
  },
  {
    id: "INV-1002",
    customer: "David Thompson",
    service: "Property Cleanup",
    amount: 175,
    issued: "Jul 27, 2026",
    due: "Aug 3, 2026",
    status: "Unpaid",
  },
  {
    id: "INV-1001",
    customer: "Maria Hernandez",
    service: "Weekly Lawn Mowing",
    amount: 55,
    issued: "Jul 20, 2026",
    due: "Jul 27, 2026",
    status: "Overdue",
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function AdminInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return sampleInvoices.filter((invoice) => {
      const matchesSearch =
        invoice.customer.toLowerCase().includes(search) ||
        invoice.service.toLowerCase().includes(search) ||
        invoice.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const outstandingTotal = sampleInvoices
    .filter((invoice) =>
      ["Unpaid", "Overdue"].includes(invoice.status),
    )
    .reduce((total, invoice) => total + invoice.amount, 0);

  const paidTotal = sampleInvoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + invoice.amount, 0);

  return (
    <>
      <Helmet>
        <title>Invoices | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Billing</p>
          <h2>Invoices</h2>
          <p>Bill completed work and track Lawnview customer payments.</p>
        </div>

        <button className="admin-primary-button" type="button">
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
          <strong>
            {
              sampleInvoices.filter(
                (invoice) => invoice.status === "Overdue",
              ).length
            }
          </strong>
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
                      className={`admin-status admin-status-${invoice.status.toLowerCase()}`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td>
                    <button className="admin-text-button" type="button">
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
    </>
  );
}

export default AdminInvoicesPage;