import { useEffect, useState } from "react";
import "./Bills.css";
import { useNavigate } from "react-router-dom";
const Bills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  // const sorted = [...stored].sort(
  //   (a, b) => new Date(b.date) - new Date(a.date)
  // );

  useEffect(() => {
  const fetchBills = async () => {
    try {
      const [serviceRes, roRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/services`),
        fetch(`${import.meta.env.VITE_API_URL}/api/ro`)
      ]);

      const services = await serviceRes.json();
      const ros = await roRes.json();

      // Normalize services
      const normalizedServices = services.map((s) => ({
        ...s,
        type: "SERVICE",
        displayDate: s.date,
      }));

      // Normalize RO
      const normalizedROs = ros.map((r) => ({
        ...r,
        type: "RO",
        displayDate: r.installDate,
      }));

      const combined = [
        ...normalizedServices,
        ...normalizedROs,
      ];

      // Sort latest first
      combined.sort(
        (a, b) =>
          new Date(b.displayDate) -
          new Date(a.displayDate)
      );

      setBills(combined);

    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  fetchBills();
}, []);

  const filteredBills =
    activeTab === "ALL"
      ? bills
      : bills.filter((b) => b.type === activeTab);

  return (
    <div className="bills-container">
      <h2 className="page-title">Bills</h2>

      {/* Tabs */}
      <div className="bill-tabs">
        {["ALL", "SERVICE", "RO"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "ALL" ? "All" : tab}
          </button>
        ))}
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <div className="empty-state">
          No bills found
        </div>
      ) : (
        filteredBills.map((bill) => (
          <div className="bill-card" key={bill.invoiceNumber}>
            <div className="bill-top">
              <span className="invoice">
                {bill.invoiceNumber}
              </span>
              <span
                className={`badge ${
                  bill.type === "SERVICE"
                    ? "service"
                    : "ro"
                }`}
              >
                {bill.type}
              </span>
            </div>

            <div className="bill-middle">
              <p className="customer">
                {bill.customerId?.name || "Customer"}
              </p>
              <p className="date">
                {new Date(bill.displayDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bill-bottom">
              <strong>₹{bill.totalAmount}</strong>

              <button
                onClick={() =>
                  navigate(`/bill/${bill.invoiceNumber}`)
                }
              >
                View Bill
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Bills;