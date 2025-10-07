import axios from "axios";

export const productsApi = axios.create({
  baseURL: "https://fakestoreapi.com"
});

export const serverApi = axios.create({
  baseURL: "http://YOUR_BACKEND_IP:PORT"
});











