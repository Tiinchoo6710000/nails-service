
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles.css";
import { fetchAvailability, createBooking } from "../api";

// Lista de servicios y precios para el acordeón
const SERVICIOS = [
  {
    titulo: "Semipermanente",
    precio: "$13000",
    descripcion: "Esmaltado semipermanente de larga duración."
  },
  {
    titulo: "Soft gel",
    precio: "$23000",
    descripcion: "Extensiones con soft gel, acabado natural y resistente."
  },
  {
    titulo: "Kapping",
    precio: "$20000",
    descripcion: "Refuerzo de uña natural con soft gel para mayor durabilidad."
  },
  {
    titulo: "Presson personalizadas",
    precio:"$16000",
    descripcion: "set de uñas reutiliables para aplicacion personalizada."
  },
  {
    titulo: "Nail art",
    precio: "",
    descripcion: (
      <ul style={{margin:0, paddingLeft:18}}>
        <li>Diseño 3D: <b>$1700 (2 uñas)</b></li>
        <li>Diseño relieve: <b>$300 cada uña</b></li>
        <li>Piedrería: <b>$700 cada uña</b></li>
        <li>Esmalte ojo de gato: <b>$2000 (5 uñas), $800 (3 uñas)</b></li>
        <li>Diseño con efectos: <b>$1000 cada uña</b></li>
      </ul>
    )
  },
  {
    titulo: "Retiro de profesional",
    precio: "$7000",
    descripcion: "Retiro seguro y sin dañar la uña natural."
  }
];


export default function CalendarBooking() {
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [selectedHora, setSelectedHora] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", servicio: "" });
  const [mensaje, setMensaje] = useState("");
  const [wspLink, setWspLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [openIdx, setOpenIdx] = useState(null); // Para el acordeón

  // Cargar horarios disponibles del backend
  useEffect(() => {
    if (selectedDay) {
      setLoading(true);
      fetchAvailability(selectedDay, 1).then((dias) => {
        if (dias && dias[0]) {
          setHorarios(dias[0].slots);
        }
        setLoading(false);
      });
    }
  }, [selectedDay]);

  const handleDateChange = (d) => {
    setDate(d);
    setSelectedDay(d.toISOString().split("T")[0]);
    setSelectedHora(null);
    setShowForm(false);
    setMensaje("");
  };

  const handleHoraClick = (hora, disponible) => {
    if (!disponible) return;
    setSelectedHora(hora);
    setShowForm(true);
    setMensaje("");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);
    const payload = {
      ...form,
      fecha: selectedDay,
      hora: selectedHora,
      deposit_paid: true,
    };
    const res = await createBooking(payload);
    setLoading(false);
    if (res && res.success) {
      setMensaje("¡Turno reservado con éxito! Recordá abonar la seña de $2000.");
      setShowForm(false);
      setSelectedHora(null);
      setForm({ nombre: "", telefono: "", email: "", servicio: "" });
      // Redirigir automáticamente a WhatsApp
      const adminPhone = "543512196503"; // Cambia por el número real del dueño
      const msg = `Hola! Se confirmó un turno:\n\nNombre: ${form.nombre}\nTeléfono: ${form.telefono}\nServicio: ${form.servicio || "-"}\nFecha: ${selectedDay}\nHora: ${selectedHora}`;
      window.location.href = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    } else {
      setMensaje(res?.error || "Error al reservar turno.");
    }
  };

  // Layout de dos columnas: calendario a la izquierda, lista a la derecha
  return (
    <div className="calendar-precios-container">
      {/* <span>Reservá tu turno online</span> */}
        {/* Calendario y turnos */}
        <div className="calendar-col">
          <div style={{ maxWidth: 350, margin: "0 auto" }}>
            <Calendar
              onChange={handleDateChange}
              value={date}
              minDate={new Date()}
              maxDetail="month"
              tileClassName={({ date: d }) =>
              selectedDay === d.toISOString().split("T")[0] ? "react-calendar__tile--active" : ""
              }
            />
          </div>

          {selectedDay && (
            <div className="day-card" style={{ marginTop: 24 }}>
              <div className="day-header">
                <b>Turnos disponibles para {selectedDay}</b>
              </div>
              {loading && <div>Cargando horarios...</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: 10 }}>
                {horarios.map((slot) => (
                  <button
                    key={slot.time}
                    className={`slot-btn ${slot.available ? "available" : "taken"}${selectedHora === slot.time ? " selected" : ""}`}
                    onClick={() => handleHoraClick(slot.time, slot.available)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showForm && (
            <div className="modal-backdrop">
              <div className="modal">
                <h3>Confirmar turno {selectedDay} {selectedHora}</h3>
                <form onSubmit={handleReserva}>
                  <input
                    name="nombre"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="telefono"
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="email"
                    placeholder="Email (opcional)"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                  <input
                    name="servicio"
                    placeholder="Servicio (opcional)"
                    value={form.servicio}
                    onChange={handleInputChange}
                  />
                  <button type="submit" disabled={loading}>
                    Reservar turno
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>
                    Cancelar
                  </button>
                </form>
                <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
                </div>
              </div>
            </div>
          )}

          {mensaje && <div className="mensaje">{mensaje}</div>}
        </div>

        {/* Lista de precios y servicios */}
      <section className="precios-section">
        <h3 className="precios-title">Servicios y precios</h3>
        <div className="precios-col">
          <div className="acordeon-lista">
            {SERVICIOS.map((serv, idx) => (
              <div key={serv.titulo} className="acordeon-item">
                <button
                  className="acordeon-titulo"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {serv.titulo}
                  <span className="acordeon-arrow">{openIdx === idx ? "▲" : "▼"}</span>
                </button>
                {openIdx === idx && (
                  <div className="acordeon-contenido">
                    <div className="acordeon-desc">{serv.descripcion}</div>
                    {serv.precio && <div className="acordeon-precio"><b>Precio:</b> {serv.precio}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </section>
      </div>
  );
}