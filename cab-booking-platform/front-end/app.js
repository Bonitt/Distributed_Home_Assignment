/**
 * CabX — API Client
 * All requests route through the API Gateway.
 * Change GATEWAY_URL to your deployed URL for production.
 */
const GATEWAY_URL = 'http://localhost:3000'; // ← update for production

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token   = localStorage.getItem('cabx_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res  = await fetch(`${GATEWAY_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data;
}

const get  = (path)       => request('GET',    path);
const post = (path, body) => request('POST',   path, body);
const put  = (path, body) => request('PUT',    path, body);
const del  = (path)       => request('DELETE', path);

// ── Public API ────────────────────────────────────────────────────────────────
const API = {

  // ── Customer service  (port 3001) ─────────────────────────────────────────
  // Fields expected by backend: firstname, surname, email, password
  registerCustomer: (data) => post('/api/customers/register', data),
  loginCustomer:    (data) => post('/api/customers/login',    data),
  // GET /api/customers/:id  returns full customer (minus password)
  getCustomer: (id) => get(`/api/customers/${id}`),

  // Notifications are embedded in the Customer document
  // GET  /api/customers/:id/notifications
  // POST /api/customers/:id/notifications  { message, type }
  getInbox:        (id)       => get(`/api/customers/${id}/notifications`),
  addNotification: (id, data) => post(`/api/customers/${id}/notifications`, data),

  // ── Booking service  (port 3002) ──────────────────────────────────────────
  // POST /api/bookings  { customerId, startLocation, endLocation, dateTime, passengers, cabType }
  // GET  /api/bookings/customer/:id/current
  // GET  /api/bookings/customer/:id/past
  createBooking:      (data) => post('/api/bookings', data),
  getCurrentBookings: (id)   => get(`/api/bookings/customer/${id}/current`),
  getPastBookings:    (id)   => get(`/api/bookings/customer/${id}/past`),

  // ── Payment service  (port 3003) ──────────────────────────────────────────
  // POST /api/payments/pay  { bookingId, customerId, cabType, passengers, dateTime, discount }
  // GET  /api/payments/:id
  processPayment: (data) => post('/api/payments/pay', data),
  getPayment:     (id)   => get(`/api/payments/${id}`),

  // ── Location service  (port 3004) ─────────────────────────────────────────
  // POST   /api/locations                  { customerId, name, address }
  // GET    /api/locations/customer/:id
  // PUT    /api/locations/:locationId      { name, address }
  // DELETE /api/locations/:locationId
  // GET    /api/locations/:locationId/weather
  getLocations:   (id)       => get(`/api/locations/customer/${id}`),
  addLocation:    (data)     => post('/api/locations', data),
  updateLocation: (id, data) => put(`/api/locations/${id}`, data),
  deleteLocation: (id)       => del(`/api/locations/${id}`),
  getWeather:     (id)       => get(`/api/locations/${id}/weather`),
};