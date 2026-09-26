import "@splinetool/viewer";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <spline-viewer
        url="https://prod.spline.design/q3y4VLmVJTj58VDm/scene.splinecode"
        className="spline-bg"
      ></spline-viewer>
      <div className="spline-watermark-cover"></div>
      <div className="hero-content">
        <span className="eyebrow">Cybersecurity · AI</span>
        <h1>
          AI-Powered
          <br />
          Autonomous
          <br />
          Cyber Defence
          <br />
          System
        </h1>
        <p className="subtext">
          Real-time threat detection and response, driven entirely by AI —
          no human in the loop required.
        </p>
        <div className="cta-row">
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:roleId"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;