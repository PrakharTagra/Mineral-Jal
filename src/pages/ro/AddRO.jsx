import { useState } from "react";
import "./AddRO.css";
import { RO_PARTS } from "../../data/roParts";

const AddRO = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [makingCost, setMakingCost] = useState(1000);
  const [discount, setDiscount] = useState(0);

  const togglePart = (part) => {
    setSelectedParts((prev) =>
      prev.some((p) => p.id === part.id)
        ? prev.filter((p) => p.id !== part.id)
        : [...prev, part]
    );
  };

  const partsTotal = selectedParts.reduce(
    (sum, part) => sum + part.price,
    0
  );

  const finalAmount = partsTotal + makingCost - discount;

  return (
    <div className="ro-container">
      <h2 className="page-title">Add New RO</h2>

      {/* Customer */}
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
          <input
            className="mt"
            placeholder="Search customer by name / mobile"
          />
        )}
      </div>

      {/* New Customer */}
      {isNewCustomer && (
        <div className="card">
          <p className="label">Customer Details</p>
          <input placeholder="Customer Name" />
          <input placeholder="Mobile Number" />
          <input placeholder="Address" />
          <input placeholder="Reference (optional)" />
        </div>
      )}

      {/* RO Details */}
      <div className="card">
        <p className="label">RO Details</p>
        <input placeholder="RO Model (Eg. AquaPro)" />
        <input type="date" />
        <textarea placeholder="Notes (optional)" />
      </div>

      {/* RO Components */}
      <div className="card">
        <p className="label">RO Components</p>

        <div className="parts-grid">
          {RO_PARTS.map((part) => (
            <div
              key={part.id}
              className={`part-item ${
                selectedParts.some((p) => p.id === part.id) ? "selected" : ""
              }`}
              onClick={() => togglePart(part)}
            >
              <span className="part-name">{part.name}</span>
              <span className="part-price">₹{part.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      <div className="card highlight">
        <p className="label">Billing Summary</p>

        <div className="bill-row">
          <span>Parts Total</span>
          <strong>₹{partsTotal}</strong>
        </div>

        <input
          type="number"
          placeholder="Making / Installation Cost"
          value={makingCost}
          onChange={(e) => setMakingCost(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Discount"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />

        <div className="bill-total">
          Total Bill: ₹{finalAmount}
        </div>
      </div>

      {/* AMC Info */}
      <div className="card">
        <p className="label">AMC Information</p>
        <ul className="info-list">
          <li>4-month service reminder (10 days before)</li>
          <li>8-month service reminder (10 days before)</li>
          <li>12-month renewal reminder (10 days before)</li>
        </ul>
      </div>

      {/* Printable Bill */}
      <div className="bill-print">
        <h2>RO Installation Bill</h2>
        <p>Date: {new Date().toLocaleDateString()}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {selectedParts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
              </tr>
            ))}
            <tr>
              <td>Making / Installation</td>
              <td>₹{makingCost}</td>
            </tr>
            {discount > 0 && (
              <tr>
                <td>Discount</td>
                <td>-₹{discount}</td>
              </tr>
            )}
          </tbody>
        </table>

        <h3>Total: ₹{finalAmount}</h3>
        <p className="bill-note">
          Thank you for choosing our RO services.
        </p>
      </div>

      {/* Actions */}
      <div className="save-bar">
        <button className="secondary-btn" onClick={() => window.print()}>
          Download Bill
        </button>
        <button className="save-btn">Save RO & Start AMC</button>
      </div>
    </div>
  );
};

export default AddRO;