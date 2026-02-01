import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRO.css";
import { RO_PARTS } from "../../data/roParts";

const AddRO = () => {
  const navigate = useNavigate();

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
  });
  const invoiceRef = useRef("");

  const [selectedParts, setSelectedParts] = useState([]);
  const [makingCost, setMakingCost] = useState(1000);
  const [discountPercent, setDiscountPercent] = useState("");
  const [isSaved, setIsSaved] = useState(false);  

  const saveBill = (bill) => {
    const existing =
      JSON.parse(localStorage.getItem("MJ_BILLS")) || [];
    existing.push(bill);
    localStorage.setItem("MJ_BILLS", JSON.stringify(existing));
  };

  const generateInvoiceNumber = (type) => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

    const key = `invoice_counter_${type}_${dateStr}`;
    const lastCount = Number(localStorage.getItem(key) || 0) + 1;

    localStorage.setItem(key, lastCount);

    const prefix = type === "SERVICE" ? "MJ-S" : "MJ-R";

    return `${prefix}-${dateStr}-${String(lastCount).padStart(3, "0")}`;
  };

  /* ---------- PARTS ---------- */
  const togglePart = (part) => {
    setSelectedParts((prev) => {
      const exists = prev.find((p) => p.id === part.id);

      if (exists) {
        return prev.filter((p) => p.id !== part.id);
      }

      return [
        ...prev,
        {
          id: part.id,
          name: part.name,
          price: String(part.price), // string for editing
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

  /* ---------- BILLING ---------- */
  const partsTotal = selectedParts.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * (Number(discountPercent) || 0)) / 100
  );

  const finalAmount =
    partsTotal + makingCost - discountAmount;

  /* ---------- SAVE ---------- */
  const handleSave = () => {

    const invoiceNumber = generateInvoiceNumber("RO");
    invoiceRef.current = invoiceNumber;

    const payload = {
      invoiceNumber,
      date: new Date().toISOString(),
      type: "RO",
      customer: isNewCustomer ? customer : { name: "Existing Customer" },
      parts: selectedParts,
      makingCost,
      discountPercent,
      discountAmount,
      totalAmount: finalAmount,
      startAmc: true,
    };
    saveBill(payload);
    setIsSaved(true);
    navigate(`/bill/${invoiceNumber}`);
  };
  const pickFromContacts = async () => {
    if (!("contacts" in navigator)) {
      alert("Contact access not supported on this device");
      return;
    }

    try {
      const contacts = await navigator.contacts.select(
        ["name", "tel"],
        { multiple: false }
      );

      if (contacts.length > 0) {
        const contact = contacts[0];

        setCustomer((prev) => ({
          ...prev,
          name: contact.name?.[0] || "",
          phone: contact.tel?.[0] || "",
        }));
      }
    } catch (err) {
      console.error("Contact pick cancelled or failed", err);
    }
  };

  const isCustomerValid = isNewCustomer
    ? customer.name.trim() && customer.phone.trim()
    : true;

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
          <input placeholder="Search customer by name / mobile" />
        )}
      </div>

      {isNewCustomer && (
        <div className="card">
          <p className="label">Customer Details</p>
          <button
            type="button"
            className="secondary-btn-1"
            onClick={pickFromContacts}
            style={{ marginBottom: 10 }}
          >
            Pick from Contacts
          </button>

          <input
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />
          <input
            placeholder="Mobile Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />
          <input
            placeholder="Address"
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />
          <input
            placeholder="Reference (optional)"
            value={customer.reference}
            onChange={(e) =>
              setCustomer({
                ...customer,
                reference: e.target.value,
              })
            }
          />
        </div>
      )}

      {/* RO DETAILS */}
      <div className="card">
        <p className="label">RO Details</p>
        <input placeholder="RO Model (Eg. AquaPro)" />
        <input type="date" />
        <textarea placeholder="Notes (optional)" />
      </div>

      {/* COMPONENTS */}
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
                <span className="part-name">{part.name}</span>

                {selected ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    className="part-price-input"
                    value={selected.price}
                    placeholder="0"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updatePartPrice(part.id, e.target.value)
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
          <label>Making / Installation Cost (₹)</label>
          <input
            type="number"
            value={makingCost}
            onChange={(e) =>
              setMakingCost(Number(e.target.value) || 0)
            }
          />
        </div>

        <div className="bill-input">
          <label>Discount on Parts (%)</label>
          <input
            type="number"
            placeholder="0"
            value={discountPercent}
            onChange={(e) =>
              setDiscountPercent(e.target.value)
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

      {/* AMC INFO */}
      <div className="card">
        <p className="label">AMC Information</p>
        <ul className="info-list">
          <li>4-month service reminder</li>
          <li>8-month service reminder</li>
          <li>12-month renewal reminder</li>
        </ul>
      </div>

      {/* ACTIONS */}
      <div className="save-bar">
        <button
          className="save-btn"
          disabled={!isFormValid}
          onClick={handleSave}
        >
          Save RO & Start AMC
        </button>
      </div>
    </div>
  );
};

export default AddRO;