import { supabase } from "../../lib/supabase";

function toDatabaseDate(value) {
  if (!value || value === "No services yet") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function toDisplayDate(value, fallback = "") {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function inquiryFromDatabase(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    service: row.service,
    source: row.source,
    date: toDisplayDate(row.received_date),
    status: row.status,
    message: row.message,
    notes: row.notes,
  };
}

function inquiryToDatabase(inquiry) {
  return {
    id: inquiry.id,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email || "",
    address: inquiry.address || "",
    service: inquiry.service,
    source: inquiry.source || "",
    received_date:
      toDatabaseDate(inquiry.date) ||
      new Date().toISOString().slice(0, 10),
    status: inquiry.status,
    message: inquiry.message || "",
    notes: inquiry.notes || "",
  };
}

function customerFromDatabase(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    service: row.service,
    jobs: row.jobs,
    lastService: toDisplayDate(
      row.last_service,
      "No services yet",
    ),
    status: row.status,
    notes: row.notes,
  };
}

function customerToDatabase(customer) {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email || "",
    address: customer.address || "",
    service: customer.service || "",
    jobs: Number(customer.jobs) || 0,
    last_service: toDatabaseDate(customer.lastService),
    status: customer.status,
    notes: customer.notes || "",
  };
}

export async function fetchInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(inquiryFromDatabase);
}

export async function createInquiry(inquiry) {
  const { data, error } = await supabase
    .from("inquiries")
    .insert(inquiryToDatabase(inquiry))
    .select()
    .single();

  if (error) throw error;
  return inquiryFromDatabase(data);
}

export async function updateInquiry(inquiry) {
  const { data, error } = await supabase
    .from("inquiries")
    .update(inquiryToDatabase(inquiry))
    .eq("id", inquiry.id)
    .select()
    .single();

  if (error) throw error;
  return inquiryFromDatabase(data);
}

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(customerFromDatabase);
}

export async function createCustomer(customer) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customerToDatabase(customer))
    .select()
    .single();

  if (error) throw error;
  return customerFromDatabase(data);
}

export async function updateCustomer(customer) {
  const { data, error } = await supabase
    .from("customers")
    .update(customerToDatabase(customer))
    .eq("id", customer.id)
    .select()
    .single();

  if (error) throw error;
  return customerFromDatabase(data);
}
