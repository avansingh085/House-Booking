'use client';
import axios from 'axios';
const baseURL ='https://house-booking-4pjy.vercel.app/api';

if (!baseURL || !/^https?:\/\/.+/i.test(baseURL)) {
  console.warn(
    `Invalid or missing NEXT_PUBLIC_API_URL. Using fallback: ${baseURL}. Ensure environment variable is set in production.`
  );
}
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    
   
      try {
        const token = localStorage.getItem('HousingToken');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `${token}`;
        }
        
      } catch (error) {
        console.error('Error accessing token from localStorage:', error);
      }
   
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);



export const loginUser = async ({ email, password }) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('HousingToken', res.data.token);
    }
    return res.data;
  };
  
  export const signupUser = async ({ name, email, password }) => {
    try{
      console.log(name,email,password);
    const res = await apiClient.post('/auth/register', { name, email, password });
    // if (res.data?.token) {
    //   localStorage.setItem('HousingToken', res.data.token);
    // }
    return res.data;
    }
    catch (error) {
      console.log('Error during signup:', error);
      throw error;
    }
  
  };
export default apiClient;