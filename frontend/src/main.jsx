import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// authentication system
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protected/ProtectedRoute";

// general pages
import App from "./App.jsx";
import LoginPage from "./pages/auth/login/login.jsx";
import RegisterPage from "./pages/auth/register/register.jsx";
import ForgotPage from "./pages/auth/forgot/forgot.jsx";
import ResetPage from "./pages/auth/reset/reset.jsx";

//player pages
import UserHome from "./pages/user.jsx";
// import ProfilePage from "./pages/profileEdit.jsx";

// player pages
import PlayerHome from "./pages/player/home/Home.jsx";
import PlayerMedia from "./pages/player/media/Media.jsx";
import ProgressAnalytics from "./pages/player/progress/Progress.jsx";
import MessagingPage from "./pages/player/message/Messages.jsx";
import ProfilePage from "./pages/player/profile/Profile.jsx";

// team pages
import TeamDashboard from "./pages/team/dashboard/dashboard.jsx";
import TeamRoster from "./pages/team/roster/roster.jsx";
import TeamStats from "./pages/team/stats/stats.jsx";
import TeamMatches from "./pages/team/matches/matches.jsx";
import TeamProfile from "./pages/team/profile/profile.jsx";

// scout pages
import ScoutHome from "./pages/scout/home/Home.jsx";
import PlayerSearch from "./pages/scout/playerSearch/search.jsx";
import ScoutProfile from "./pages/scout/profile/profile.jsx";
import Shortlists from "./pages/scout/shortlists/shortlists.jsx";
import Player from "./pages/scout/player/Player.jsx";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot", element: <ForgotPage /> },
  { path: "/reset", element: <ResetPage /> },

  { path: "/player", element: <Navigate to="/player/home" replace /> },
  { path: "/scout", element: <Navigate to="/scout/home" replace /> },

  {
    element: <ProtectedRoute allowedRoles={["player"]} />,
    children: [
      { path: "/player/home", element: <PlayerHome /> },
      { path: "/player/media", element: <PlayerMedia /> },
      { path: "/player/progress", element: <ProgressAnalytics /> },
      { path: "/player/message", element: <MessagingPage /> },
      { path: "/player/profile", element: <ProfilePage /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["scout"]} />,
    children: [
      { path: "/scout/home", element: <ScoutHome /> },
      { path: "/scout/playerSearch", element: <PlayerSearch /> },
      { path: "/scout/profile", element: <ScoutProfile /> },
      { path: "/scout/shortlists", element: <Shortlists /> },
      { path: "/scout/playerSearch/:id", element: <Player /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["team"]} />,
    children: [
      { path: "/team/dashboard", element: <TeamDashboard /> },
      { path: "/team/roster", element: <TeamRoster /> },
      { path: "/team/stats", element: <TeamStats /> },
      { path: "/team/matches", element: <TeamMatches /> },
      {path: "/team/profile", element: <TeamProfile /> },
    ],
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
