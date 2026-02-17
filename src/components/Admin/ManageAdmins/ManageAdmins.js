import React, { useState, useEffect } from 'react';
import './ManageAdmins.css';

function ManageAdmins() {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const search = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try {
      const q = email ? `?email=${encodeURIComponent(email)}` : '';
      const token = localStorage.getItem('authToken');
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const res = await fetch(`/api/admins/search${q}`, { headers });
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
      const headers = {};
      if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const res = await fetch('/api/admins/list-admins', { headers });
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data && data.value) ? data.value : (data ? [data] : []);
      // hide super-admin accounts from the management UI
      setUsers(arr.filter(u => !(u.roles && u.roles.includes('ROLE_SUPER_ADMIN'))));
    } catch (err) {
      setMessage('Error al listar administradores');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    // Automatically perform an unfiltered search on mount (same as clicking "Buscar" with empty email)
    search();
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
