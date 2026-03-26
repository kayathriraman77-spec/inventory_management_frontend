import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2 style={{ color: "green" }}>✅ Order Placed Successfully!</h2>
      <p>Your order has been saved.</p>

      <button
        onClick={() => navigate("/user/dashboard")}
        style={{
          marginTop: "20px",
          padding: "8px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}