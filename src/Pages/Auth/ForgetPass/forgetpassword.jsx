import { useState } from 'react';
import Fimage from '../../../assets/forget.webp';
import { FaKey } from "react-icons/fa";
import './forgetpass.css';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Reset link sent! Check your email.");
        setTimeout(() => navigate("/Login"), 2500);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='forget-container'>
      <div className='forget-model'>
        <div className='for-icon'><FaKey /></div>
        <h2>Forgot Password</h2>
        <p>Enter your email address and</p>
        <p>we'll send you a reset link.</p>

        {message && <p className="msg-box">{message}</p>}

        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button type="submit" disabled={loading}>
            {loading ? <><span className="spinner"></span> Sending...</> : "Send Reset Link"}
          </button>
        </form>

        <Link to="/Login">Back to Login</Link>
      </div>

      <div className='sv-Line'></div>
      <div className='forimage'>
        <img src={Fimage} alt="Forgot password illustration" width="400" height="400" loading="lazy" />
      </div>
    </div>
  );
};

export default ForgetPassword;
