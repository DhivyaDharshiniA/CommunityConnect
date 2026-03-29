// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
//
// const ProtectedRoute = ({ children, role }) => {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));
//   const location = useLocation(); // current path
//
//   // If not logged in, redirect to login
//   if (!token || !user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }
//
//   // If logged in but role does not match, redirect to login or dashboard
//   if (role && user.role !== role) {
//     return <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />;
//   }
//
//   // Authorized, render child component
//   return children;
// };
//
// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(userData);
  } catch {
    user = null;
  }

  const userRole = user?.role; // already "user" or "ngo"

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ❌ Role mismatch
  if (role && userRole !== role.toLowerCase()) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;