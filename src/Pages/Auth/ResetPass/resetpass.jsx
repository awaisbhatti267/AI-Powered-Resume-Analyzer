import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./resetpass.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Resetpass = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(null); // null = loading

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/reset-password/${token}`);
        const data = await res.json();

        setTokenValid(data.valid);

        if (!data.valid) {
          setMessage("❌ Invalid or expired reset link.");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setMessage("⚠️ Unable to validate reset link.");
        setTokenValid(false);
      }
    };
    checkToken();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/Login"), 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="reset-container">
      <div className="form-reset">

        {/* LOADING state */}
        {tokenValid === null && <p>⏳ Checking reset link…</p>}

        {/* INVALID TOKEN */}
        {tokenValid === false && (
          <p className="error">{message}</p>
        )}

        {/* VALID TOKEN */}
        {tokenValid === true && (
          <form onSubmit={handleResetPassword}>
            <h2>Reset Password</h2>

            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {/* MESSAGE */}
            {message && tokenValid === true && (
              <p className={message.includes("✅") ? "success" : "error"}>
                {message}
              </p>
            )}

            <button type="submit">Reset Password</button>

          </form>
        )}
      </div>

    </div>
  );
};

export default Resetpass;
