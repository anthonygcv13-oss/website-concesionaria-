import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (firstName, lastName) => {
  const response = await api.put('/profile_update', {
    first_name: firstName,
    last_name: lastName
  });
  return response.data;
};
