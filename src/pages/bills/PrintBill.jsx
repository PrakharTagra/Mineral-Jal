import { useEffect, useState } from "react";
import "../../styles/ui.css";

const PrintBill = () => {
  const [bill, setBill] = useState(null);

useEffect(() => {
    const data = localStorage.getItem("MJ_ACTIVE_BILL");
    if (data) {
        setBill(JSON.parse(data));
        setTimeout(() => window.print(), 300);
    }
}, []);


  if (!bill) return <p>No bill found</p>;

  return (
      <div className="bill-print">
        {/* Top Header */}
        <div className="bill-inner">
        <div className="invoice-top">
          <div className="brand">
            <h1>Mineral Jal</h1>
            <p>RO Sales & Service</p>
          </div>

          <div className="invoice-title">
            <h2>INVOICE</h2>
          </div>
        </div>

        {/* Customer + Meta */}
        <div className="invoice-info">
          <div>
            <p className="info-title">Invoice To:</p>
            <p><strong>{customer.name}</strong></p>
            <p>{customer.phone}</p>
            <p>{customer.address}</p>
          </div>

          <div className="invoice-meta">
            <p><strong>Invoice #:</strong>{invoiceRef.current}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sl.</th>
              <th>Item Description</th>
              <th style={{ textAlign: "right" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {selectedParts.map((part, index) => (
              <tr key={part.id}>
                <td>{index + 1}</td>
                <td>{part.name}</td>
                <td style={{ textAlign: "right" }}>₹{part.price}</td>
              </tr>
            ))}

            <tr>
              <td>{selectedParts.length + 1}</td>
              <td>Service Charges</td>
              <td style={{ textAlign: "right" }}>₹{serviceCharge}</td>
            </tr>

            {discountAmount > 0 && (
              <tr>
                <td>{selectedParts.length + 2}</td>
                <td>Discount</td>
                <td style={{ textAlign: "right" }}>- ₹{discountAmount}</td>
              </tr>
            )}

            {discountAmount === 0 && (
              <tr>
                <td>{selectedParts.length + 2}</td>
                <td>Discount</td>
                <td style={{ textAlign: "right" }}>₹0</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="invoice-summary">
          <div>
            <p>Sub Total:</p>
            <p>₹{partsTotal + serviceCharge}</p>
          </div>
          <div className="grand-total">
            <span>Total</span>
            <strong>₹{finalAmount}</strong>
          </div>
        </div>

        {/* Footer */}
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
)};

export default PrintBill;