import axios from "axios";
import { unauthorizedHandler } from "./components/contexts/helpers";

const axiosClient = axios.create({
    baseURL: process.env.API_BASE_URL
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = token
    return config;
})

axiosClient.interceptors.response.use(
    (response) =>  response,
    (error) => {
        if(error.response.status === 401){
            unauthorizedHandler(error);
        }
        return Promise.reject(error);
        
        
    }
)

export default axiosClient;