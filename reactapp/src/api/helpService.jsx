import axios from "axios";

const API = "http://localhost:8080/api/help";

export const getAllRequests = () => {
  return axios.get(`${API}/all`);
};

export const getMyRequests = (email) => {
  return axios.get(`${API}/my/${email}`);
};