import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerDetailsModal from "../components/CustomerDetailsModal";

const sampleCustomers = [
  {
    id: "CUST-1003",
    name: "Angela Williams",
    phone: "(972) 555-0165",
    email: "angela@example.com",
    address: "Mesquite, TX",
    service: "Mulch Installation",
    jobs: 1,
    lastService: "Jul 24, 2026",
    status: "Active",
  },
  {
    id: "CUST-1002",
    name: "David Thompson",
    phone: "(469) 555-0182",
    email: "david@example.com",
    address: "Mesquite, TX",
    service: "Property Cleanup",
    jobs: 2,
    lastService: "Jul 18, 2026",
    status: "Active",
  },
  {
    id: "CUST-1001",
    name: "Carlos Ramirez",
    phone: "(214) 555-0191",
    email: "carlos@example.com",
    address: "Mesquite, TX",
    service: "Lawn Mowing",
    jobs: 4,
    lastService: "Jul 12, 2026",
    status: "Inactive",
  },
];

const CUSTOMERS_STORAGE_KEY = "lawnview-admin-customers";

function loadSavedCustomers() {
  try {
    const savedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);

    return savedCustomers ? JSON.parse(savedCustomers) : sampleCustomers;
  } catch {
    return sampleCustomers;
  }
}

function AdminCustomersPage() {
  const [customers, setCustomers] = useState(loadSavedCustomers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  function handleAddCustomer(customer) {
    setCustomers((currentCustomers) => [customer, ...currentCustomers]);
    setIsAddModalOpen(false);
  }

  function handleSaveCustomer(updatedCustomer) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );

    setSelectedCustomer(null);
  }

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Customers | Lawnview Admin</title>
      </Helmet>

      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Customer management</p>
          <h2>Customers</h2>
          <p>Manage customer information and Lawnview service history.</p>
        </div>

        <button 
          className="admin-primary-button" 
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          >
          Add Customer
        </button>
      </header>

      <section className="admin-panel admin-inquiries-panel">
        <div className="admin-toolbar">
          <label className="admin-search">
            <span className="sr-only">Search customers</span>
            <input
              type="search"
              placeholder="Search by name, phone, or email"
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
              <option value="All">All customers</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Primary service</th>
                <th>Jobs</th>
                <th>Last service</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <span>{customer.phone}</span>
                    <small>{customer.email}</small>
                  </td>

                  <td>{customer.service}</td>
                  <td>{customer.jobs}</td>
                  <td>{customer.lastService}</td>

                  <td>
                    <span
                      className={`admin-status admin-status-${customer.status.toLowerCase()}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <button 
                      className="admin-text-button" 
                      type="button"
                      onClick={() => setSelectedCustomer({ ...customer})}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="admin-empty-state">
            <h4>No matching customers</h4>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </section>
      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCustomer}
        />
      )}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSave={handleSaveCustomer}
        />
      )}
    </>
  );
}

export default AdminCustomersPage;