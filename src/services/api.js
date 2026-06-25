import axios from 'axios';

// Detecta de forma inteligente si la app se ejecuta en un entorno local (desarrollo)
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Si estamos en localhost o en una IP local, apuntamos al backend local (puerto 3000)
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.'))) {
    return 'http://localhost:3000/api';
  }
  
  // En producción, usamos el servidor en Render
  return 'https://car-dealership-03qc.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor para inyectar automáticamente el token JWT si existe en localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
