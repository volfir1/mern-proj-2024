import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust this to your API base URL
});

export default instance;
