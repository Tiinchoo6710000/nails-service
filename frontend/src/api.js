const BASE = 'https://nails-service-2.onrender.com';

export async function fetchAvailability(start, days=14){
  const url = new URL(`${BASE}/availability`);
  if(start) url.searchParams.set('start', start);
  url.searchParams.set('days', days);
  const res = await fetch(url);
  if(!res.ok) throw new Error('Error cargando disponibilidad');
  return res.json();
}

export async function createBooking(payload){
  const res = await fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data.error || 'Error creando reserva');
  return data;
}

export async function fetchWorks(){
  const res = await fetch(`${BASE}/works`);
  if(!res.ok) throw new Error('Error cargando trabajos');
  return res.json();
}

export async function fetchBookings(){
  const res = await fetch(`${BASE}/bookings`);
  if(!res.ok) throw new Error('Error cargando reservas');
  return res.json();
}

export async function adminListBookings(auth){
  const res = await fetch(`${BASE}/admin/bookings`, {
    headers: { 'Authorization': auth }
  });
  if(!res.ok) throw new Error('No autorizado o error');
  return res.json();
}

export async function adminDeleteBooking(id, auth){
  const res = await fetch(`${BASE}/admin/bookings/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': auth }
  });
  if(!res.ok) throw new Error('No autorizado o error');
  return res.json();
}
