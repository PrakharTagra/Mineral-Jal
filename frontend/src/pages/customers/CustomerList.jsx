import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader"; // adjust path
import "./CustomerList.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customers`
        );

        const data = await res.json();

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

  if (loading) return <Loader />;

  if (!customers.length) {
    return (
      <div className="customer-list-container">
        <h2 className="page-title">Customers</h2>
        <div className="empty-state">
          No customers found
        </div>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <h2 className="page-title">Customers</h2>

      {customers.map((c) => (
        <div
          key={c._id}
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
      ))}
    </div>
  );
};

export default CustomerList;