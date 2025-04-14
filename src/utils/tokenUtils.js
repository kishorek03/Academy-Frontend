import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded; // ensure it includes `role`
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};