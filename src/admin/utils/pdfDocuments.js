import { jsPDF } from "jspdf";

const COLORS = {
  green: [31, 111, 67],
  darkGreen: [21, 83, 51],
  text: [23, 33, 27],
  muted: [101, 115, 106],
  border: [220, 229, 223],
  lightGreen: [232, 244, 236],
  white: [255, 255, 255],
};

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

function safeFilename(value) {
  return value.replace(/[^a-z0-9-_]/gi, "-");
}

function findCustomerAddress(document) {
  if (document.address) {
    return document.address;
  }

  if (document.location) {
    return document.location;
  }

  const customerName = String(
    document.customer || "",
  )
    .trim()
    .toLowerCase();

  if (!customerName) {
    return "Address not provided";
  }

  const storageKeys = [
    "lawnview-admin-customers",
    "lawnview-admin-jobs",
    "lawnview-admin-inquiries",
  ];

  for (const key of storageKeys) {
    try {
      const records = JSON.parse(
        localStorage.getItem(key) || "[]",
      );

      const matchingRecord = records.find((record) => {
        const recordName = String(
          record.name || record.customer || "",
        )
          .trim()
          .toLowerCase();

        return recordName === customerName;
      });

      const address =
        matchingRecord?.address ||
        matchingRecord?.location;

      if (address) {
        return address;
      }
    } catch {
      // Continue checking the other saved data collections.
    }
  }

  return "Address not provided";
}

function createDocument(type, id, status) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  doc.setFillColor(...COLORS.green);
  doc.rect(0, 0, 612, 105, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.text("Lawnview", 48, 47);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Professional Lawn Care • Mesquite, Texas", 48, 66);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(type.toUpperCase(), 564, 42, {
    align: "right",
  });

  doc.setFontSize(10);
  doc.text(id, 564, 61, {
    align: "right",
  });

  if (status) {
    doc.setFont("helvetica", "normal");
    doc.text(`Status: ${status}`, 564, 78, {
      align: "right",
    });
  }

  return doc;
}

function sectionTitle(doc, title, y) {
  doc.setTextColor(...COLORS.green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(title.toUpperCase(), 48, y);

  doc.setDrawColor(...COLORS.border);
  doc.line(48, y + 8, 564, y + 8);

  return y + 31;
}

function labelValue(doc, label, value, x, y, width = 230) {
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(label.toUpperCase(), x, y);

  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(
    String(value || "Not provided"),
    width,
  );

  doc.text(lines, x, y + 17);

  return y + 17 + lines.length * 13;
}

function priceRow(doc, label, amount, y, emphasized = false) {
  if (emphasized) {
    doc.setFillColor(...COLORS.lightGreen);
    doc.roundedRect(48, y - 16, 516, 36, 5, 5, "F");
  }

  doc.setTextColor(
    ...(emphasized ? COLORS.darkGreen : COLORS.text),
  );
  doc.setFont(
    "helvetica",
    emphasized ? "bold" : "normal",
  );
  doc.setFontSize(emphasized ? 12 : 10);

  doc.text(label, emphasized ? 60 : 48, y);
  doc.text(currency(amount), emphasized ? 552 : 564, y, {
    align: "right",
  });

  if (!emphasized) {
    doc.setDrawColor(...COLORS.border);
    doc.line(48, y + 9, 564, y + 9);
  }

  return y + (emphasized ? 42 : 30);
}

function wrappedParagraph(doc, text, y) {
  if (!text) return y;

  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const lines = doc.splitTextToSize(text, 516);
  doc.text(lines, 48, y);

  return y + lines.length * 14;
}

function addFooter(doc, message) {
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...COLORS.border);
  doc.line(48, pageHeight - 60, 564, pageHeight - 60);

  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(message, 48, pageHeight - 39);

  doc.text(
    "Thank you for choosing Lawnview.",
    564,
    pageHeight - 39,
    { align: "right" },
  );
}

export function createEstimatePdf(estimate) {
  const labor = Number(estimate.labor || 0);
  const materials = Number(estimate.materials || 0);
  const additional = Number(estimate.additional || 0);
  const total = labor + materials + additional;

  const doc = createDocument(
    "Estimate",
    estimate.id,
    estimate.status,
  );

  const customerAddress = findCustomerAddress(estimate);

  let y = sectionTitle(doc, "Customer and service", 135);

  labelValue(doc, "Customer", estimate.customer, 48, y);
  labelValue(doc, "Service", estimate.service, 330, y);

  labelValue(
    doc,
    "Service address",
    customerAddress,
    48,
    y + 55,
    516,
  );

  y = sectionTitle(doc, "Pricing", 270);
  y = priceRow(doc, "Labor", labor, y);
  y = priceRow(doc, "Materials", materials, y);
  y = priceRow(doc, "Additional costs", additional, y);
  y = priceRow(doc, "Estimate total", total, y + 4, true);

  if (estimate.notes) {
    y = sectionTitle(doc, "Work included", y + 4);
    wrappedParagraph(doc, estimate.notes, y);
  }

  addFooter(
    doc,
    "Estimate subject to adjustment if the requested scope of work changes.",
  );

  return doc;
}

export function createInvoicePdf(invoice) {
  const doc = createDocument(
    "Invoice",
    invoice.id,
    invoice.displayStatus || invoice.status,
  );

  const customerAddress = findCustomerAddress(invoice);

  let y = sectionTitle(doc, "Billing details", 135);

  labelValue(doc, "Customer", invoice.customer, 48, y);
  labelValue(doc, "Service", invoice.service, 330, y);

  labelValue(
    doc,
    "Service address",
    customerAddress,
    48,
    y + 55,
    516,
  );

  y += 115;

  labelValue(doc, "Issued", invoice.issued, 48, y);
  labelValue(doc, "Due date", invoice.due, 330, y);

  y = sectionTitle(doc, "Amount due", y + 70);
    y = priceRow(doc, invoice.service, invoice.amount, y);
    y = priceRow(doc, "Invoice total", invoice.amount, y + 4, true);

    if (invoice.paymentMethod) {
      y = sectionTitle(doc, "Payment", y + 5);
      labelValue(
        doc,
        "Payment method",
        invoice.paymentMethod,
        48,
        y,
      );
    }

  // Internal notes are intentionally excluded from customer PDFs.
  addFooter(
    doc,
    "Please contact Lawnview if you have questions about this invoice.",
  );

  return doc;
}

export function downloadPdf(doc, filename) {
  doc.save(safeFilename(filename));
}

export async function sharePdf(doc, filename, title) {
  const safeName = safeFilename(filename);
  const blob = doc.output("blob");
  const file = new File([blob], safeName, {
    type: "application/pdf",
  });

  const shareData = {
    title,
    text: `${title} from Lawnview`,
    files: [file],
  };

  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare(shareData)
  ) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  downloadPdf(doc, safeName);
}