import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:8080/api/events",
});

// Attach JWT token automatically to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Get all events
export const getAllEvents = async () => {
  const res = await API.get("/all");
  return res.data;
};

// Get NGO's events
export const getMyEvents = async () => {
  const res = await API.get("/my");
  return res.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const res = await API.delete(`/delete/${id}`);
  return res.data;
};

// Create event
export const createEvent = async (event) => {
  // Use FormData for multipart/form-data
  const formData = new FormData();

  formData.append("title", event.title);
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
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};