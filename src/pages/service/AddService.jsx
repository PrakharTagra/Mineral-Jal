import { useState,useRef } from "react";
import "./AddService.css";
import { RO_PARTS } from "../../data/roParts";

const AddService = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
  });
  const invoiceRef = useRef("");
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

  const [selectedParts, setSelectedParts] = useState([]);
  const [serviceCharge, setServiceCharge] = useState(300);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [startAmc, setStartAmc] = useState(false);

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
          price: String(part.price),
          basePrice: part.price,
        },
      ];
    });
  };  

  const partsTotal = selectedParts.reduce(
    (sum, part) => sum + Number(part.price || 0),
    0
  );

  const discountAmount = Math.round(
    (partsTotal * discountPercent) / 100
  );

  const finalAmount = partsTotal + serviceCharge - discountAmount;

  /* ---------- VALIDATION ---------- */
  const isCustomerValid = isNewCustomer
    ? customer.name.trim() !== "" && customer.phone.trim() !== ""
    : selectedCustomerId !== null;

  const isFormValid =
    isCustomerValid &&
    selectedParts.length > 0 &&
    serviceCharge >= 0;


  const [isSaved, setIsSaved] = useState(false);  
  /* ---------- SAVE HANDLER ---------- */
  const handleSave = () => {
    const invoiceNumber = generateInvoiceNumber("SERVICE");
    invoiceRef.current = invoiceNumber;

    const payload = {
      invoiceNumber,
      date: new Date().toISOString(),
      type: "SERVICE",
      customer: isNewCustomer
        ? customer
        : { id: selectedCustomerId },
      parts: selectedParts,
      serviceCharge,
      discountPercent,
      discountAmount,
      totalAmount: finalAmount,
      startAmc,
    };

    saveBill(payload);
    setIsSaved(true);
    alert("Service saved successfully");
    window.location.href = `/bill/${invoiceNumber}`;
  };

  const updatePartPrice = (id, value) => {
    if (!/^\d*$/.test(value)) return;

    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, price: value }   // keep string
          : p
      )
    );
  };

  return (
    <div className="service-container">
      <h2 className="page-title">Add Service</h2>

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
            <input placeholder="Search by name or mobile number" />
            <button
              style={{ marginTop: 8 }}
              onClick={() => setSelectedCustomerId("TEMP_ID")}
            >
              Select Customer
            </button>
          </>
        )}

      </div>

      {isNewCustomer && (
        <div className="card">
          <p className="label">New Customer Details</p>
          <input
            placeholder="Customer Name *"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />
          <input
            placeholder="Mobile Number *"
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
              setCustomer({ ...customer, reference: e.target.value })
            }
          />
        </div>
      )}
      {!isCustomerValid && (
        <p style={{ color: "red", fontSize: 12 }}>
          Please select or add a customer
        </p>
      )}

      {/* SERVICE DATE */}
      <div className="card">
        <p className="label">Service Date</p>
        <input type="date" />
      </div>

      {/* PARTS */}
      <div className="card">
        <p className="label">Parts Replaced</p>

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

        {/* Parts total */}
        <div className="bill-row">
          <span>Parts Total</span>
          <strong>₹{partsTotal}</strong>
        </div>

        {/* Service charge */}
        <div className="bill-input">
          <label>Service Charge (₹)</label>
          <input
            type="number"
            placeholder="300"
            value={serviceCharge}
            onChange={(e) =>
              setServiceCharge(Number(e.target.value) || 0)
            }
          />
        </div>

        {/* Discount percent */}
        <div className="bill-input">
          <label>Discount on Parts (%)</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setDiscountPercent(val === "" ? "" : Number(val));
              }
            }}
          />
        </div>

        {/* Discount amount */}
        <div className="bill-row">
          <span>Discount Amount</span>
          <strong>- ₹{discountAmount}</strong>
        </div>

        {/* Final total */}
        <div className="bill-total">
          Total Bill: ₹{finalAmount}
        </div>
      </div>

      {/* AMC */}
      <div className="card">
        <label className="amc-option">
          <input
            type="checkbox"
            checked={startAmc}
            onChange={() => setStartAmc(!startAmc)}
          /> Start AMC for this RO
        </label>
      </div>

      {/* ACTIONS */}
      <div className="save-bar">
        <button
          className="save-btn"
          disabled={!isFormValid}
          onClick={handleSave}
        >
          Save Service
        </button>
      </div>
    </div>
  );
};

export default AddService;