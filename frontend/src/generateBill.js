import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
* Generates a professional invoice-style bill using jsPDF + autotable.
* - Proper table layout
* - Company info, customer contact
* - Totals aligned neatly to the right
*/
export default async function generateBill(products, phone, email, billDiscount = 0) {
 const doc = new jsPDF({ unit: "pt", format: "a4" });

 // COMPANY HEADER
 doc.setFont("helvetica", "bold");
 doc.setFontSize(22);
 doc.text("Selvaganapathy Traders", 55, 50);
 doc.setFontSize(12);
 doc.setFont("helvetica", "normal");
 doc.text("Main Road, Kananjampatti,", 55, 75);
 doc.text("Sivakasi-Vembakkottai Road, Tamil Nadu", 55, 90);
 doc.text("Phone: +91 9944087728", 55, 105);

 // INVOICE INFO
 doc.setFont("helvetica", "bold");
 doc.text("INVOICE", 400, 50);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(11);
 const today = new Date();
 doc.text(`Date: ${today.toLocaleDateString()}`, 400, 75);
 doc.text(`Phone: ${phone}`, 400, 95);

 // Email positioning
 let currentY = 115;
 if (email) {
  const emailText = `Email: ${email}`;
  const textWidth = doc.getTextWidth(emailText);
  const maxWidth = 150;

  if (textWidth > maxWidth) {
   const emailParts = email.split("@");
   doc.text(`Email: ${emailParts[0]}@`, 400, currentY);
   doc.text(`${emailParts[1]}`, 400, currentY + 15);
   currentY += 30;
  } else {
   doc.text(emailText, 400, currentY);
   currentY += 20;
  }
 }

 // Table Content Preparation
 const tableBody = products.map((p, idx) => [
  idx + 1,
  p.productName || p.name || "",
  `${Number(p.actualPrice ?? 0).toFixed(2)} INR`, // Price per Qty column
  p.selectedQuantity || p.quantity || p.qty || p.defaultQuantity || 1,
  `${Number(p.actualPrice ?? 0).toFixed(2) * (p.selectedQuantity || p.quantity || p.qty || p.defaultQuantity || 1)} INR`
 ]);

 // Calculate grand total from products
 const grandTotal = products.reduce(
  (acc, p) => acc + Number(p.actualPrice ?? 0) * (p.selectedQuantity || p.quantity || p.qty || p.defaultQuantity || 1),
  0
 );

 // Calculate discounted total
 const discountedTotal = (() => {
  // Separate GIFT BOXES and other products
  const giftBoxTotal = products
    .filter(p => (p.productType || p.type || "").toUpperCase() === "GIFT BOXES")
    .reduce(
      (acc, p) => acc + Number(p.actualPrice ?? 0) * (p.selectedQuantity || p.quantity || p.qty || p.defaultQuantity || 1),
      0
    );
  const otherTotal = grandTotal - giftBoxTotal;
  // Apply discount only to non-GIFT BOXES products
  return giftBoxTotal + (otherTotal * (billDiscount > 0 ? (1 - billDiscount / 100) : 1));
})();

 // AUTOTABLE
 autoTable(doc, {
  startY: 140,
  head: [["S.No", "Product", "Price/Qty", "Qty", "Price"]],
  body: tableBody,
  styles: {
   font: "helvetica",
   fontSize: 11,
   valign: "top",
   halign: "center",
   cellPadding: { top: 3, right: 2, bottom: 3, left: 2 },
   cellWidth: "auto",
   overflow: "linebreak",
   textColor: 33,
   lineColor: [200, 200, 200],
  },
  headStyles: {
   fillColor: [230, 230, 230],
   textColor: 0,
   fontStyle: "bold",
  },
  columnStyles: {
   0: { cellWidth: 'auto' },
   1: { cellWidth: 220, halign: "left" }, // Adjusted product column width
   2: { cellWidth: 'auto' },
   3: { cellWidth: 'auto' },
   4: { cellWidth: 'auto' },
  },
  margin: { left: 10, right: 10 },
  theme: "grid",
  tableWidth: 'auto',
 });

 // GRAND TOTAL & DISCOUNT
 const finalY = doc.lastAutoTable.finalY || 140 + tableBody.length * 20;
 const pageWidth = doc.internal.pageSize.getWidth();
 const margin = 55;

 doc.setFont("helvetica", "bold");
 doc.setFontSize(14);
 doc.text(`Grand Total: ${grandTotal.toFixed(2)} INR`, pageWidth - margin, finalY + 40, { align: 'right' });

 if (billDiscount > 0) {
  doc.setFontSize(13);
  doc.text(`Discount Applied: ${billDiscount}% (Not applied for GIFT BOXES)`, pageWidth - margin, finalY + 65, { align: 'right' });
  doc.setFontSize(14);
  doc.text(`Discounted Total: ${discountedTotal.toFixed(2)} INR`, pageWidth - margin, finalY + 90, { align: 'right' });
 }

 // FOOTER/THANK YOU NOTE
 doc.setFontSize(12);
 doc.setFont("helvetica", "italic");
 let footerY = billDiscount > 0 ? finalY + 130 : finalY + 80;
 doc.text("Thank you for your business!", 55, footerY);
 doc.text(
  "If you have questions about this invoice, contact us at selvaganapathytraders.official@gmail.com",
  55,
  footerY + 20
 );

 // Save & Return PDF Blob
 doc.save(`bill_${phone}_${Date.now()}.pdf`);
 return doc.output("blob");
}