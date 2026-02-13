import "./CustomerProfile.css";
import { useNavigate } from "react-router-dom";

const mockCustomer = {
  name: "Rahul Sharma",
  phone: "9876543210",
  address: "Indore, MP",
  reference: "Society A",
};

const ros = [
  {
    id: 1,
    model: "AquaPro",
    installedBy: "OWNER",
    amcStatus: "Active",
    nextReminder: "22 Aug 2026",
  },
  {
    id: 2,
    model: "Kent Grand",
    installedBy: "EXTERNAL",
    amcStatus: "Expired",
    nextReminder: null,
  },
];

const services = [
  {
    id: 1,
    date: "10 Jan 2026",
    parts: ["Sediment Filter", "Carbon Filter"],
    cost: 600,
    notes: "Normal service",
  },
  {
    id: 2,
    date: "02 Oct 2025",
    parts: ["Membrane"],
    cost: 1500,
    notes: "Low TDS issue",
  },
];

const CustomerProfile = () => {
  const navigate = useNavigate();
  return (
    <div className="profile-container">
      <h2>Customer Profile</h2>

      {/* Customer Info */}
      <div className="card">
        <p className="title">{mockCustomer.name}</p>
        <p>{mockCustomer.phone}</p>
        <p>{mockCustomer.address}</p>
        <p className="muted">Reference: {mockCustomer.reference}</p>

        <div className="actions">
        <button
          onClick={() => window.open(`tel:${mockCustomer.phone}`)}
        >
          📞 Call
        </button>

        <button
          onClick={() =>
            window.open(
              `https://wa.me/91${mockCustomer.phone}`,
              "_blank"
            )
          }
        >
          💬 WhatsApp
        </button>
      </div>
      </div>

      {/* RO List */}
      <div className="card">
        <p className="section-title">ROs</p>

        {ros.map((ro) => (
          <div key={ro.id} className="ro-item clickable">
            <div>
              <strong>{ro.model}</strong>
              <p className="muted">
                Installed by:{" "}
                {ro.installedBy === "OWNER" ? "Owner" : "External"}
              </p>
              <p>
                AMC Status:{" "}
                <span
                className={`status ${
                  ro.amcStatus === "Active"
                    ? "active"
                    : ro.amcStatus === "Expired"
                    ? "expired"
                    : "due"
                }`}
              >
                {ro.amcStatus}
              </span>

              </p>
              {ro.nextReminder && (
                <p className="muted">Next Reminder: {ro.nextReminder}</p>
              )}
            </div>

            <div className="ro-actions">
              <button className="primary" onClick={() => navigate("/add-service")}>
                ➕ Add Service
              </button>
              <button className="secondary" onClick={() => navigate("/amc")}>
                🔁 Renew AMC
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service History */}
      <div className="card">
        <p className="section-title">Service History</p>

        {services.map((service) => (
          <div key={service.id} className="service-item">
            <div>
              <strong>{service.date}</strong>
              <p className="muted">
                Parts: {service.parts.join(", ")}
              </p>
              <p className="muted">Notes: {service.notes}</p>
            </div>
            <span className="cost">₹{service.cost}</span>
          </div>
        ))}
      </div>

      {/* Sticky Actions */}
      <div className="profile-save-bar">
        <button
          className="primary"
          onClick={() => navigate("/add-service")}
        >
          ➕ Add Service
        </button>

        <button
          className="secondary"
          onClick={() => navigate("/amc")}
        >
          🔁 Renew AMC
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;