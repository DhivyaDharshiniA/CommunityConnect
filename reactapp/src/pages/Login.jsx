// import React, { useState } from "react";
// import API from "../api";
// import { useNavigate, Link } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import Swal from "sweetalert2";
//
// const MailIcon = () => (
//   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="4" width="20" height="16" rx="3"/>
//     <path d="M2 7l10 7 10-7"/>
//   </svg>
// );
//
// const LockIcon = () => (
//   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="5" y="11" width="14" height="11" rx="3"/>
//     <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
//   </svg>
// );
//
// function Login() {
//
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//
//   const navigate = useNavigate();
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   // Normal Login
//   const handleSubmit = async (e) => {
//
//     e.preventDefault();
//     setIsLoading(true);
//
//     try {
//
//       const response = await API.post("/login", formData);
//
//       localStorage.setItem("token", response.data.token);
//
//     // Save full user info including ID
//     const user = {
//       id: response.data.id,          // <-- backend should return user ID
//       email: response.data.email,
//       role: response.data.role,
//       name: response.data.name || ""
//     };
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("email", response.data.email);
//
//     // Save role separately (optional)
//     localStorage.setItem("role", user.role === "ROLE_NGO" ? "NGO" : "USER");
//
//       if (user.role === "ROLE_NGO") {
//         navigate("/ngo-dashboard");
//       } else {
//         navigate("/user-dashboard");
//       }
//
//     } catch (error) {
//       alert("Invalid credentials");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   // Google Login
//   const handleGoogleSuccess = async (credentialResponse) => {
//
//     try {
//
//       const res = await API.post("/google", {
//         token: credentialResponse.credential
//       });
//
//       localStorage.setItem("token", res.data.token);
//
//       const user = {
//         id: res.data.id,
//         email: res.data.email,
//         role: res.data.role
//       };
//
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("role", user.role === "ROLE_NGO" ? "NGO" : "USER");
//
//       if (user.role === "ROLE_NGO") {
//         navigate("/ngo-dashboard");
//       } else {
//         navigate("/user-dashboard");
//       }
//
//     } catch (err) {
//
//           if (err.response?.status === 404) {
//
//             Swal.fire({
//               icon: "warning",
//               title: "Account not found",
//               text: "Please register before signing in with Google.",
//               confirmButtonColor: "#f97316",
//               confirmButtonText: "Go to Register"
//             }).then((result) => {
//               if (result.isConfirmed) {
//                 navigate("/register");
//               }
//             });
//
//           } else {
//
//             Swal.fire({
//               icon: "error",
//               title: "Google Login Failed",
//               text: "Something went wrong. Please try again.",
//               confirmButtonColor: "#ef4444"
//             });
//
//           }
//
//
//
//     }
//   };
//
//   return (
//     <div className="min-h-screen flex bg-stone-50 font-sans">
//
//       {/* LEFT PANEL */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-stone-900">
//
//         <img
//           src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80"
//           alt="Community"
//           className="absolute inset-0 w-full h-full object-cover opacity-50"
//         />
//
//         <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
//
//         <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
//           <h1 className="text-5xl font-serif font-semibold text-white leading-[1.15] mb-3">
//             Where <span className="italic text-amber-400">people</span>
//             <br />come together
//           </h1>
//
//           <p className="text-stone-300 text-[15px] leading-relaxed max-w-[28ch]">
//             Join thousands building meaningful connections every single day.
//           </p>
//         </div>
//       </div>
//
//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex flex-col justify-center items-center px-6 py-14 relative">
//
//         <div className="w-full max-w-[420px]">
//
//           <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500 mb-1">
//             Welcome back
//           </p>
//
//           <h2 className="text-[2.6rem] font-serif font-semibold text-stone-800 leading-none mb-2">
//             Sign in 👋
//           </h2>
//
//           <p className="text-stone-400 text-sm mb-8">
//             Good to see you again — let's pick up where you left off.
//           </p>
//
//           {/* LOGIN FORM */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//
//             <div>
//               <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">
//                 Email Address
//               </label>
//
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600">
//                   <MailIcon />
//                 </span>
//
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50"
//                 />
//               </div>
//             </div>
//
//             <div>
//               <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">
//                 Password
//               </label>
//
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600">
//                   <LockIcon />
//                 </span>
//
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50"
//                 />
//               </div>
//             </div>
//
//             <div className="flex justify-end">
//               <Link
//                 to="/forgot-password"
//                 className="text-xs text-stone-400 hover:text-orange-500"
//               >
//                 Forgot password?
//               </Link>
//             </div>
//
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-orange-500 to-red-500"
//             >
//               {isLoading ? "Signing in..." : "Login"}
//             </button>
//
//           </form>
//
//           {/* DIVIDER */}
//           <div className="flex items-center gap-3 my-6">
//             <div className="flex-1 h-px bg-stone-200" />
//             <span className="text-xs text-stone-400">or continue with</span>
//             <div className="flex-1 h-px bg-stone-200" />
//           </div>
//
//           {/* GOOGLE LOGIN */}
//           <div className="flex justify-center">
//
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => console.log("Google Login Failed")}
//             />
//
//           </div>
//
//           {/* REGISTER */}
//           <p className="text-center text-sm text-stone-400 mt-8">
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="text-orange-500 font-semibold"
//             >
//               Create one free
//             </Link>
//           </p>
//
//         </div>
//
//       </div>
//     </div>
//   );
// }
//
// export default Login;

import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="11" rx="3"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
);

function Login() {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await API.post("/login", formData);

      const rawRole = response.data.role; // ROLE_USER / ROLE_NGO

      // ✅ Normalize role (IMPORTANT FIX)
      const normalizedRole =
        rawRole === "ROLE_NGO" ? "ngo" : "user";

      const user = {
        id: response.data.id,
        email: response.data.email,
        role: normalizedRole, // ✅ store clean role
        name: response.data.name || ""
      };

      // ✅ Save in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect correctly
      navigate(`/${normalizedRole}-dashboard`);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid credentials"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/google", {
        token: credentialResponse.credential
      });

      const rawRole = res.data.role;

      const normalizedRole =
        rawRole === "ROLE_NGO" ? "ngo" : "user";

      const user = {
        id: res.data.id,
        email: res.data.email,
        role: normalizedRole
      };

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(`/${normalizedRole}-dashboard`);

    } catch (err) {

      if (err.response?.status === 404) {
        Swal.fire({
          icon: "warning",
          title: "Account not found",
          text: "Please register before signing in with Google.",
          confirmButtonColor: "#f97316",
          confirmButtonText: "Go to Register"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/register");
          }
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Google Login Failed",
          text: "Something went wrong. Please try again."
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-stone-900">

        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
          <h1 className="text-5xl font-serif font-semibold text-white leading-[1.15] mb-3">
            Where <span className="italic text-amber-400">people</span>
            <br />come together
          </h1>

          <p className="text-stone-300 text-[15px] leading-relaxed max-w-[28ch]">
            Join thousands building meaningful connections every single day.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-14">

        <div className="w-full max-w-[420px]">

          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500 mb-1">
            Welcome back
          </p>

          <h2 className="text-[2.6rem] font-serif font-semibold text-stone-800 mb-2">
            Sign in 👋
          </h2>

          <p className="text-stone-400 text-sm mb-8">
            Good to see you again — let's pick up where you left off.
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs font-bold uppercase text-stone-600">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-amber-600">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-amber-600">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-orange-500 text-white"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>

          </form>

          <div className="my-6 text-center text-sm text-gray-400">
            or continue with
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed")}
          />

          <p className="text-center mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;