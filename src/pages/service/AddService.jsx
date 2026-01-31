import { useState } from "react";
import "./AddService.css";
import { RO_PARTS } from "../../data/roParts";

const AddService = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
  });

  const [selectedParts, setSelectedParts] = useState([]);
  const [serviceCharge, setServiceCharge] = useState(300);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [startAmc, setStartAmc] = useState(false);

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
          price: String(part.price),
          basePrice: part.price,
        },
      ];
    });
  };  

  const partsTotal = selectedParts.reduce(
    (sum, part) => sum + Number(part.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * discountPercent) / 100
  );

  const finalAmount = partsTotal + serviceCharge - discountAmount;

  /* ---------- VALIDATION ---------- */
  const isCustomerValid = isNewCustomer
    ? customer.name && customer.phone
    : true;

  const isFormValid =
    isCustomerValid &&
    selectedParts.length > 0 &&
    serviceCharge >= 0;

  /* ---------- SAVE HANDLER ---------- */
  const handleSave = () => {
    const payload = {
      customer: isNewCustomer ? customer : "EXISTING_CUSTOMER_ID",
      parts: selectedParts,
      serviceCharge,
      discountPercent,
      discountAmount,
      totalAmount: finalAmount,
      startAmc,
    };

    console.log("SERVICE DATA TO SAVE:", payload);
    alert("Service saved successfully (mock)");
  };

  const updatePartPrice = (id, value) => {
    if (!/^\d*$/.test(value)) return;

    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, price: Number(value || 0) }
          : p
      )
    );
  };

  return (
    <div className="service-container">
      <h2 className="page-title">Add Service</h2>

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
          <input placeholder="Search by name or mobile number" />
        )}
      </div>

      {isNewCustomer && (
        <div className="card">
          <p className="label">New Customer Details</p>
          <input
            placeholder="Customer Name *"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />
          <input
            placeholder="Mobile Number *"
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
              setCustomer({ ...customer, reference: e.target.value })
            }
          />
        </div>
      )}

      {/* SERVICE DATE */}
      <div className="card">
        <p className="label">Service Date</p>
        <input type="date" />
      </div>

      {/* PARTS */}
      <div className="card">
        <p className="label">Parts Replaced</p>

        <div className="parts-grid">
          {RO_PARTS.map((part) => {
            const selected = selectedParts.find(
              (p) => p.id === part.id
            );

            return (
              <div
                key={part.id}
                className={`part-item ${selected ? "selected" : ""}`}
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

        {/* Parts total */}
        <div className="bill-row">
          <span>Parts Total</span>
          <strong>₹{partsTotal}</strong>
        </div>

        {/* Service charge */}
        <div className="bill-input">
          <label>Service Charge (₹)</label>
          <input
            type="number"
            placeholder="300"
            value={serviceCharge}
            onChange={(e) =>
              setServiceCharge(Number(e.target.value) || 0)
            }
          />
        </div>

        {/* Discount percent */}
        <div className="bill-input">
          <label>Discount on Parts (%)</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>

        {/* Discount amount */}
        <div className="bill-row">
          <span>Discount Amount</span>
          <strong>- ₹{discountAmount}</strong>
        </div>

        {/* Final total */}
        <div className="bill-total">
          Total Bill: ₹{finalAmount}
        </div>
      </div>

      {/* AMC */}
      <div className="card">
        <label className="amc-option">
          <input
            type="checkbox"
            checked={startAmc}
            onChange={() => setStartAmc(!startAmc)}
          /> Start AMC for this RO
        </label>
      </div>

      {/* ACTIONS */}
      <div className="save-bar">
        <button
          className="secondary-btn"
          onClick={() => window.print()}
        >
          Download Bill
        </button>

        <button
          className="save-btn"
          disabled={!isFormValid}
          onClick={handleSave}
        >
          Save Service
        </button>
      </div>
      
      {/* PRINTABLE BILL */}
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
            <p><strong>Invoice #:</strong> ________</p>
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
            <p><strong>Thank you for your business</strong></p>
            <p>Terms & Conditions apply</p>
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

export default AddService;