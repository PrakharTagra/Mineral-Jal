import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AMCTracker.css";
const amcs = [
  {
    id: 1,
    customer: "Rahul Sharma",
    roModel: "AquaPro",
    status: "ACTIVE",
    nextReminder: "22 Aug 2026",
  },
  {
    id: 2,
    customer: "Neha Jain",
    roModel: "Kent Grand",
    status: "DUE",
    nextReminder: "15 Jul 2026",
  },
  {
    id: 3,
    customer: "Ankit Verma",
    roModel: "PureIt",
    status: "EXPIRED",
    expiredOn: "10 May 2026",
  },
];

const AMCTracker = () => {
  const [tab, setTab] = useState("ACTIVE");
  const navigate = useNavigate();

  const filtered = amcs.filter((a) => {
    if (tab === "ACTIVE") return a.status === "ACTIVE";
    if (tab === "DUE") return a.status === "DUE";
    if (tab === "EXPIRED") return a.status === "EXPIRED";
    return false;
  });

  return (
    <div className="amc-container">
      <h2>AMC Tracker</h2>
    
      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "ACTIVE" ? "active" : ""}
          onClick={() => setTab("ACTIVE")}
        >
          Active
        </button>
        <button
          className={tab === "DUE" ? "active" : ""}
          onClick={() => setTab("DUE")}
        >
          Due Soon
        </button>
        <button
          className={tab === "EXPIRED" ? "active" : ""}
          onClick={() => setTab("EXPIRED")}
        >
          Expired
        </button>
      </div>

      {/* List */}
      <div className="list">
        {filtered.length === 0 && (
          <p className="empty">No records found</p>
        )}

        {filtered.map((amc) => (
          <div
            key={amc.id}
            className="amc-card clickable"
            onClick={() => navigate(`/customer/${amc.id}`)}
          >
            <div>
              <strong>{amc.customer}</strong>
              <p className="muted">{amc.roModel}</p>

              {amc.nextReminder && (
                <p className="muted">
                  Next Reminder: {amc.nextReminder}
                </p>
              )}

              {amc.expiredOn && (
                <p className="expired-text">
                  Expired on {amc.expiredOn}
                </p>
              )}
            </div>

            <div className="actions">
              {tab !== "EXPIRED" && <button>🛠️ Service</button>}
              <button>🔁 Renew</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AMCTracker;