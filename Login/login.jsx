import "./login.css";

export default function Login({ onLogin }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();   // switches to dashboard
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>RO Service Manager</h2>
        <p className="sub">Login to continue</p>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}