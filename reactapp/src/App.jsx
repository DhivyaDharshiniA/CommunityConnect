import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import NgoDashboard from "./pages/ngo/NgoDashboard";
import AttendancePage from "./pages/user/AttendancePage"; // IMPORTANT
import ProtectedRoute from "./ProtectedRoute"; // your existing ProtectedRoute
import VolunteerRegister from "./pages/user/VolunteerRegister";
import EventDetails from "./pages/user/EventDetails";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Protected routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />



        <Route
          path="/ngo-dashboard"
          element={
            <ProtectedRoute>
              <NgoDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/attendance/:eventId" element={<AttendancePage />} />
         <Route path="/register/:eventId" element={<VolunteerRegister />} />
          <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;