import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AMCTracker.css";
import Loader from "../../components/Loader";

const AMCTracker = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("ACTIVE");
  const [amcs, setAmcs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAMCs = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ro`
        );

        const ros = await res.json();

        const amcList = ros
          .filter((ro) => ro.startAmc)
          .map((ro) => {
            const start = new Date(ro.installDate);

            const fourMonth = new Date(start);
            fourMonth.setMonth(start.getMonth() + 4);

            const eightMonth = new Date(start);
            eightMonth.setMonth(start.getMonth() + 8);

            const twelveMonth = new Date(start);
            twelveMonth.setMonth(start.getMonth() + 12);

            const now = new Date();

            let status = "ACTIVE";

            if (now > twelveMonth) status = "EXPIRED";
            else if (now > eightMonth) status = "DUE";
            else if (now > fourMonth) status = "DUE";

            return {
              id: ro._id,
              customer: ro.customerId?.name || "Customer",
              roModel: ro.model,
              startDate: ro.installDate,
              fourMonth,
              eightMonth,
              twelveMonth,
              status,
            };
          });

        setAmcs(amcList);
      } catch (error) {
        console.error("AMC fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAMCs();
  }, []);

  if (loading) return <Loader />;

  const filtered = amcs.filter((a) => {
    if (tab === "ACTIVE") return a.status === "ACTIVE";
    if (tab === "DUE") return a.status === "DUE";
    if (tab === "EXPIRED") return a.status === "EXPIRED";
    return false;
  });

  return (
    <div className="amc-container">
      <h2>AMC Tracker</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "ACTIVE" ? "active" : ""}
          onClick={() => setTab("ACTIVE")}
        >
          Active
        </button>

        <button
          className={tab === "DUE" ? "active" : ""}
          onClick={() => setTab("DUE")}
        >
          Due Soon
        </button>

        <button
          className={tab === "EXPIRED" ? "active" : ""}
          onClick={() => setTab("EXPIRED")}
        >
          Expired
        </button>
      </div>

      {/* List */}
      <div className="list">
        {filtered.length === 0 && (
          <p className="empty">No records found</p>
        )}

        {filtered.map((amc) => {
          const showRenew =
            new Date() > new Date(amc.twelveMonth);

          return (
            <div
              key={amc.id}
              className="amc-card clickable"
              onClick={() => navigate(`/customer/${amc.id}`)}
            >
              <div>
                <strong>{amc.customer}</strong>
                <p className="muted">{amc.roModel}</p>

                <p className="muted">
                  4 Month:{" "}
                  {new Date() > amc.fourMonth
                    ? "✔ Completed"
                    : new Date(amc.fourMonth).toLocaleDateString()}
                </p>

                <p className="muted">
                  8 Month:{" "}
                  {new Date() > amc.eightMonth
                    ? "✔ Completed"
                    : new Date(amc.eightMonth).toLocaleDateString()}
                </p>

                <p className="muted">
                  12 Month:{" "}
                  {new Date() > amc.twelveMonth
                    ? "✔ Completed"
                    : new Date(amc.twelveMonth).toLocaleDateString()}
                </p>

                {amc.status === "EXPIRED" && (
                  <p className="expired-text">
                    Expired on{" "}
                    {new Date(amc.twelveMonth).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="actions">
                {amc.status !== "EXPIRED" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/add-service", {
                        state: { customerId: amc.id },
                      });
                    }}
                  >
                    🛠 Service
                  </button>
                )}

                {showRenew && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/add-ro", {
                        state: { customerId: amc.id },
                      });
                    }}
                  >
                    🔁 Renew
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AMCTracker;