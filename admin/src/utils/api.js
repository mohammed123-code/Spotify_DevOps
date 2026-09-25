import axios from "axios";

export const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: url,
});

export default api;
