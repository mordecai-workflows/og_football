import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// authentication system
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// general pages
import App from "./App.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import ForgotPage from "./pages/forgot.jsx";
import ResetPage from "./pages/reset.jsx";

//player pages
import UserHome from "./pages/user.jsx";
import ProfilePage from "./pages/profileEdit.jsx";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot", element: <ForgotPage /> },
  { path: "/reset", element: <ResetPage /> },
  { path: "/profile", element: <ProfilePage /> },

  {
    element: <ProtectedRoute allowedRoles={["player"]} />,
    children: [
      { path: "/user/home", element: <UserHome /> },
      { path: "/user/profile", element: <ProfilePage /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["scout"]} />,
    children: [{ path: "/scout/home", element: <div>Scout HomePage</div> }],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </AuthProvider>
  </StrictMode>
);
