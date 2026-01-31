import { useState } from "react";
import "./AddRO.css";
import { RO_PARTS } from "../../data/roParts";

const AddRO = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
  });

  const generateInvoiceNumber = (type) => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

    const key = `invoice_counter_${type}_${dateStr}`;
    const lastCount = Number(localStorage.getItem(key) || 0) + 1;

    localStorage.setItem(key, lastCount);

    const prefix = type === "SERVICE" ? "MJ-S" : "MJ-R";

    return `${prefix}-${dateStr}-${String(lastCount).padStart(3, "0")}`;
  };


  const [invoiceNumber] = useState(() =>
    generateInvoiceNumber("RO")
  );

  const [selectedParts, setSelectedParts] = useState([]);
  const [makingCost, setMakingCost] = useState(1000);
  const [discountPercent, setDiscountPercent] = useState("");

  /* ---------- PARTS ---------- */
  const togglePart = (part) => {
    setSelectedParts((prev) => {
      const exists = prev.find((p) => p.id === part.id);

      if (exists) {
        return prev.filter((p) => p.id !== part.id);
      }

      return [
        ...prev,
        {
          id: part.id,
          name: part.name,
          price: String(part.price), // string for editing
          basePrice: part.price,
        },
      ];
    });
  };

  const updatePartPrice = (id, value) => {
    if (!/^\d*$/.test(value)) return;

    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: value } : p
      )
    );
  };

  /* ---------- BILLING ---------- */
  const partsTotal = selectedParts.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * (Number(discountPercent) || 0)) / 100
  );

  const finalAmount =
    partsTotal + makingCost - discountAmount;

  /* ---------- SAVE ---------- */
  const handleSave = () => {
    const payload = {
      invoiceNumber,
      type:'RO',
      customer: isNewCustomer ? customer : "EXISTING_CUSTOMER_ID",
      components: selectedParts,
      makingCost,
      discountPercent,
      discountAmount,
      totalAmount: finalAmount,
      startAmc: true,
    };

    console.log("NEW RO DATA:", payload);
    alert("RO added & AMC started (mock)");
  };

  return (
    <div className="ro-container">
      <h2 className="page-title">Add New RO</h2>

      {/* CUSTOMER */}
      <div className="card">
        <p className="label">Customer</p>

        <div className="toggle">
          <button
            className={!isNewCustomer ? "active" : ""}
            onClick={() => setIsNewCustomer(false)}
          >
            Existing
          </button>
          <button
            className={isNewCustomer ? "active" : ""}
            onClick={() => setIsNewCustomer(true)}
          >
            New
          </button>
        </div>

        {!isNewCustomer && (
          <input placeholder="Search customer by name / mobile" />
        )}
      </div>

      {isNewCustomer && (
        <div className="card">
          <p className="label">Customer Details</p>
          <input
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />
          <input
            placeholder="Mobile Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />
          <input
            placeholder="Address"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />
          <input
            placeholder="Reference (optional)"
            value={customer.reference}
            onChange={(e) =>
              setCustomer({
                ...customer,
                reference: e.target.value,
              })
            }
          />
        </div>
      )}

      {/* RO DETAILS */}
      <div className="card">
        <p className="label">RO Details</p>
        <input placeholder="RO Model (Eg. AquaPro)" />
        <input type="date" />
        <textarea placeholder="Notes (optional)" />
      </div>

      {/* COMPONENTS */}
      <div className="card">
        <p className="label">RO Components</p>

        <div className="parts-grid">
          {RO_PARTS.map((part) => {
            const selected = selectedParts.find(
              (p) => p.id === part.id
            );

            return (
              <div
                key={part.id}
                className={`part-item ${
                  selected ? "selected" : ""
                }`}
                onClick={() => togglePart(part)}
              >
                <span className="part-name">{part.name}</span>

                {selected ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    className="part-price-input"
                    value={selected.price}
                    placeholder="0"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updatePartPrice(part.id, e.target.value)
                    }
                  />
                ) : (
                  <span className="part-price">
                    ₹{part.price}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BILLING */}
      <div className="card highlight">
        <p className="label">Billing Summary</p>

        <div className="bill-row">
          <span>Parts Total</span>
          <strong>₹{partsTotal}</strong>
        </div>

        <div className="bill-input">
          <label>Making / Installation Cost (₹)</label>
          <input
            type="number"
            value={makingCost}
            onChange={(e) =>
              setMakingCost(Number(e.target.value) || 0)
            }
          />
        </div>

        <div className="bill-input">
          <label>Discount on Parts (%)</label>
          <input
            type="number"
            placeholder="0"
            value={discountPercent}
            onChange={(e) =>
              setDiscountPercent(e.target.value)
            }
          />
        </div>

        <div className="bill-row">
          <span>Discount Amount</span>
          <strong>- ₹{discountAmount}</strong>
        </div>

        <div className="bill-total">
          Total Bill: ₹{finalAmount}
        </div>
      </div>

      {/* AMC INFO */}
      <div className="card">
        <p className="label">AMC Information</p>
        <ul className="info-list">
          <li>4-month service reminder</li>
          <li>8-month service reminder</li>
          <li>12-month renewal reminder</li>
        </ul>
      </div>

      {/* ACTIONS */}
      <div className="save-bar">
        <button
          className="secondary-btn"
          onClick={() => window.print()}
        >
          Download Bill
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save RO & Start AMC
        </button>
      </div>

      {/* PRINTABLE BILL */}
      <div className="bill-print">
        <div className="bill-inner">
          {/* Header */}
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
              <p><strong>{customer.name || "Customer Name"}</strong></p>
              <p>{customer.phone}</p>
              <p>{customer.address}</p>
            </div>

            <div className="invoice-meta">
              <p><strong>Invoice #:</strong>{invoiceNumber}</p>
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
                  <td style={{ textAlign: "right" }}>
                    ₹{Number(part.price || 0)}
                  </td>
                </tr>
              ))}

              <tr>
                <td>{selectedParts.length + 1}</td>
                <td>Making / Installation Charges</td>
                <td style={{ textAlign: "right" }}>
                  ₹{makingCost}
                </td>
              </tr>

              {discountAmount > 0 && (
                <tr>
                  <td>{selectedParts.length + 2}</td>
                  <td>Discount</td>
                  <td style={{ textAlign: "right" }}>
                    - ₹{discountAmount}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="invoice-summary">
            <div>
              <p>Sub Total:</p>
              <p>₹{partsTotal + makingCost}</p>
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
              <p>AMC activated with this installation</p>
            </div>

            <div className="sign">
              <p>Authorised Sign</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRO;