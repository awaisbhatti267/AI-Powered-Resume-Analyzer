import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './signup.css';
import { AiOutlineTeam } from "react-icons/ai";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Username availability check
  const [usernameStatus, setUsernameStatus] = useState("idle"); // idle | checking | available | taken
  const [usernameTimer, setUsernameTimer] = useState(null);

  const checkUsername = (value) => {
    if (usernameTimer) clearTimeout(usernameTimer);
    if (!value || value.length < 2) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/auth/check-username?name=${encodeURIComponent(value)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500); // debounce 500ms
    setUsernameTimer(timer);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    checkUsername(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (usernameStatus === "taken") {
      setMessage("❌ Username is already taken. Please choose another.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Account created! Redirecting to login...");
        setTimeout(() => navigate("/Login"), 1500);
      } else {
        setMessage(data.message);
        setLoading(false);
      }
    } catch (error) {
      setMessage("⚠️ Cannot connect to server. Make sure the backend is running on port 5000.");
      setLoading(false);
    }
  };

  return (
    <div className="login-background2">
      <div className="full-back2">
        <div className="textvet2">
          <h2>Create Account</h2>
          <p>AI Powered Resume Analyzer</p>
        </div>

        <div className="line2"></div>

        <div className="loginform2">
          <div className="icon2"><AiOutlineTeam /></div>

          <form onSubmit={handleSignup}>
            <fieldset disabled={loading} style={{ border: "none", padding: 0, margin: 0 }}>

              {/* Username with availability indicator */}
              <label>Username</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={name}
                  onChange={handleNameChange}
                  required
                  autoComplete="username"
                  style={{ paddingRight: "36px" }}
                />
                {/* Status icon inside input */}
                <span style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)", fontSize: "16px"
                }}>
                  {usernameStatus === "checking" && (
                    <span className="spinner" style={{ borderColor: "#aaa", borderTopColor: "#555", width: 14, height: 14 }}></span>
                  )}
                  {usernameStatus === "available" && <FaCheckCircle color="#4caf50" />}
                  {usernameStatus === "taken"     && <FaTimesCircle color="#f44336" />}
                </span>
              </div>
              {/* Username hint text */}
              {usernameStatus === "available" && (
                <p style={{ color: "#a8ffcc", fontSize: 12, marginTop: 2 }}>✓ Username is available</p>
              )}
              {usernameStatus === "taken" && (
                <p style={{ color: "#ffb3b3", fontSize: 12, marginTop: 2 }}>✗ Username is already taken</p>
              )}

              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />

              <button
                type="submit"
                className="login"
                disabled={usernameStatus === "taken" || usernameStatus === "checking"}
              >
                {loading ? <><span className="spinner"></span> Creating...</> : "Create Account"}
              </button>

              <p className="signup-link2">
                Already have an account? <Link to="/Login">Login</Link>
              </p>
            </fieldset>
          </form>

          {message && (
            <p style={{ marginTop: 12, color: '#fff', fontSize: 14, textAlign: 'center' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
