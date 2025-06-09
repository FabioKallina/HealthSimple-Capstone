import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import CheckIn from "./pages/CheckIn";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Navbar from "./components/NavBar";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/ResetPassword";
import FriendProfile from "./pages/FriendProfile";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <Nutrition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkIn"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends/:friendId"
          element={
            <ProtectedRoute>
              <FriendProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
