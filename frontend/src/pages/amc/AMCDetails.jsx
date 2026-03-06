import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";

const AmcDetails = () => {
  const { id } = useParams();

  const [amc, setAmc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAMC = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/amcs`
        );

        const data = await res.json();

        const selected = data.find(
          (a) => a._id === id
        );

        setAmc(selected);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAMC();
  }, [id]);

  if (loading) return <Loader />;

  if (!amc) return <p>AMC not found</p>;

  return (
    <div className="profile-container">
      <h2>AMC Details</h2>

      <div className="card">
        <p className="title">
          {amc.customerId?.name}
        </p>

        <p>{amc.roId?.model}</p>

        <p>
          Start Date:{" "}
          {new Date(
            amc.startDate
          ).toLocaleDateString()}
        </p>
      </div>

      <div className="card">
        <h3>Service Checkpoints</h3>

        <p>
          4 Month:{" "}
          {new Date(
            amc.fourMonth?.date
          ).toLocaleDateString()}
        </p>

        <p>
          8 Month:{" "}
          {new Date(
            amc.eightMonth?.date
          ).toLocaleDateString()}
        </p>

        <p>
          12 Month:{" "}
          {new Date(
            amc.twelveMonth?.date
          ).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default AmcDetails;