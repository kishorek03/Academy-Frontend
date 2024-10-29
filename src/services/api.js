import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Replace with your backend URL

export const registerUser = (userData) => {
    return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = (loginData) => {
    return axios.post(`${API_BASE_URL}/login`, loginData);
};
