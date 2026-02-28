////import axios from "axios";
////
////const API = axios.create({
////  baseURL: "http://localhost:8080/api/auth",
////});
////
////// Attach JWT token automatically
////API.interceptors.request.use((req) => {
////  const token = localStorage.getItem("token");
////
////  if (token) {
////    req.headers.Authorization = `Bearer ${token}`;
////  }
////
////  return req;
////});
////
////export default API;
//
//import axios from "axios";
//
//const API = axios.create({
//  baseURL: "http://localhost:8080/api/auth",
//});
//
//// Attach JWT token only for protected routes
//API.interceptors.request.use((req) => {
//  const token = localStorage.getItem("token");
//
//  if (
//    token &&
//    !req.url.includes("/register") &&
//    !req.url.includes("/login")
//  ) {
//    req.headers.Authorization = `Bearer ${token}`;
//  }
//
//  return req;
//});
//
//export default API;
//
//import axios from "axios";
//
//const API = axios.create({
//  baseURL: "http://localhost:8080/api/auth",
//});
//
//API.interceptors.request.use((req) => {
//  const token = localStorage.getItem("token");
//
//  if (
//    token &&
//    !req.url.includes("/register") &&
//    !req.url.includes("/login")
//  ) {
//    req.headers.Authorization = `Bearer ${token}`;
//  }
//
//  return req;
//});
//
//export default API;

import axios from "axios";

const API = axios.create({
//  baseURL: "http://localhost:8080/api/auth",
  baseURL: "http://localhost:8080/api/auth",
});

// Endpoints that don't need a Bearer token
const PUBLIC_ROUTES = ["/register", "/login", "/send-otp", "/verify-otp"];

API.interceptors.request.use((req) => {
  const isPublic = PUBLIC_ROUTES.some((route) => req.url.includes(route));

  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

// Optional: handle 401 globally — redirect to login if token expires
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;