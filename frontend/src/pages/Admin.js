import React, { useState } from "react";
import { adminListBookings, adminDeleteBooking } from "../api";

// Panel de administración para ver y eliminar turnos
// Solo accesible si se conoce la URL /admin
// Pide usuario y contraseña (autenticación básica)

export default function Admin() {
	// Estado para login
	const [user, setUser] = useState("");
	const [pass, setPass] = useState("");
	const [auth, setAuth] = useState("");
	const [logged, setLogged] = useState(false);
	const [error, setError] = useState("");

	// Estado para turnos
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState("");

	// Función para armar el header de autenticación básica
	function makeAuthHeader(u, p) {
		return "Basic " + btoa(`${u}:${p}`);
	}

	// Login: prueba credenciales y carga turnos
	async function handleLogin(e) {
		e.preventDefault();
		setError("");
		setMsg("");
		setLoading(true);
		const authHeader = makeAuthHeader(user, pass);
		try {
			const data = await adminListBookings(authHeader);
			setBookings(data);
			setAuth(authHeader);
			setLogged(true);
		} catch (err) {
			setError("Usuario o contraseña incorrectos");
		}
		setLoading(false);
	}

	// Eliminar un turno
	async function handleDelete(id) {
		if (!window.confirm("¿Seguro que querés eliminar este turno?")) return;
		setLoading(true);
		setMsg("");
		try {
			await adminDeleteBooking(id, auth);
			setBookings(bookings.filter(b => b.id !== id));
			setMsg("Turno eliminado");
		} catch (err) {
			setMsg("Error eliminando turno");
		}
		setLoading(false);
	}

	// Si no está logueado, muestra el formulario de login
	if (!logged) {
		return (
			<div className="admin-box" style={{ maxWidth: 340, margin: "40px auto", background: "#fff", padding: 24, borderRadius: 8 }}>
				<h2>Admin - Ingresar</h2>
				<form onSubmit={handleLogin} className="admin-login">
					<input
						type="text"
						placeholder="Usuario"
						value={user}
						onChange={e => setUser(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Contraseña"
						value={pass}
						onChange={e => setPass(e.target.value)}
						required
					/>
					<button type="submit" disabled={loading}>Entrar</button>
				</form>
				{error && <div style={{ color: "#d32f2f", marginTop: 10 }}>{error}</div>}
			</div>
		);
	}

	// Si está logueado, muestra la lista de turnos
	return (
		<div className="admin-box" style={{ maxWidth: 800, margin: "40px auto", background: "#fff", padding: 24, borderRadius: 8 }}>
			<h2>Panel de Administración</h2>
			<button onClick={() => window.location.reload()} style={{ marginBottom: 16 }}>Cerrar sesión</button>
			{msg && <div className="mensaje">{msg}</div>}
			<table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
				<thead>
					<tr style={{ background: "#f8bbd0" }}>
						<th>ID</th>
						<th>Nombre</th>
						<th>Teléfono</th>
						<th>Email</th>
						<th>Servicio</th>
						<th>Fecha</th>
						<th>Hora</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{bookings.length === 0 && (
						<tr><td colSpan={8} style={{ textAlign: "center", color: "#888" }}>No hay turnos</td></tr>
					)}
					{bookings.map(b => (
						<tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
							<td>{b.id}</td>
							<td>{b.nombre}</td>
							<td>{b.telefono}</td>
							<td>{b.email}</td>
							<td>{b.servicio}</td>
							<td>{b.fecha}</td>
							<td>{b.hora}</td>
							<td>
								<button onClick={() => handleDelete(b.id)} style={{ background: "#ff4081", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Eliminar</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
