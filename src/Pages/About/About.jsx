import Nav_bar from '../../component/Navbar/Nav'
import Image from '../../assets/resume.webp'
import Footer from "../../component/Footer/footer";
import './about.css'

const About = () => {
  return (
    <>
      <Nav_bar />
      <div className='about-container'>
        <div><img src={Image} alt="Resume illustration" width="400" height="400" loading="lazy" /></div>

        <div className='description'>
          <h2>
            <span className="highlight">AI</span> Powered Resume Analyzer
          </h2>

          <p className='par'>
            The AI-Powered Resume Analyzer is a cutting-edge tool designed to help job seekers
            and recruiters optimize the resume review process. Using advanced artificial
            intelligence algorithms, it scans resumes to identify key skills, work experience,
            education, and accomplishments. The analyzer provides actionable insights by
            highlighting strengths, pinpointing areas for improvement, and suggesting ways to
            tailor resumes for specific job roles.

            Whether you are looking to enhance your chances of landing interviews or streamline
            the hiring process, this tool saves time, ensures accuracy, and delivers a clear,
            professional assessment of each resume. It is ideal for individuals aiming to make a
            strong impression and for recruiters seeking to quickly evaluate candidates’
            qualifications with precision.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
