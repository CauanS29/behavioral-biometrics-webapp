import axios from "axios"; 
import { environment } from "../config/environment";
import { setupApiInterceptors } from "./api-interceptor";

const api = axios.create({
    baseURL: environment.apiUrl,
});

// Configurar os interceptors
setupApiInterceptors(api);

export default api;