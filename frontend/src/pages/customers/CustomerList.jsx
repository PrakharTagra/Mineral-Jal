import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerList.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customers`
        );

        const data = await res.json();

        // Sort latest first (optional)
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setCustomers(sorted);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="customer-list-container">
        <h2 className="page-title">Customers</h2>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <h2 className="page-title">Customers</h2>

      {customers.length === 0 ? (
        <div className="empty-state">
          No customers found
        </div>
      ) : (
        customers.map((c) => (
          <div
            key={c.id}
            className="customer-card"
            onClick={() => navigate(`/customer/${c._id}`)}
          >
            <div>
              <p className="customer-name">
                {c.name || "Unnamed Customer"}
              </p>
              <p className="customer-phone">
                {c.phone || "-"}
              </p>
            </div>
            <span className="arrow">›</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerList;