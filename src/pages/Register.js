import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users as initialUsers } from "../mock/users";
import '../auth.css';

const getUsersFromStorage = () => {
  const stored = localStorage.getItem("users");
  if (stored) return JSON.parse(stored);
  // Si no hay usuarios en storage, inicializa con el admin
  localStorage.setItem("users", JSON.stringify(initialUsers));
  return initialUsers;
};

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("El email no es válido");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    const users = getUsersFromStorage();
    if (users.some((u) => u.email === email)) {
      setError("Ya existe un usuario con ese email");
      return;
    }
    const newUser = {
      id: Date.now(),
      nombre,
      apellido,
      email,
      password,
      rol: "user"
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setError("");
    alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
    navigate("/login");
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>REGISTRO</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              autoComplete="family-name"
            />
          </div>
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">REGISTRARSE</button>
        </form>
      </div>
    </div>
  );
}
