import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import "./AmcDetails.css";

const AmcDetails = () => {
  const { id } = useParams();

  const [amc, setAmc] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAMC = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/amcs`
      );

      const data = await res.json();

      const selected = data.find((a) => a._id === id);

      setAmc(selected);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAMC();
  }, [id]);

  const completeService = async (checkpoint) => {
    const billAmount = prompt("Enter bill amount");

    const parts = prompt("Parts replaced (comma separated)");

    const partsUsed = parts
      ? parts.split(",").map((p) => ({
          name: p.trim(),
          price: 0,
        }))
      : [];

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/amcs/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amcId: amc._id,
          checkpoint,
          partsUsed,
          billAmount,
        }),
      }
    );

    fetchAMC();
  };

  const renewAMC = async () => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/amcs/renew`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amcId: amc._id,
        }),
      }
    );

    fetchAMC();
  };

  if (loading) return <Loader />;

  if (!amc) return <p>AMC not found</p>;

  const today = new Date();

  const checkpoints = [
    { key: "fourMonth", label: "4 Month Service" },
    { key: "eightMonth", label: "8 Month Service" },
    { key: "twelveMonth", label: "12 Month Service" },
  ];

  return (
    <div className="profile-container">

      <h2>AMC Details</h2>

      {/* Customer Info */}
      <div className="card">
        <p className="title">{amc.customerId?.name}</p>

        <p>{amc.roId?.model}</p>

        <p>
          Start Date:{" "}
          {new Date(amc.startDate).toLocaleDateString()}
        </p>
      </div>

      {/* Checkpoints */}
      <div className="card">
        <h3>Service Checkpoints</h3>

        {checkpoints.map((cp) => {
          const data = amc[cp.key];

          const dueDate = new Date(data?.date);

          const completed = data?.completed;

          const dueSoon =
            today > new Date(dueDate - 10 * 86400000);

          return (
            <div className="checkpoint" key={cp.key}>

              <div>
                <strong>{cp.label}</strong>

                <p className="muted">
                  Due: {dueDate.toLocaleDateString()}
                </p>

                {completed && (
                  <p className="completed">
                    ✔ Completed on{" "}
                    {new Date(
                      data.completedOn
                    ).toLocaleDateString()}
                  </p>
                )}

                {data?.partsUsed?.length > 0 && (
                  <p className="muted">
                    Parts:{" "}
                    {data.partsUsed
                      .map((p) => p.name)
                      .join(", ")}
                  </p>
                )}

                {data?.billAmount > 0 && (
                  <p className="muted">
                    Bill: ₹{data.billAmount}
                  </p>
                )}
              </div>

              {!completed && dueSoon && (
                <button
                  className="complete-btn"
                  onClick={() =>
                    completeService(cp.key)
                  }
                >
                  Complete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Renew AMC */}
      {today > new Date(amc.twelveMonth?.date) && (
        <div className="card">
          <button
            className="renew-btn"
            onClick={renewAMC}
          >
            Renew AMC
          </button>
        </div>
      )}
    </div>
  );
};

export default AmcDetails;