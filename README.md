# AI Powered Resume Analyzer

A full-stack web application that analyzes PDF resumes using AI to extract key skills, strengths, weaknesses, job-fit suggestions, and ATS optimization tips.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Flask](https://img.shields.io/badge/Flask-Python-green?logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?logo=mysql)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-purple)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-yellow?logo=vite)

---

## Features

- Upload PDF resumes and get instant AI-powered analysis
- Extracts Key Skills, Strengths, Weaknesses, Job Fit Suggestions, and ATS Tips
- Secure user authentication (signup, login, forgot password)
- Email-based password reset with 1-hour token expiry
- Real-time username availability check on signup
- Protected routes — analysis only accessible after login
- Fully mobile responsive with hamburger navigation
- Lazy-loaded pages for fast performance

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite | Build tool |
| React Router v7 | Client-side routing |
| react-icons | Icon library |
| easy-file-picker | PDF file selection |

### Backend
| Technology | Purpose |
|-----------|---------|
| Flask | REST API server |
| Groq (LLaMA 3.3-70b) | AI resume analysis |
| PyMuPDF | PDF text extraction |
| bcrypt | Password hashing |
| MySQL | Database |
| Flask-CORS | Cross-origin requests |
| Gunicorn | Production server |

---

## Project Structure

```
AI-Powered-Resume-Analyzer/
├── src/
│   ├── Backend/                  # Flask backend
│   │   ├── app.py                # Flask entry point
│   │   ├── requirements.txt      # Python dependencies
│   │   ├── migrate.sql           # DB migration script
│   │   ├── .env.example          # Environment variables template
│   │   ├── auth/
│   │   │   └── routes.py         # Auth endpoints (signup, login, reset)
│   │   ├── resume/
│   │   │   ├── resume_routes.py  # Resume analysis endpoint
│   │   │   ├── analyzer.py       # Groq AI integration
│   │   │   └── extract.py        # PDF text extraction
│   │   └── Database/
│   │       └── connection.py     # MySQL connection
│   ├── Pages/                    # React pages
│   │   ├── Home/                 # Home page (upload)
│   │   ├── Analyze/              # Analysis results
│   │   ├── About/                # About page
│   │   ├── SampleHome/           # Landing page (unauthenticated)
│   │   └── Auth/                 # Login, Signup, Reset Password
│   ├── component/                # Reusable components
│   │   ├── Navbar/               # Nav (authenticated + public)
│   │   ├── UI/                   # Upload UI
│   │   ├── UploadBtn/            # File picker buttons
│   │   ├── Footer/               # Footer
│   │   └── utils/                # Route protector
│   ├── App.jsx                   # Router setup with lazy loading
│   └── main.jsx                  # React entry point
├── .env.example                  # Frontend env template
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8+

### 1. Clone the repository
```bash
git clone https://github.com/awaisbhatti267/AI-Powered-Resume-Analyzer.git
cd AI-Powered-Resume-Analyzer
```

### 2. Set up the database
Open MySQL Workbench and run:
```sql
CREATE DATABASE ai_resume;
USE ai_resume;

CREATE TABLE auth (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    resume_text LONGTEXT,
    result JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Set up the backend
```bash
cd src/Backend
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

```env
GROQ_API_KEY=your_groq_api_key        # Get free at console.groq.com
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_resume
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
DEBUG=true
```

Start the backend:
```bash
python app.py
```

### 4. Set up the frontend
```bash
# From project root
npm install
```

Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 5. Open the app
Visit **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Login |
| GET | `/auth/check-username?name=` | Check username availability |
| POST | `/auth/forget-password` | Send reset email |
| GET | `/auth/reset-password/:token` | Validate reset token |
| POST | `/auth/reset-password/:token` | Reset password |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/analyze` | Upload PDF and get AI analysis |

---

## Environment Variables

### Frontend (`.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

### Backend (`src/Backend/.env`)
| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Groq API key (free at console.groq.com) |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `EMAIL_SENDER` | Gmail address for sending reset emails |
| `EMAIL_PASSWORD` | Gmail App Password |
| `FRONTEND_URL` | Frontend URL for CORS |
| `DEBUG` | Flask debug mode (true/false) |

---

## Getting a Free Groq API Key

1. Go to **https://console.groq.com**
2. Sign up with Google
3. Click **API Keys → Create API key**
4. Copy the key starting with `gsk_...`

---

## Screenshots

> Login Page · Home Page · Resume Analysis Results

---

## Author

**Muhammad Awais Bhatti**
- GitHub: [@awaisbhatti267](https://github.com/awaisbhatti267)
- LinkedIn: [Muhammad Awais Bhatti](https://linkedin.com/in/muhammadawaisbhatti)
- Email: awaisxbhatti@gmail.com

---

## License

This project is open source and available under the [MIT License](LICENSE).
