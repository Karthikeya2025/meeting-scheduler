import axios from 'axios';

// All backend calls go through this base URL.
// Change this if you deploy your backend somewhere else.
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
