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

function toDisplayTime(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`2026-01-01T${value}`));
}

function estimateFromDatabase(row) {
  return {
    id: row.id,
    customer: row.customer,
    service: row.service,
    labor: Number(row.labor),
    materials: Number(row.materials),
    additional: Number(row.additional),
    amount: Number(row.amount),
    created: toDisplayDate(row.created_date),
    status: row.status,
    notes: row.notes,
  };
}

function estimateToDatabase(estimate) {
  return {
    id: estimate.id,
    customer: estimate.customer,
    service: estimate.service,
    labor: Number(estimate.labor) || 0,
    materials: Number(estimate.materials) || 0,
    additional: Number(estimate.additional) || 0,
    amount: Number(estimate.amount) || 0,
    created_date:
      toDatabaseDate(estimate.created) ||
      new Date().toISOString().slice(0, 10),
    status: estimate.status,
    notes: estimate.notes || "",
  };
}

function jobFromDatabase(row) {
  const timeValue = row.service_time?.slice(0, 5) || "";

  return {
    id: row.id,
    estimateId: row.estimate_id || "",
    customer: row.customer,
    service: row.service,
    address: row.address,
    amount: Number(row.amount),
    dateValue: row.service_date,
    timeValue,
    date: toDisplayDate(row.service_date),
    time: toDisplayTime(timeValue),
    status: row.status,
    notes: row.notes,
  };
}

function jobToDatabase(job) {
  return {
    id: job.id,
    estimate_id: job.estimateId || null,
    customer: job.customer,
    service: job.service,
    address: job.address || "",
    amount: Number(job.amount) || 0,
    service_date:
      job.dateValue || toDatabaseDate(job.date),
    service_time: job.timeValue || null,
    status: job.status,
    notes: job.notes || "",
  };
}

function invoiceFromDatabase(row) {
  return {
    id: row.id,
    jobId: row.job_id || "",
    customer: row.customer,
    address: row.address,
    service: row.service,
    amount: Number(row.amount),
    issuedValue: row.issued_date,
    dueValue: row.due_date,
    issued: toDisplayDate(row.issued_date),
    due: toDisplayDate(row.due_date),
    status: row.status,
    paymentMethod: row.payment_method,
    notes: row.notes,
  };
}

function invoiceToDatabase(invoice) {
  return {
    id: invoice.id,
    job_id: invoice.jobId || null,
    customer: invoice.customer,
    address: invoice.address || "",
    service: invoice.service,
    amount: Number(invoice.amount) || 0,
    issued_date:
      invoice.issuedValue ||
      toDatabaseDate(invoice.issued),
    due_date:
      invoice.dueValue ||
      toDatabaseDate(invoice.due),
    status: invoice.status,
    payment_method: invoice.paymentMethod || "",
    notes: invoice.notes || "",
  };
}

export async function fetchEstimates() {
  const { data, error } = await supabase
    .from("estimates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(estimateFromDatabase);
}

export async function createEstimate(estimate) {
  const { data, error } = await supabase
    .from("estimates")
    .insert(estimateToDatabase(estimate))
    .select()
    .single();

  if (error) throw error;
  return estimateFromDatabase(data);
}

export async function updateEstimate(estimate) {
  const { data, error } = await supabase
    .from("estimates")
    .update(estimateToDatabase(estimate))
    .eq("id", estimate.id)
    .select()
    .single();

  if (error) throw error;
  return estimateFromDatabase(data);
}

export async function fetchJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("service_date", { ascending: true });

  if (error) throw error;
  return data.map(jobFromDatabase);
}

export async function createJob(job) {
  const { data, error } = await supabase
    .from("jobs")
    .insert(jobToDatabase(job))
    .select()
    .single();

  if (error) throw error;
  return jobFromDatabase(data);
}

export async function updateJob(job) {
  const { data, error } = await supabase
    .from("jobs")
    .update(jobToDatabase(job))
    .eq("id", job.id)
    .select()
    .single();

  if (error) throw error;
  return jobFromDatabase(data);
}

export async function fetchInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("issued_date", { ascending: false });

  if (error) throw error;
  return data.map(invoiceFromDatabase);
}

export async function createInvoice(invoice) {
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoiceToDatabase(invoice))
    .select()
    .single();

  if (error) throw error;
  return invoiceFromDatabase(data);
}

export async function updateInvoice(invoice) {
  const { data, error } = await supabase
    .from("invoices")
    .update(invoiceToDatabase(invoice))
    .eq("id", invoice.id)
    .select()
    .single();

  if (error) throw error;
  return invoiceFromDatabase(data);
}