import axios from "axios";

/*
  Axios instance
*/
const API = axios.create({
  baseURL: "http://localhost:8080/api/events",
});

/*
  Attach JWT token automatically
*/
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers = req.headers || {};
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/*
  Global response interceptor
  Handles expired / invalid tokens
*/
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        console.error("Authentication error. Please login again.");
      }
    }

    return Promise.reject(error);
  }
);

/*
  Get all events
*/
export const getAllEvents = async () => {
  try {
    const res = await API.get("/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching all events:", err);
    throw err;
  }
};

/*
  Get NGO events
*/
export const getMyEvents = async () => {
  try {
    const res = await API.get("/my");
    return res.data;
  } catch (err) {
    console.error("Error fetching my events:", err);
    throw err;
  }
};

/*
  Delete event
*/
export const deleteEvent = async (id) => {
  try {
    const res = await API.delete(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err;
  }
};

/*
  Create event
*/
export const createEvent = async (event) => {
  try {
    const formData = new FormData();

    formData.append("title", event.title || "");
    formData.append("description", event.description || "");
    formData.append("category", event.category || "");
    formData.append("venue", event.venue || "");
    formData.append("city", event.city || "");
    formData.append("state", event.state || "");
    formData.append("organizerName", event.organizerName || "");
    formData.append("contactEmail", event.contactEmail || "");
    formData.append("contactPhone", event.contactPhone || "");
    formData.append("startDateTime", event.startDateTime || "");
    formData.append("endDateTime", event.endDateTime || "");
    formData.append("requirements", event.requirements || "");
    formData.append("benefits", event.benefits || "");

    if (event.bannerImage) {
      formData.append("bannerImage", event.bannerImage);
    }

    const res = await API.post("/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error creating event:", err);
    throw err;
  }
};

/*
  Update event
*/
export const updateEvent = async (id, event) => {
  try {
    const formData = new FormData();

    formData.append("title", event.title || "");
    formData.append("description", event.description || "");
    formData.append("category", event.category || "");
    formData.append("venue", event.venue || "");
    formData.append("city", event.city || "");
    formData.append("state", event.state || "");
    formData.append("organizerName", event.organizerName || "");
    formData.append("contactEmail", event.contactEmail || "");
    formData.append("contactPhone", event.contactPhone || "");
    formData.append("startDateTime", event.startDateTime || "");
    formData.append("endDateTime", event.endDateTime || "");
    formData.append("requirements", event.requirements || "");
    formData.append("benefits", event.benefits || "");

    if (event.bannerImage) {
      formData.append("bannerImage", event.bannerImage);
    }

    const res = await API.put(`/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error updating event:", err);
    throw err;
  }
};
