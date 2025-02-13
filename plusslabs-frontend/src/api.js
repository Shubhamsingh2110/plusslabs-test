// import axios from "axios";

// const API = axios.create({
//     baseURL: "http://localhost:3000", // Backend URL
//     withCredentials: true, // Important for authentication
// });

// export default API;




import axios from "axios";
import { API_BASE_URL } from "./config";

const API = axios.create({
    baseURL: API_BASE_URL, // Backend URL
    withCredentials: true, // Important for authentication
});

export default API;
