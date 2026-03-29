// import React from "react";
// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import UserDashboard from "./pages/user/UserDashboard";
// import NgoDashboard from "./pages/ngo/NgoDashboard";
// import AttendancePage from "./pages/user/AttendancePage"; // IMPORTANT
// import ProtectedRoute from "./ProtectedRoute"; // your existing ProtectedRoute
// import VolunteerRegister from "./pages/user/VolunteerRegister";
// import EventDetails from "./pages/user/EventDetails";
//
// const loadFonts = () => {
//   if (document.getElementById("cc-fonts")) return;
//   const l = document.createElement("link");
//   l.id = "cc-fonts"; l.rel = "stylesheet";
//   l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap";
//   document.head.appendChild(l);
// };
//
// function App() {
//   useEffect(loadFonts, []);
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//
//
//         {/* Protected routes */}
//         <Route
//           path="/user-dashboard"
//           element={
//             <ProtectedRoute>
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
//
//
//         <Route path="/attendance/:eventId" element={<AttendancePage />} />
//          <Route path="/register/:eventId" element={<VolunteerRegister />} />
//           <Route path="/event/:id" element={<EventDetails />} />
//           <Route
//                     path="/ngo-dashboard"
//                     element={
//                       <ProtectedRoute>
//                         <NgoDashboard />
//                       </ProtectedRoute>
//                     }
//                   />
//       </Routes>
//     </Router>
//   );
// }
//
// export default App;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import NgoDashboard from "./pages/ngo/NgoDashboard";
import AttendancePage from "./pages/user/AttendancePage";
import VolunteerRegister from "./pages/user/VolunteerRegister";
import EventDetails from "./pages/user/EventDetails";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance/:eventId"
          element={
            <ProtectedRoute role="user">
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register/:eventId"
          element={
            <ProtectedRoute role="user">
              <VolunteerRegister />
            </ProtectedRoute>
          }
        />

        {/* COMMON */}
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />

        {/* NGO */}
        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute role="ngo">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
