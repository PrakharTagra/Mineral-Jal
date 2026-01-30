import { useState } from "react";
import "./AddService.css";
import { RO_PARTS } from "../../data/roParts";

const AddService = () => {
  const [serviceType, setServiceType] = useState("OWNER");
  const [selectedParts, setSelectedParts] = useState([]);
  const [serviceCharge, setServiceCharge] = useState(300);
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

  const finalAmount = partsTotal + serviceCharge - discount;

  return (
    <div className="service-container">
      <h2 className="page-title">Add Service</h2>

      {/* Service Type */}
      <div className="card">
        <p className="label">Service Type</p>
        <div className="toggle">
          <button
            className={serviceType === "OWNER" ? "active" : ""}
            onClick={() => setServiceType("OWNER")}
          >
            Owner Installed
          </button>
          <button
            className={serviceType === "EXTERNAL" ? "active" : ""}
            onClick={() => setServiceType("EXTERNAL")}
          >
            External RO
          </button>
        </div>
      </div>

      {/* Customer */}
      <div className="card">
        <p className="label">Customer</p>
        <input placeholder="Search by name or mobile number" />
      </div>

      {/* External RO */}
      {serviceType === "EXTERNAL" && (
        <div className="card">
          <p className="label">RO Brand / Model</p>
          <input placeholder="Eg. Kent, AquaGuard" />
        </div>
      )}

      {/* Service Date */}
      <div className="card">
        <p className="label">Service Date</p>
        <input type="date" />
      </div>

      {/* Parts */}
      <div className="card">
        <p className="label">Parts Replaced</p>

        <div className="parts-grid">
          {RO_PARTS.map((part) => (
            <div
              key={part.id}
              className={`part-item ${
                selectedParts.some((p) => p.id === part.id)
                  ? "selected"
                  : ""
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
          placeholder="Service Charge"
          value={serviceCharge}
          onChange={(e) => setServiceCharge(Number(e.target.value))}
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

      {/* AMC Option */}
      {serviceType === "EXTERNAL" && (
        <div className="card">
          <label className="amc-option">
            <input type="checkbox" /> Start AMC for this RO
          </label>
        </div>
      )}

      {/* PRINTABLE BILL */}
      <div className="bill-print">
        <h2>Service Bill</h2>
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
              <td>Service Charge</td>
              <td>₹{serviceCharge}</td>
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

      {/* Bottom Actions */}
      <div className="save-bar">
        <button
          className="secondary-btn"
          onClick={() => window.print()}
        >
          Download Bill
        </button>
        <button className="save-btn">Save Service</button>
      </div>
    </div>
  );
};

export default AddService;