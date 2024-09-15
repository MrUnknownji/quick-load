import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://quick-load.onrender.com/api",
  timeout: 10000,
});

export default apiClient;
