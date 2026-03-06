import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/ui.css";
import Loader from "../../components/Loader";

const BillView = () => {
  const { invoiceNumber } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const owner = {
    name: "Mineral Jal",
    ownerName: "Robin Taneja",
    phone: "+91-9205898972",
    email: "mineraljalroservices@gmail.com",
    address: "Mineral Jal Building Ghaziabad 201002",
  };

  /* ===========================
     FETCH BILL
  =========================== */

  useEffect(() => {
    if (!invoiceNumber) return;

    const fetchBill = async () => {
      try {
        setLoading(true);

        let endpoint = "";

        if (invoiceNumber.startsWith("MJ-S")) {
          endpoint = `/api/services?invoiceNumber=${invoiceNumber}`;
        } else if (invoiceNumber.startsWith("MJ-R")) {
          endpoint = `/api/ro?invoiceNumber=${invoiceNumber}`;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`
        );

        if (!res.ok) {
          setBill(null);
          return;
        }

        const data = await res.json();
        setBill(data || null);

      } catch (error) {
        console.error("Error fetching bill:", error);
        setBill(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [invoiceNumber]);

  if (!invoiceNumber) {
    return <p style={{ padding: 20 }}>Invalid invoice URL</p>;
  }

  if (loading) return <Loader />;

  if (!bill) {
    return <p style={{ padding: 20 }}>Bill not found</p>;
  }

  /* ===========================
     NORMALIZE DATA
  =========================== */

  const isService = invoiceNumber.startsWith("MJ-S");

  const parts = isService
    ? bill?.parts || []
    : bill?.components || [];

  const billDate = isService
    ? bill?.date
    : bill?.installDate;

  const extraCharge = isService
    ? Number(bill?.serviceCharge || 0)
    : Number(bill?.installationCost || 0);

  const partsTotal = parts.reduce(
    (sum, p) =>
      sum +
      Number(p.price || 0) *
      Number(p.quantity || 1),
    0
  );

  const subTotal = partsTotal + extraCharge;

  /* ===========================
     PRINT
  =========================== */

  const handleDownload = () => {
    const originalTitle = document.title;
    document.title = bill.invoiceNumber;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return (
    <div className="bill-print">

      <div className="bill-button">
        <button
          className="download-btn no-print"
          onClick={handleDownload}
        >
          Download Bill
        </button>
      </div>

      <div className="bill-inner">

        {/* HEADER */}

        <div className="invoice-top">
          <div className="logo">
            <img
              src="/Mineral_Jal.png"
              className="logobill"
              alt="Mineral Jal"
            />
          </div>

          <div className="invoice-title">
            <h2>INVOICE</h2>
          </div>
        </div>

        {/* OWNER + CUSTOMER */}

        <div className="invoice-info">

          <div>
            <p className="info-title">From:</p>
            <p><strong>{owner.name}</strong></p>
            <p>Owner: {owner.ownerName}</p>
            <p>Phone: {owner.phone}</p>
            <p>Email: {owner.email}</p>
            <p>{owner.address}</p>
          </div>

          <div className="invoice-right">

            <div className="invoice-meta">
              <p><strong>Invoice #:</strong> {bill.invoiceNumber}</p>
              <p>
                <strong>Date:</strong>{" "}
                {billDate
                  ? new Date(billDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            {!isService && (
              <p><strong>Model:</strong> {bill.model}</p>
            )}

            <div className="invoice-to">
              <p className="info-title">Invoice To:</p>
              <p><strong>{bill.customerId?.name || "Customer"}</strong></p>
              <p>{bill.customerId?.phone || "-"}</p>
              <p>{bill.customerId?.address || "-"}</p>
            </div>

          </div>
        </div>

        {/* ITEMS TABLE */}

        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Item Description</th>
              <th style={{ textAlign: "right" }}>Amount (₹)</th>
            </tr>
          </thead>

          <tbody>

            {parts.map((part, index) => (
              <tr key={part.id || index}>

                <td>{index + 1}</td>

                <td>
                  {part.name}
                  {part.quantity > 1 && (
                    <span> × {part.quantity}</span>
                  )}
                </td>

                <td style={{ textAlign: "right" }}>
                  ₹{Number(part.price) *
                    Number(part.quantity || 1)}
                </td>

              </tr>
            ))}

            <tr>
              <td>{parts.length + 1}</td>
              <td>
                {isService
                  ? "Service Charges"
                  : "Installation Charges"}
              </td>
              <td style={{ textAlign: "right" }}>
                ₹{extraCharge}
              </td>
            </tr>

            <tr>
              <td>{parts.length + 2}</td>
              <td>Discount</td>
              <td style={{ textAlign: "right" }}>
                - ₹{bill.discountAmount || 0}
              </td>
            </tr>

          </tbody>
        </table>

        {/* TOTAL */}

        <div className="invoice-summary">

          <div>
            <p>Sub Total:</p>
            <p>₹{subTotal}</p>
          </div>

          <div className="grand-total">
            <span>Total</span>
            <strong>₹{bill.totalAmount}</strong>
          </div>

        </div>

        {/* FOOTER */}

        <div className="invoice-footer">

          <div>
            <p><strong>Thank you for choosing Mineral Jal</strong></p>
            <p>Terms & Conditions apply</p>
          </div>

          <div className="sign">
            <p>Authorised Sign</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default BillView;