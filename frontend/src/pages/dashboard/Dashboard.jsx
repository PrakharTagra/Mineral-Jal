import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    activeAmcs: 0,
    dueSoon: 0,
    totalServices: 0,
    totalCustomers: 0,
  });

  const [todaysWork, setTodaysWork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [customerRes, serviceRes, amcRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/customers`),
          fetch(`${import.meta.env.VITE_API_URL}/api/services`),
          fetch(`${import.meta.env.VITE_API_URL}/api/amcs`)
        ]);

        const customers = await customerRes.json();
        const services = await serviceRes.json();
        const amcs = await amcRes.json();

        /* ===== Summary ===== */

        const activeAmcs = amcs.filter(a => a.status === "ACTIVE").length;
        const totalCustomers = customers.length;
        const totalServices = services.length;

        /* ===== Find Due AMC Visits ===== */

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        const dueAmcs = [];

        amcs.forEach((amc) => {

          const customerName = amc.customerId?.name || "Customer";

          const checkpoints = [
            { key: "fourMonth", label: "4 Month Service" },
            { key: "eightMonth", label: "8 Month Service" },
            { key: "twelveMonth", label: "12 Month Service" }
          ];

          checkpoints.forEach((cp) => {
            const checkpoint = amc[cp.key];

            if (
              checkpoint &&
              !checkpoint.completed &&
              new Date(checkpoint.date).toISOString().slice(0,10) <= todayStr
            ) {
              dueAmcs.push({
                id: amc._id,
                type: "AMC Service",
                customer: customerName,
                detail: cp.label
              });
            }
          });

        });

        setSummary({
          activeAmcs,
          dueSoon: dueAmcs.length,
          totalServices,
          totalCustomers,
        });

        setTodaysWork(dueAmcs);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-container">

      <h2 className="page-title">Dashboard</h2>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard title="Active AMCs" value={summary.activeAmcs} />
        <SummaryCard title="AMCs Due" value={summary.dueSoon} />
        <SummaryCard title="Total Services" value={summary.totalServices} />
        <SummaryCard title="Total Customers" value={summary.totalCustomers} />
      </div>

      {/* Actions */}
      <div className="actions-grid">
        <ActionButton label="Add New RO" onClick={() => navigate("/add-ro")} />
        <ActionButton label="Add Service" onClick={() => navigate("/add-service")} />
        <ActionButton label="AMC Tracker" onClick={() => navigate("/amc")} />
        <ActionButton label="Customers" onClick={() => navigate("/customers")} />
      </div>

      {/* Today's Work */}
      <div className="today-section">
        <h3>Due AMC Visits</h3>

        {todaysWork.length === 0 ? (
          <p className="empty-text">No AMC visits due 🎉</p>
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
                onClick={() => navigate("/amc")}
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ===== Components ===== */

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