import axios from "axios";

const API_URL_LOCAL = "http://localhost:8082/api/";


const api = axios.create({
    baseURL: API_URL_LOCAL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api;