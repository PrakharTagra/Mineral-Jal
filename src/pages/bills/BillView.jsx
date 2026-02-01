import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/ui.css";

const BillView = () => {
  const { invoiceNumber } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const allBills =
      JSON.parse(localStorage.getItem("MJ_BILLS")) || [];

    const found = allBills.find(
      (b) => b.invoiceNumber === invoiceNumber
    );

    setBill(found || null);
  }, [invoiceNumber]);

  if (!invoiceNumber) {
    return <p style={{ padding: 20 }}>Invalid invoice URL</p>;
  }

  if (!bill) {
    return <p style={{ padding: 20 }}>Bill not found</p>;
  }

  const parts = Array.isArray(bill.parts) ? bill.parts : [];

  const partsTotal = parts.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  return (
    <div className="bill-print">
      <div className="bill-inner">

        {/* HEADER */}
        <div className="invoice-top">
          <div className="brand">
            <h1>Mineral Jal</h1>
            <p>RO Sales & Service</p>
          </div>
          <div className="invoice-title">
            <h2>INVOICE</h2>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="invoice-info">
          <div>
            <p className="info-title">Invoice To:</p>
            <p><strong>{bill.customer?.name || "Customer"}</strong></p>
            <p>{bill.customer?.phone || "-"}</p>
            <p>{bill.customer?.address || "-"}</p>
          </div>

          <div className="invoice-meta">
            <p><strong>Invoice #:</strong> {bill.invoiceNumber}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(bill.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sl.</th>
              <th>Item Description</th>
              <th style={{ textAlign: "right" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, index) => (
              <tr key={part.id}>
                <td>{index + 1}</td>
                <td>{part.name}</td>
                <td style={{ textAlign: "right" }}>
                  ₹{Number(part.price)}
                </td>
              </tr>
            ))}

            <tr>
              <td>{parts.length + 1}</td>
              <td>Service Charges</td>
              <td style={{ textAlign: "right" }}>
                ₹{bill.serviceCharge}
              </td>
            </tr>

            <tr>
              <td>{parts.length + 2}</td>
              <td>Discount</td>
              <td style={{ textAlign: "right" }}>
                - ₹{bill.discountAmount || 0}
              </td>
            </tr>
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="invoice-summary">
          <div>
            <p>Sub Total:</p>
            <p>₹{partsTotal + bill.serviceCharge}</p>
          </div>
          <div className="grand-total">
            <span>Total</span>
            <strong>₹{bill.totalAmount}</strong>
          </div>
        </div>

        {/* FOOTER */}
        <div className="invoice-footer">
          <div>
            <p><strong>Thank you for choosing Mineral Jal</strong></p>
            <p>Terms & Conditions apply</p>
          </div>
          <div className="sign">
            <p>Authorised Sign</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BillView;