import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Phone, Building2, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

function RegisterPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.fullName || !form.email || !form.username || !form.password || !form.role) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!form.agreed) {
      setError("You must acknowledge the policy to continue.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: form.fullName });

      await setDoc(doc(db, "users", user.uid), {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        department: form.department,
        role: form.role,
        createdAt: new Date().toISOString(),
      });

      navigate("/dashboard"); //change to wherever you want post-registration
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="role-selection-wrapper" style={{ maxWidth: "940px" }}>
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
          <button className="back-link" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>

        <div className="role-selection-header" style={{ marginBottom: "26px" }}>
          <h1>Hospital Personnel Registration</h1>
          <p>
            AI-ACDS centralized onboarding portal. Create your designated operator profile to request clearance.
          </p>
        </div>

        <div className="auth-card register-card">
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="register-grid">
              <div className="field">
                <label>Full Name <span>*</span></label>
                <div className="input-wrap">
                  <UserPlus size={15} className="input-icon" />
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Dr. Vignesh"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Official Email Address <span>*</span></label>
                <div className="input-wrap">
                  <Mail size={15} className="input-icon" />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="staff@organization.org"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Username <span>*</span></label>
                <div className="input-wrap">
                  <UserPlus size={15} className="input-icon" />
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. ashish.soc"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Phone Number<span>*</span></label>
                <div className="input-wrap">
                  <Phone size={15} className="input-icon" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Department / Team</label>
                <div className="input-wrap">
                  <Building2 size={15} className="input-icon" />
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. SOC Enclave"
                  />
                </div>
              </div>

              <div className="field">
                <label>Select Role <span>*</span> <span className="hint">(Managed internally)</span></label>
                <select name="role" value={form.role} onChange={handleChange} required>
                  <option value="" disabled>-- Select Assigned Role --</option>
                  <option value="SOC Analyst">SOC Analyst</option>
                  <option value="Network Administrator">Network Administrator</option>
                  <option value="Clinical IT Lead">Clinical IT Lead</option>
                </select>
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
                    placeholder="Min 6 characters"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Confirm Password <span>*</span></label>
                <div className="input-wrap">
                  <Lock size={15} className="input-icon" />
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <label className="register-checkbox">
              <input name="agreed" checked={form.agreed} onChange={handleChange} type="checkbox" required />
              <span>
                I acknowledge that I am an authorized user of this system and agree to comply with
                the Cybersecurity Code of Conduct and audit logging policies.
              </span>
            </label>

            <button className="register-submit-btn" type="submit" disabled={loading}>
              {loading ? "Submitting Registration..." : "Submit Registration"}
            </button>

            <p className="register-switch-line">
              Already registered? <a onClick={() => navigate("/login")}>Sign in to your account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;