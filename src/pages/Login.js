import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../auth.css';

const getUsersFromStorage = () => {
  const stored = localStorage.getItem("users");
  if (stored) return JSON.parse(stored);
  return [];
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError("Email o contraseña incorrectos");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    setError("");
    navigate("/");
    window.location.reload(); // Para refrescar el header
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {/* <div className="remember-row">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div> */}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
}
