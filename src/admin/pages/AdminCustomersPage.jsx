import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import {
  createCustomer,
  fetchCustomers,
  updateCustomer,
} from "../services/adminData";



function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let isActive = true;

    async function loadCustomers() {
      try {
        const cloudCustomers = await fetchCustomers();

        if (isActive) {
          setCustomers(cloudCustomers);
        }
      } catch (error) {
        console.error("Unable to load customers:", error);

        if (isActive) {
          setDataError(
            "Unable to load customers. Check your connection and try again.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleAddCustomer(customer) {
    setDataError("");

    try {
      const savedCustomer = await createCustomer(customer);

      setCustomers((currentCustomers) => [
        savedCustomer,
        ...currentCustomers,
      ]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Unable to create customer:", error);
      setDataError(
        "The customer could not be saved. Please try again.",
      );
    }
  }

  async function handleSaveCustomer(updatedCustomer) {
    setDataError("");

    try {
      const savedCustomer = await updateCustomer(
        updatedCustomer,
      );

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === savedCustomer.id
            ? savedCustomer
            : customer,
        ),
      );

      setSelectedCustomer(null);
    } catch (error) {
      console.error("Unable to update customer:", error);
      setDataError(
        "The customer changes could not be saved.",
      );
    }
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

      {dataError && (
        <p className="admin-login-error" role="alert">
          {dataError}
        </p>
      )}

      {isLoading && (
        <p className="admin-loading-message">
          Loading customers…
        </p>
      )}

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