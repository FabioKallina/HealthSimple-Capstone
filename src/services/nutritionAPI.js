
import axios from "axios";

const nutritionAPI = axios.create({
    baseURL: "http://localhost:3000/api/nutrition",
});

export default nutritionAPI;