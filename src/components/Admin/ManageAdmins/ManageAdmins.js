import React, { useState, useEffect } from 'react';
import './ManageAdmins.css';
import NotAuthorizedAdmin from '../../Auth/NotAuthorizedAdmin';

function ManageAdmins() {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(null);

  // Helper function to extract roles from JWT token
  const extractRolesFromToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return [];
      const t = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      const payload = t.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const parsed = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      const roles = parsed && (parsed.roles || parsed.authorities || parsed.role);
      return Array.isArray(roles) ? roles : (typeof roles === 'string' ? [roles] : []);
    } catch (e) {
      console.error('Error extracting roles from token', e);
      return [];
    }
  };

  const search = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try {
      const q = email ? `?email=${encodeURIComponent(email)}` : '';
      const token = localStorage.getItem('authToken');
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const res = await fetch(`/api/admins/search${q}`, { headers });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setMessage(`Error al buscar usuarios: ${res.status} ${res.statusText}`);
        console.error('Buscar /api/admins/search response:', res.status, res.statusText, text);
        setUsers([]);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data && data.value) ? data.value : (data ? [data] : []);
      // hide super-admin accounts from the management UI
      setUsers(arr.filter(u => !(u.roles && u.roles.includes('ROLE_SUPER_ADMIN'))));
    } catch (err) {
      setMessage('Error al buscar usuarios');
    } finally { setLoading(false); }
  };

  const listAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const res = await fetch('/api/admins/list-admins', { headers });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setMessage(`Error al listar administradores: ${res.status} ${res.statusText}`);
        console.error('List /api/admins/list-admins response:', res.status, res.statusText, text);
        setUsers([]);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data && data.value) ? data.value : (data ? [data] : []);
      // hide super-admin accounts from the management UI
      setUsers(arr.filter(u => !(u.roles && u.roles.includes('ROLE_SUPER_ADMIN'))));
    } catch (err) {
      setMessage('Error al listar administradores');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    // Check if user is SUPER_ADMIN on component mount
    const roles = extractRolesFromToken();
    const hasSuperAdminRole = roles.some(r => r === 'ROLE_SUPER_ADMIN');
    setIsSuperAdmin(hasSuperAdminRole);
    
    // Only proceed with data fetching if authorized
    if (hasSuperAdminRole) {
      search();
    } else {
      setLoading(false);
    }
  }, []);

  const toggleAdmin = async (id, makeAdmin) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const res = await fetch(`/api/admins/${id}/set-admin?value=${makeAdmin}`, { method: 'POST', headers });
      const json = await res.json();
      setMessage(json && json.isAdmin ? 'Rol ADMIN asignado' : 'Rol ADMIN removido');
      // refresh lists
      await listAdmins();
    } catch (err) {
      setMessage('Error al actualizar rol');
    } finally { setLoading(false); }
  };

  // If authorization check is still pending, show loading
  if (isSuperAdmin === null) {
    return <div>Loading...</div>;
  }

  // If not authorized, show access denied message with specific reason
  if (!isSuperAdmin) {
    return <NotAuthorizedAdmin message="Sos administrador, pero no tenés permisos para gestionar otros administradores. Solo el super administrador puede realizar esta acción." />;
  }

  return (
    <div className="manage-admins">
      <h2>Gestionar administradores</h2>
      <form onSubmit={search} className="search-form">
        <input placeholder="Buscar por email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Buscar</button>
        <button type="button" onClick={listAdmins}>Ver administradores</button>
      </form>
      {message && <div className="message">{message}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="admins-table">
          <thead><tr><th>Email</th><th>Nombre</th><th>Roles</th><th>Acción</th></tr></thead>
          <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.nombre} {u.apellido}</td>
                    <td>{(u.roles && u.roles.includes('ROLE_ADMIN')) ? 'ROLE_ADMIN' : 'ROLE_USER'}</td>
                <td>
                  {u.roles && u.roles.includes('ROLE_ADMIN') ? (
                    <button onClick={() => toggleAdmin(u.id, false)}>Quitar ADMIN</button>
                  ) : (
                    <button onClick={() => toggleAdmin(u.id, true)}>Dar ADMIN</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageAdmins;
