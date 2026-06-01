// UI.jsx

import "./ui.css";
import FileUploader from "../../component/UploadBtn/filepicker.jsx";

const UI = () => {
  return (
    <div className="main-container">

      <div className="main-head">
        <h1>Resume Analyzer</h1>
        <p>
          Instantly analyze resumes using AI to highlight skills, experience,
          and gives job-fit insights.
        </p>
      </div>

      <div className="btnandp">
        <FileUploader />
        <p>Only .pdf</p>
      </div>

    </div>
  );
};

export default UI;
