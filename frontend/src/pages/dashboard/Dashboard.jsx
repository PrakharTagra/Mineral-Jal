import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

// mock data (later replace with API)
const summary = {
  activeAmcs: 42,
  dueSoon: 8,
  pendingServices: 5,
  totalCustomers: 120,
};

const todaysWork = [
  {
    id: 1,
    type: "AMC Reminder",
    customer: "Rahul Sharma",
    detail: "4-month AMC reminder",
  },
  {
    id: 2,
    type: "Service",
    customer: "Ankit Verma",
    detail: "Filter replacement",
  },
  {
    id: 3,
    type: "Renewal",
    customer: "Neha Jain",
    detail: "AMC renewal pending",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      {/* Header */}
      <h2 className="page-title">Dashboard</h2>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard title="Active AMCs" value={summary.activeAmcs} />
        <SummaryCard title="AMCs Due Soon" value={summary.dueSoon} />
        <SummaryCard title="Pending Services" value={summary.pendingServices} />
        <SummaryCard title="Total Customers" value={summary.totalCustomers} />
      </div>

      {/* Primary Actions */}
      <div className="actions-grid">
        <ActionButton
          label="Add New RO"
          onClick={() => navigate("/add-ro")}
        />
        <ActionButton
          label="Add Service"
          onClick={() => navigate("/add-service")}
        />
        <ActionButton
          label="AMC Tracker"
          onClick={() => navigate("/amc")}
        />
        <ActionButton
          label="Customers"
          onClick={() => navigate("/customers")}
        />
      </div>

      {/* Today's Work */}
      <div className="today-section">
        <h3>Today's Work</h3>

        {todaysWork.length === 0 ? (
          <p className="empty-text">No tasks for today 🎉</p>
        ) : (
          todaysWork.map((item) => (
            <div key={item.id} className="today-item">
              <div>
                <strong>{item.type}</strong>
                <p>{item.customer}</p>
                <span>{item.detail}</span>
              </div>
              <button
                className="quick-btn"
                onClick={() => {
                  if (item.type === "Service") navigate("/add-service");
                  else navigate("/amc");
                }}
              >View</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <p className="summary-title">{title}</p>
    <h3 className="summary-value">{value}</h3>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button className="action-btn" onClick={onClick}>
    {label}
  </button>
);

export default Dashboard;