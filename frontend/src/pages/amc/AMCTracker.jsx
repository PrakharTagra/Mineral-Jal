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
          `${import.meta.env.VITE_API_URL}/api/amcs`
        );

        const data = await res.json();
        if (Array.isArray(data)) {
          setAmcs(data);
        } else {
          console.error("AMC API returned error:", data);
          setAmcs([]);
        }
      } catch (error) {
        console.error("AMC fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAMCs();
  }, []);

  if (loading) return <Loader />;

  const filtered = (amcs || []).filter((a) => {
    const status = a.status?.toUpperCase();

    if (tab === "ACTIVE") return status === "ACTIVE";
    if (tab === "DUE") return status === "DUE";
    if (tab === "EXPIRED") return status === "EXPIRED";

    return false;
  });

  return (
    <div className="amc-container">
      <h2>AMC Tracker</h2>

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

      <div className="list">
        {filtered.length === 0 && (
          <p className="empty">No records found</p>
        )}

        {filtered.map((amc) => (
          <div
            key={amc._id}
            className="amc-card clickable"
            onClick={() => navigate(`/amc/${amc._id}`)}
          >
            <div>
              <strong>{amc.customerId?.name}</strong>

              <p className="muted">
                {amc.roId?.model || "RO"}
              </p>

              <p className="muted">
                Start:{" "}
                {new Date(
                  amc.startDate
                ).toLocaleDateString()}
              </p>
            </div>

            <span className={`status ${amc.status}`}>
              {amc.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AMCTracker;