import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader"; // adjust path if needed

const Dashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    activeAmcs: 0,
    dueSoon: 0,
    pendingServices: 0,
    totalCustomers: 0,
  });

  const [todaysWork, setTodaysWork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [customerRes, roRes, serviceRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/customers`),
          fetch(`${import.meta.env.VITE_API_URL}/api/ro`),
          fetch(`${import.meta.env.VITE_API_URL}/api/services`),
        ]);

        const customers = await customerRes.json();
        const ros = await roRes.json();
        const services = await serviceRes.json();

        /* ===== Summary Calculations ===== */

        const activeAmcs = ros.filter((r) => r.startAmc).length;

        const totalCustomers = customers.length;

        const pendingServices = services.length;

        /* ===== Today's Work ===== */

        const today = new Date().toISOString().slice(0, 10);

        const todayServices = services
          .filter(
            (s) =>
              s.date &&
              s.date.slice(0, 10) === today
          )
          .map((s) => ({
            id: s._id,
            type: "Service",
            customer: s.customerId?.name || "Customer",
            detail:
              s.parts?.map((p) => p.name).join(", ") ||
              "Service Work",
          }));

        setSummary({
          activeAmcs,
          dueSoon: 0, // future AMC reminder logic
          pendingServices,
          totalCustomers,
        });

        setTodaysWork(todayServices);

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

      {/* Header */}
      <h2 className="page-title">Dashboard</h2>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard title="Active AMCs" value={summary.activeAmcs} />
        <SummaryCard title="AMCs Due Soon" value={summary.dueSoon} />
        <SummaryCard title="Total Services" value={summary.pendingServices} />
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
          <p className="empty-text">
            No tasks for today 🎉
          </p>
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
                onClick={() => navigate("/add-service")}
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