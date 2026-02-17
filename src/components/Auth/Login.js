import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                // store name and initials for display
                const fullName = `${json.nombre || ''}${json.apellido ? ' ' + json.apellido : ''}`.trim();
                if (fullName) {
                    localStorage.setItem('authName', fullName);
                    const initials = fullName.split(/\s+/).map(n => n[0]).slice(0,2).join('').toUpperCase();
                    localStorage.setItem('authInitials', initials);
                }
                // notify other components that auth changed
                try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
                // decide where to redirect: admins -> admin panel, others -> public main
                try {
                    const t = json.token.startsWith('Bearer ') ? json.token.split(' ')[1] : json.token;
                    const payload = t.split('.')[1];
                    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
                    const parsed = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
                    const roles = parsed && (parsed.roles || parsed.authorities || parsed.role || parsed.roles);
                    const isAdmin = Array.isArray(roles) ? roles.includes('ROLE_ADMIN') : (typeof roles === 'string' && roles.toLowerCase().includes('admin'));
                    if (isAdmin) navigate('/administracion'); else navigate('/');
                } catch (e) {
                    // fallback
                    navigate('/');
                }
            } else {
                const txt = await resp.text();
                throw new Error(txt || 'Invalid response from auth');
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
                    <button type="button" className="btn-back" onClick={() => navigate('/')}>Volver</button>
                    <button type="submit" className="btn-submit">Ingresar</button>
                </div>
                {error && <div className="field-error">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
