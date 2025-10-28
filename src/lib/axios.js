import axios from 'axios';
import useLoaderStore from '../store/loaderStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    useLoaderStore.getState().showLoader();
    return config;
  },
  (error) => {
    useLoaderStore.getState().hideLoader();
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    useLoaderStore.getState().hideLoader();
    return response;
  },
  (error) => {
    useLoaderStore.getState().hideLoader();
    return Promise.reject(error);
  }
);

export default api;
