const GATEWAY_URL = 'http://localhost:3000';

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('cabx_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${GATEWAY_URL}${path}`, options);
  
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with status code ${response.status}`);
  }
  
  return data;
}

const get  = (path)       => request('GET',    path);
const post = (path, body) => request('POST',   path, body);
const put  = (path, body) => request('PUT',    path, body);
const del  = (path)       => request('DELETE', path);

const API = {

  registerCustomer: (data) => post('/api/customers/register', data),
  loginCustomer:    (data) => post('/api/customers/login',    data),
  getCustomer:      (id)   => get(`/api/customers/${id}`),

  getInbox:        (id)       => get(`/api/customers/${id}/notifications`),
  addNotification: (id, data) => post(`/api/customers/${id}/notifications`, data),

  createBooking:      (data) => post('/api/bookings', data),
  getCurrentBookings: (id)   => get(`/api/bookings/customer/${id}/current`),
  getPastBookings:    (id)   => get(`/api/bookings/customer/${id}/past`),

  processPayment: (data) => post('/api/payments/pay', data),
  getPayment:     (id)   => get(`/api/payments/${id}`),

  getLocations:   (id)       => get(`/api/locations/customer/${id}`),
  addLocation:    (data)     => post('/api/locations', data),
  updateLocation: (id, data) => put(`/api/locations/${id}`, data),
  deleteLocation: (id)       => del(`/api/locations/${id}`),
  getWeather:     (id)       => get(`/api/locations/${id}/weather`),
};