import axios from 'axios';
import config from './conifg';

const axiosConfig = {
    baseURL: config.API_ROOT,
    headers: {
        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
    }
};

export const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

axiosInstance.interceptors.response.use(
    (response)=>{
        return response.data;
    });

export default axiosInstance;