import axios from "axios";

const API = "http://localhost:8080/api/volunteers";

export const getEventVolunteers = async (eventId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API}/event/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getMyVolunteers = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/my-volunteers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};
