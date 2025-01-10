// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
 baseURL: 'http://localhost:8080/api',
//baseURL: 'https://panchatantra456.netlify.app', // Backend URL // Replace with your API base URL
  timeout: 10000, // Timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you may need here
  },
});

export default axiosInstance;
