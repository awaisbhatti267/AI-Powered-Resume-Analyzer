import { useState } from "react";
import { getFile } from "easy-file-picker";
import { FaFileUpload, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./filepicker.css";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const uploadFile = async () => {
    try {
      const fileObj = await getFile({
        accept: [".pdf"],
        multiple: false,
      });

      const file = Array.isArray(fileObj) ? fileObj[0] : fileObj?.files?.[0] || fileObj;
      if (!file) return;

      setSelectedFile(file);
    } catch (err) {
      console.error("File pick error:", err);
    }
  };

  const startAnalyze = () => {
    navigate("/Analyze", { state: { file: selectedFile } });
  };

  return (
    <div className="file-uploader-container">
      <button className="uploadbtnn" onClick={uploadFile}>
        <FaFileUpload className="icon" />
        {selectedFile ? "Change File" : "Upload Resume"}
      </button>

      {selectedFile && (
        <div className="file-table">
          <div className="file-row">
            <div className="file-index">1</div>
            <div className="file-name">{selectedFile.name}</div>
            <button
              className="analyze-btn"
              onClick={startAnalyze}
              aria-label="Analyze resume"
            >
              <FaPlay size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
