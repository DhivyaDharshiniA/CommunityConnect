// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import UserDashboard from "./pages/user/UserDashboard";
// import NgoDashboard from "./pages/ngo/NgoDashboard";
//
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/user-dashboard" element={<UserDashboard />} />
//         <Route path="/ngo-dashboard" element={<NgoDashboard />} />
//       </Routes>
//     </Router>
//   );
// }
//
// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import NgoDashboard from "./pages/ngo/NgoDashboard";
import AttendancePage from "./pages/user/AttendancePage"; // IMPORTANT
import ProtectedRoute from "./ProtectedRoute"; // your existing ProtectedRoute

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
      </Routes>
    </Router>
  );
}

export default App;