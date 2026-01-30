import { useNavigate } from "react-router-dom";
import "./CustomerList.css";

const customers = [
  { id: 1, name: "Rahul Sharma", phone: "9876543210" },
  { id: 2, name: "Neha Jain", phone: "9123456780" },
];

const CustomerList = () => {
  const navigate = useNavigate();

  return (
    <div className="customer-list-container">
      <h2 className="page-title">Customers</h2>

      {customers.map((c) => (
        <div
          key={c.id}
          className="customer-card"
          onClick={() => navigate(`/customer/${c.id}`)}
        >
          <div>
            <p className="customer-name">{c.name}</p>
            <p className="customer-phone">{c.phone}</p>
          </div>
          <span className="arrow">›</span>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;