import { useState, useEffect } from "react";
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

  const togglePart = (part) => {
    setSelectedParts((prev) => {
      const exists = prev.find((p) => p.id === part.id);
      if (exists) return prev.filter((p) => p.id !== part.id);
      return [...prev, { ...part, price: String(part.price) }];
    });
  };

  const updatePartPrice = (id, value) => {
    if (!/^\d*$/.test(value)) return;
    setSelectedParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: value } : p))
    );
  };

  const partsTotal = selectedParts.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * discountPercent) / 100
  );

  const finalAmount = partsTotal + makingCost - discountAmount;

  const handleSave = async () => {
    setIsSubmitting(true);

    const invoiceNumber = generateInvoiceNumber();
    let customerId;

    try {
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

      {/* Customer Section (same as before) */}

      {/* RO Details */}
      <div className="card">
        <p className="label">RO Details</p>
        <input
          placeholder="RO Model"
          value={roModel}
          onChange={(e) => setRoModel(e.target.value)}
        />
        <input
          type="date"
          value={installDate}
          onChange={(e) => setInstallDate(e.target.value)}
        />
        <textarea
          placeholder="Notes"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Parts */}
      <div className="card">
        <p className="label">RO Components</p>
        <div className="parts-grid">
          {RO_PARTS.map((part) => {
            const selected = selectedParts.find(
              (p) => p.id === part.id
            );
            return (
              <div
                key={part.id}
                className={`part-item ${selected ? "selected" : ""}`}
                onClick={() => togglePart(part)}
              >
                <span>{part.name}</span>
                {selected ? (
                  <input
                    type="text"
                    value={selected.price}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updatePartPrice(part.id, e.target.value)
                    }
                  />
                ) : (
                  <span>₹{part.price}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing */}
      <div className="card highlight">
        <div>Parts Total: ₹{partsTotal}</div>
        <div>
          Installation Cost:
          <input
            type="number"
            value={makingCost}
            onChange={(e) =>
              setMakingCost(Number(e.target.value) || 0)
            }
          />
        </div>
        <div>
          Discount %:
          <input
            type="number"
            value={discountPercent}
            onChange={(e) =>
              setDiscountPercent(Number(e.target.value) || 0)
            }
          />
        </div>
        <div>Discount Amount: ₹{discountAmount}</div>
        <div><strong>Total: ₹{finalAmount}</strong></div>
      </div>

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