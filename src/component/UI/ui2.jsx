import './ui2.css'
import UploadBtn2 from '../../component/UploadBtn/filepickerdemo.jsx'

const UI2 = () => {
    return (
        <>
            <div className='main-container2'>
                <div className='main-head2'>
                    <h1>Resume Analyzer</h1>
                    <p>Instantly analyze resumes using AI to highlight skills, experience, and gives job-fit insights.</p>
                </div>
                <div className='btnandp2'>
                    <UploadBtn2 />
                    <p>Only .pdf </p>
                </div>

            </div>
        </>
    )
}

export default UI2