import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000', // Backend adresi
});

// Her request öncesi token varsa header'a ekle
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
