import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import "./analyze.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AnalyzePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");

  const file = state?.file;

  useEffect(() => {
    if (!file) {
      navigate("/home");
      return;
    }
    analyzeResume(file);
  }, [file, navigate]);

  const analyzeResume = async (file) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/resume/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to analyze resume.");
        return;
      }

      setAnalysisData(data.analysis);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Failed to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const renderList = (items) => {
    if (!items || items.length === 0) return <li>No data found</li>;
    return items.map((item, i) => <li key={i}>{item}</li>);
  };

  return (
    <div className="analyze-container">
      <button className="back-btn" onClick={() => navigate("/home")}>
        <FaArrowLeft /> Back
      </button>

      <h1 className="title">Resume Analysis</h1>
      <p className="subtitle">{file?.name}</p>

      {/* Loading */}
      {loading && (
        <div className="loading-box">
          <div className="loading-circle"></div>
          <p>Analyzing with AI...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="error-box">
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate("/home")}>
            Go Back
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && analysisData && (
        <div className="result-box">
          <h2><FaCheckCircle color="green" /> Analysis Complete</h2>

          <div className="result-section">
            <h3>Key Skills</h3>
            <ul>{renderList(analysisData.key_skills)}</ul>
          </div>

          <div className="result-section">
            <h3>Strengths</h3>
            <ul>{renderList(analysisData.strengths)}</ul>
          </div>

          <div className="result-section">
            <h3>Weaknesses</h3>
            <ul>{renderList(analysisData.weaknesses)}</ul>
          </div>

          <div className="result-section">
            <h3>Job Fit Suggestions</h3>
            <ul>{renderList(analysisData.job_fit_suggestions)}</ul>
          </div>

          <div className="result-section">
            <h3>ATS Tips</h3>
            <ul>{renderList(analysisData.ats_tips)}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;
