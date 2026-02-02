import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || `HTTP ${resp.status}`);
            }
            const json = await resp.json();
            if (json && json.token) {
                // store raw token; App will add 'Bearer ' prefix when sending
                localStorage.setItem('authToken', json.token);
                if (json.email) localStorage.setItem('authEmail', json.email);
                // notify other components that auth changed
                try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
                navigate('/administracion');
            } else {
                throw new Error('Invalid response from auth');
            }
        } catch (err) {
            console.error('Login failed', err);
            setError('Error de autenticación. Verifique sus credenciales.');
        }
    };

    return (
        <div className="login-container">
            <h1>Ingreso Administración</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit">Ingresar</button>
                </div>
                {error && <div className="field-error">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
