import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const HOSPITAL_ROLES = [
  {
    id: "soc-analyst",
    title: "SOC Analyst",
    description: 'Monitor threats, investigate incidents and manage security alerts',
    btnText: "Login as SOC Analyst",
  },
  {
    id: "network-admin",
    title: "Network Administrator",
    description: 'Monitor network infrastructure, assets and connectivity',
    btnText: "Login as Network Administrator",
  },
  {
    id: "clinical-it-lead",
    title: "Clinical IT Lead",
    description: 'Access authorized healthcare services and security information',
    btnText: "Login as Clinical IT Lead",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      if (selectedRole) {
        sessionStorage.setItem("activeRole", selectedRole.title);
        sessionStorage.setItem("activeRoleId", selectedRole.id);
        navigate(`/dashboard/${selectedRole.id}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email address or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Authentication failed. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {!selectedRole ? (
        /* ================= 3 Roles Selection View ================= */
        <div className="role-selection-wrapper">
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
            <button className="back-link" onClick={() => navigate("/")}>
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>

          <div className="role-selection-header">
            <h1>Select Your Hospital Role</h1>
            <p>
              AI-ACDS enforces strict compartmentalization. Choose your designated operational role to
              proceed to your secure login terminal.
            </p>
          </div>

          <div className="role-cards-grid">
            {HOSPITAL_ROLES.map((role) => (
              <div key={role.id} className="role-card">
                <div>
                  <h2 className="role-title">{role.title}</h2>
                  <p className="role-description">{role.description}</p>
                </div>

                <div>
                  <div className="role-clearance">{role.clearance}</div>
                  <button
                    type="button"
                    className="role-login-btn"
                    onClick={() => {
                      setSelectedRole(role);
                      setError("");
                    }}
                  >
                    {role.btnText} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="switch-line" style={{ marginTop: "32px" }}>
            New to AI-ACDS?{" "}
            <a onClick={() => navigate("/register")}>Register for clearance</a>
          </p>
        </div>
      ) : (
        /* ================= Terminal Login for Chosen Role ================= */
        <div className="role-selection-wrapper" style={{ maxWidth: "680px" }}>
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
            <button
              className="back-link"
              onClick={() => {
                setSelectedRole(null);
                setError("");
              }}
            >
              <ArrowLeft size={16} /> Change Role
            </button>
          </div>

          <div className="role-selection-header" style={{ marginBottom: "26px" }}>
            <h1>{selectedRole.title} Login</h1>
            <p>
              Enter your authorized credentials to access the {selectedRole.title} terminal control plane.
            </p>
          </div>

          <div className="auth-card login-terminal-card">
            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="login-terminal-grid">
                <div className="field">
                  <label>Work Email Address <span>*</span></label>
                  <div className="input-wrap">
                    <Mail size={15} className="input-icon" />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="staff@organization.org"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Account Password <span>*</span></label>
                  <div className="input-wrap">
                    <Lock size={15} className="input-icon" />
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="register-submit-btn" disabled={loading}>
                {loading ? "Authenticating..." : `Login as ${selectedRole.title}`}
              </button>

              <p className="register-switch-line">
                Don't have an account?{" "}
                <a onClick={() => navigate("/register")}>Register here</a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;