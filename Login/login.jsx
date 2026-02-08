import { useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );


    const data = await res.json();

    if (res.ok) {
      onLogin();   // go to dashboard
    } else {
      alert(data.msg || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="sub">Login to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}