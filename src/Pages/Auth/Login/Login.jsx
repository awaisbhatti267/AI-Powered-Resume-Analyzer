import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";
import { AiOutlineTeam } from "react-icons/ai";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/home");
  }, [navigate]);

  const handlelogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const email = data.user?.email || identifier;
        const username = data.user?.name || email.split("@")[0] || "User";
        localStorage.setItem("user", JSON.stringify({ username, email }));
        navigate("/home");
      } else {
        setMessage(data.message);
        setLoading(false);
      }
    } catch (error) {
      setMessage("⚠️ Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="full-back">
        <div className="textvet">
          <h2>Welcome To</h2>
          <p>AI Powered Resume Analyzer</p>
        </div>

        <div className="line"></div>

        <div className="loginform">
          <div className="icon"><AiOutlineTeam /></div>

          <form onSubmit={handlelogin}>
            <fieldset disabled={loading} style={{ border: "none", padding: 0, margin: 0 }}>
              <label>Username / Email</label>
              <input
                type="text"
                placeholder="Enter Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <button type="button" className="forgot-pass" onClick={() => navigate("/ForgotPassword")}>
                Forgot Password?
              </button>

              <button type="submit" className="login">
                {loading ? <><span className="spinner"></span> Logging in...</> : "Login"}
              </button>
            </fieldset>

            {message && <p className="login-message">{message}</p>}

            <p className="signup-link">
              Don't have an account? <Link to="/Signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
