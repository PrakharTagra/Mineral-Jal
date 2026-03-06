import { useParams } from "react-router-dom";
import { useState } from "react";
import { RO_PARTS } from "../../data/roParts";
import "../service/AddService.css";

const AmcService = () => {

  const { amcId, checkpoint } = useParams();

  const [selectedParts, setSelectedParts] = useState([]);
  const [notes, setNotes] = useState("");

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
          quantity: 1,
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

  const increaseQty = (id) => {

    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  };

  const decreaseQty = (id) => {

    setSelectedParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(1, p.quantity - 1) }
          : p
      )
    );
  };

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

                  <div
                    className="part-controls"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <input
                      className="part-price-input"
                      value={selected.price}
                      onChange={(e) =>
                        updatePartPrice(
                          part.id,
                          e.target.value
                        )
                      }
                    />

                    <div className="qty-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQty(part.id)
                        }
                      >
                        −
                      </button>

                      <span>{selected.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQty(part.id)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

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

      {/* ACTION */}

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