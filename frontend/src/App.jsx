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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/checkIn" element={<CheckIn />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/friends/:friendId" element={<FriendProfile />} />
      </Routes>
    </>
  );
}

export default App;
