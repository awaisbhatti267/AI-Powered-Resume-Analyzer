import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./filepicker.css";

const FileUploaderDemo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const gotologin = () => {
    if (loading) return;
    setLoading(true);
    navigate("/Login");
  };

  return (
    <button className="uploadbtnn2" onClick={gotologin} disabled={loading}>
      {loading
        ? <><span className="spinner"></span> Redirecting...</>
        : "Upload Resume"
      }
    </button>
  );
};

export default FileUploaderDemo;
