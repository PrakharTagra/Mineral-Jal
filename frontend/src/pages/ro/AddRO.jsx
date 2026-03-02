import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddService.css"; // same styling as service
import { RO_PARTS } from "../../data/roParts";

const AddRO = () => {
  const navigate = useNavigate();

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
  });

  const invoiceRef = useRef("");
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [roModel, setRoModel] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [note, setNote] = useState("");

  const [selectedParts, setSelectedParts] = useState([]);
  const [installationCost, setInstallationCost] = useState(1000);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [startAmc, setStartAmc] = useState(true);

  useEffect(() => {
    if (!isNewCustomer) {
      fetch(`${import.meta.env.VITE_API_URL}/api/customers`)
        .then(res => res.json())
        .then(data => setCustomers(data))
        .catch(err => console.error(err));
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

      return [
        ...prev,
        {
          id: part.id,
          name: part.name,
          price: String(part.price),
          basePrice: part.price,
        },
      ];
    });
  };

  const updatePartPrice = (id, value) => {
    if (!/^\d*$/.test(value)) return;

    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, price: value } : p
      )
    );
  };

  const partsTotal = selectedParts.reduce(
    (sum, part) => sum + Number(part.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * discountPercent) / 100
  );

  const finalAmount =
    partsTotal + installationCost - discountAmount;

  const isCustomerValid = isNewCustomer
    ? customer.name.trim() !== "" &&
      customer.phone.trim() !== ""
    : selectedCustomerId !== null;

  const isFormValid =
    isCustomerValid &&
    selectedParts.length > 0 &&
    installationCost >= 0 &&
    roModel.trim() !== "" &&
    installDate !== "";

  const handleSave = async () => {
    const invoiceNumber = generateInvoiceNumber();
    let customerId;

    if (isNewCustomer) {
      const customerRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customer),
        }
      );

      const customerData = await customerRes.json();
      customerId = customerData.customer.id;
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
          installationCost,
          discountPercent,
          discountAmount,
          totalAmount: finalAmount,
          startAmc,
        }),
      }
    );

    const roData = await roRes.json();

    if (roData.success) {
      navigate(`/bill/${invoiceNumber}`);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="service-container">
      <h2 className="page-title">Add RO Installation</h2>

      {/* CUSTOMER SECTION */}
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
              placeholder="Search by name or mobile number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm.trim() !== "" && (
              <div style={{ marginTop: 8 }}>
                {filteredCustomers.length === 0 ? (
                  <p style={{ fontSize: 12 }}>
                    No customers found
                  </p>
                ) : (
                  filteredCustomers.map((c) => (
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
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* RO DETAILS */}
      <div className="card">
        <p className="label">RO Details</p>
        <input
          placeholder="RO Model *"
          value={roModel}
          onChange={(e) => setRoModel(e.target.value)}
        />
        <input
          type="date"
          value={installDate}
          onChange={(e) =>
            setInstallDate(e.target.value)
          }
        />
        <textarea
          placeholder="Notes (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* PARTS */}
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
                className={`part-item ${
                  selected ? "selected" : ""
                }`}
                onClick={() => togglePart(part)}
              >
                <span className="part-name">
                  {part.name}
                </span>

                {selected ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    className="part-price-input"
                    value={selected.price}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    onChange={(e) =>
                      updatePartPrice(
                        part.id,
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <span className="part-price">
                    ₹{part.price}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BILLING */}
      <div className="card highlight">
        <p className="label">Billing Summary</p>

        <div className="bill-row">
          <span>Parts Total</span>
          <strong>₹{partsTotal}</strong>
        </div>

        <div className="bill-input">
          <label>Installation Cost (₹)</label>
          <input
            type="number"
            value={installationCost}
            onChange={(e) =>
              setInstallationCost(
                Number(e.target.value) || 0
              )
            }
          />
        </div>

        <div className="bill-input">
          <label>Discount on Parts (%)</label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) =>
              setDiscountPercent(
                Number(e.target.value) || 0
              )
            }
          />
        </div>

        <div className="bill-row">
          <span>Discount Amount</span>
          <strong>- ₹{discountAmount}</strong>
        </div>

        <div className="bill-total">
          Total Bill: ₹{finalAmount}
        </div>
      </div>

      <div className="card">
        <label className="amc-option">
          <input
            type="checkbox"
            checked={startAmc}
            onChange={() =>
              setStartAmc(!startAmc)
            }
          />
          Start AMC for this RO
        </label>
      </div>

      <div className="save-bar">
        <button
          className="save-btn"
          disabled={!isFormValid}
          onClick={handleSave}
        >
          Save RO
        </button>
      </div>
    </div>
  );
};

export default AddRO;