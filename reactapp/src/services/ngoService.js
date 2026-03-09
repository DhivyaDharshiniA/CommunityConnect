import axios from "axios";

const API = "http://localhost:8080/api/ngos";

export const registerNGO = (data) => {
  return axios.post(`${API}/register`, data);
};

export const getPendingNGOs = () => {
  return axios.get(`${API}/pending`);
};

export const verifyNGO = (id) => {
  return axios.put(`${API}/${id}/verify`);
};

export const rejectNGO = (id) => {
  return axios.put(`${API}/${id}/reject`);
};

export const getNgoProfile = (id) => {
  return axios.get(`${API}/${id}`);
};

export const updateNgoProfile = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};

