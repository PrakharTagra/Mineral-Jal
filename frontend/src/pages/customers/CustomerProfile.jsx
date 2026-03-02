import "./CustomerProfile.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [ros, setRos] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch customer
        const customerRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customers?id=${id}`
        );
        const customerData = await customerRes.json();
        setCustomer(customerData);

        // Fetch RO
        const roRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ro`
        );
        const roData = await roRes.json();

        const customerROs = roData.filter(
          (r) => String(r.customerId) === String(id)
        );
        setRos(customerROs);

        // Fetch services
        const serviceRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/services`
        );
        const serviceData = await serviceRes.json();

        const customerServices = serviceData.filter(
          (s) => String(s.customerId) === String(id)
        );
        setServices(customerServices);

      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!customer) {
    return <div className="profile-container">Customer not found</div>;
  }

  return (
    <div className="profile-container">
      <h2>Customer Profile</h2>

      {/* Customer Info */}
      <div className="card">
        <p className="title">{customer.name}</p>
        <p>{customer.phone}</p>
        <p>{customer.address}</p>
        {customer.reference && (
          <p className="muted">
            Reference: {customer.reference}
          </p>
        )}

        <div className="actions">
          <button
            onClick={() => window.open(`tel:${customer.phone}`)}
          >
            📞 Call
          </button>

          <button
            onClick={() =>
              window.open(
                `https://wa.me/91${customer.phone}`,
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

        {ros.length === 0 ? (
          <p className="muted">No RO installed</p>
        ) : (
          ros.map((ro) => (
            <div key={ro.id} className="ro-item">
              <div>
                <strong>{ro.model || "RO Model"}</strong>
                <p className="muted">
                  Installed on:{" "}
                  {ro.installDate
                    ? new Date(ro.installDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  AMC:{" "}
                  <span
                    className={`status ${
                      ro.startAmc ? "active" : "expired"
                    }`}
                  >
                    {ro.startAmc ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>

              <div className="ro-actions">
                <button
                  className="primary"
                  onClick={() =>
                    navigate("/add-service", {
                      state: { customerId: customer.id },
                    })
                  }
                >
                  ➕ Add Service
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    navigate(`/bill/${ro.invoiceNumber}`)
                  }
                >
                  🧾 Download Bill
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service History */}
      <div className="card">
        <p className="section-title">Service History</p>

        {services.length === 0 ? (
          <p className="muted">No service history</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="service-item">
              <div>
                <strong>
                  {new Date(service.date).toLocaleDateString()}
                </strong>
                <p className="muted">
                  Parts:{" "}
                  {service.parts
                    ?.map((p) => p.name)
                    .join(", ") || "-"}
                </p>
              </div>

              <div className="service-actions">
                <span className="cost">
                  ₹{service.totalAmount}
                </span>

                <button
                  className="secondary"
                  onClick={() =>
                    navigate(`/bill/${service.invoiceNumber}`)
                  }
                >
                  🧾 Download Bill
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Actions */}
      <div className="profile-save-bar">
        <button
          className="primary"
          onClick={() =>
            navigate("/add-service", {
              state: { customerId: customer.id },
            })
          }
        >
          ➕ Add Service
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;