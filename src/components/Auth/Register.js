import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const validate = () => {
        if (!nombre.trim() || !apellido.trim()) return 'Nombre y apellido son obligatorios.';
        const re = /^\S+@\S+\.\S+$/;
        if (!re.test(email)) return 'Email inválido.';
        if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
        if (password !== confirm) return 'Las contraseñas no coinciden.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const v = validate();
        if (v) { setError(v); return; }
        try {
            const resp = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, email, password })
            });
            if (resp.status === 201) {
                setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
                // Force a full navigation to the admin login page to avoid a blank render state
                setTimeout(() => { window.location.href = '/administracion/login'; }, 700);
                return;
            }
            const txt = await resp.text();
            throw new Error(txt || `HTTP ${resp.status}`);
        } catch (err) {
            console.error('Registro fallido', err);
            setError(typeof err === 'string' ? err : (err.message || 'Error en el registro'));
        }
    };

    return (
        <div className="register-container">
            <h1>Crear cuenta</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Nombre</label>
                        <input value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <input value={apellido} onChange={e => setApellido(e.target.value)} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-back" onClick={() => navigate('/')}>Volver</button>
                    <button type="submit" className="btn-submit">Registrar</button>
                </div>
                {error && <div className="field-error">{error}</div>}
                {success && <div className="field-success">{success}</div>}
            </form>
        </div>
    );
};

export default Register;
