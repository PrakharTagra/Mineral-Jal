import { useParams } from "react-router-dom";
import { useState } from "react";
import { RO_PARTS } from "../../data/roParts";
import "../service/AddService.css";

const AmcService = () => {

  const { amcId, checkpoint } = useParams();

  const [selectedParts, setSelectedParts] = useState([]);
  const [notes, setNotes] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);

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
    partsTotal + serviceCharge - discountAmount;

  const handleSave = async () => {

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/amcs/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amcId,
          checkpoint,
          partsUsed: selectedParts,
          notes,
          billAmount: finalAmount,
        }),
      }
    );

    window.history.back();
  };

  return (
    <div className="service-container">

      <h2 className="page-title">
        AMC Service ({checkpoint})
      </h2>

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

      {/* NOTES */}
      <div className="card">

        <p className="label">Service Notes</p>

        <textarea
          placeholder="Notes..."
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
        />

      </div>

      {/* BILLING */}
      <div className="card highlight">

        <p className="label">Billing Summary</p>

        <div className="bill-row">
          <span>Parts Total</span>
          <strong>₹{partsTotal}</strong>
        </div>

        <div className="bill-input">
          <label>Service Charge</label>

          <input
            type="number"
            value={serviceCharge}
            onChange={(e) =>
              setServiceCharge(
                Number(e.target.value) || 0
              )
            }
          />
        </div>

        <div className="bill-input">
          <label>Discount (%)</label>

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
          <span>Discount</span>
          <strong>-₹{discountAmount}</strong>
        </div>

        <div className="bill-total">
          Total Bill: ₹{finalAmount}
        </div>

      </div>

      <div className="save-bar">
        <button
          className="save-btn"
          onClick={handleSave}
        >
          Complete Service
        </button>
      </div>

    </div>
  );
};

export default AmcService;