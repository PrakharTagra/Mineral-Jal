import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="admin-container">
      <form onSubmit={handleLogin} className="admin-form">
        <h2>Mineral Jal Admin</h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}