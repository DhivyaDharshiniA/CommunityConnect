// import axios from "axios";
//
// const BASE_URL = "http://localhost:8080/api/events";
//
// export const getAllEvents = async () => {
//   const response = await axios.get(`${BASE_URL}/all`);
//   return response.data;
// };
//
// export const createEvent = async (event, userId) => {
//   const response = await axios.post(`${BASE_URL}/create/${userId}`, event);
//   return response.data;
// };
import axios from "axios";

const API = "http://localhost:8080/api/events";

export const getAllEvents = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};