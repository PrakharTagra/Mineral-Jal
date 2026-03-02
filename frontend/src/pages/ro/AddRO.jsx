import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRO.css";
import { RO_PARTS } from "../../data/roParts";

const AddRO = () => {
  const navigate = useNavigate();

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
  });

  const [roModel, setRoModel] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [note, setNote] = useState("");

  const [selectedParts, setSelectedParts] = useState([]);
  const [makingCost, setMakingCost] = useState(1000);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* 🔥 Fetch customers like AddService */
  useEffect(() => {
    if (!isNewCustomer) {
      fetch(`${import.meta.env.VITE_API_URL}/api/customers`)
        .then((res) => res.json())
        .then((data) => setCustomers(data))
        .catch((err) => console.error(err));
    }
  }, [isNewCustomer]);

  const generateInvoiceNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const key = `invoice_counter_RO_${dateStr}`;
    const lastCount = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, lastCount);
    return `MJ-R-${dateStr}-${String(lastCount).padStart(3, "0")}`;
  };

  /* ---------- PARTS ---------- */
  const togglePart = (part) => {
    setSelectedParts((prev) => {
      const exists = prev.find((p) => p.id === part.id);
      if (exists) return prev.filter((p) => p.id !== part.id);

      return [
        ...prev,
        {
          id: part.id,
          name: part.name,
          price: String(part.price),
        },
      ];
    });
  };

  const updatePartPrice = (id, value) => {
    if (!/^\d*$/.test(value)) return;
    setSelectedParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: value } : p))
    );
  };

  /* ---------- BILLING ---------- */
  const partsTotal = selectedParts.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * discountPercent) / 100
  );

  const finalAmount = partsTotal + makingCost - discountAmount;

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    setIsSubmitting(true);

    const invoiceNumber = generateInvoiceNumber();
    let customerId;

    try {
      // 🔥 Create customer first if new
      if (isNewCustomer) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customers`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer),
          }
        );

        const data = await res.json();
        customerId = data.customer.id;
      } else {
        customerId = selectedCustomerId;
      }

      // 🔥 Now create RO
      const roRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceNumber,
            customerId,
            model: roModel,
            installDate,
            note,
            components: selectedParts,
            installationCost: makingCost,
            discountPercent,
            discountAmount,
            totalAmount: finalAmount,
            startAmc: true,
          }),
        }
      );

      const roData = await roRes.json();

      if (roData.success) {
        navigate(`/bill/${invoiceNumber}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save RO");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const isCustomerValid = isNewCustomer
    ? customer.name.trim() && customer.phone.trim()
    : selectedCustomerId !== null;

  const isFormValid =
    isCustomerValid &&
    selectedParts.length > 0 &&
    makingCost >= 0;

  return (
    <div className="ro-container">
      <h2 className="page-title">Add New RO</h2>

      {/* CUSTOMER */}
      <div className="card">
        <p className="label">Customer</p>

        <div className="toggle">
          <button
            className={!isNewCustomer ? "active" : ""}
            onClick={() => setIsNewCustomer(false)}
          >
            Existing
          </button>
          <button
            className={isNewCustomer ? "active" : ""}
            onClick={() => setIsNewCustomer(true)}
          >
            New
          </button>
        </div>

        {!isNewCustomer && (
          <>
            <input
              placeholder="Search by name or mobile"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <div style={{ marginTop: 8 }}>
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: 8,
                      border: "1px solid #ddd",
                      marginBottom: 4,
                      cursor: "pointer",
                      background:
                        selectedCustomerId === c.id
                          ? "#e6f7ff"
                          : "white",
                    }}
                    onClick={() => {
                      setSelectedCustomerId(c.id);
                      setSearchTerm(c.name);
                    }}
                  >
                    <strong>{c.name}</strong>
                    <div style={{ fontSize: 12 }}>
                      {c.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Rest of UI (RO details, parts, billing) stays same */}

      <div className="save-bar">
        <button
          className="save-btn"
          disabled={!isFormValid || isSubmitting}
          onClick={handleSave}
        >
          {isSubmitting ? "Saving..." : "Save RO"}
        </button>
      </div>
    </div>
  );
};

export default AddRO;