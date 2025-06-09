
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/challenges";

import axios from "axios";

const API = axios.create({
    baseURL: BASE_URL,
});

export default API;