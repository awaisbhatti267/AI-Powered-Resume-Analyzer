# app.py

from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH, override=True)

from flask import Flask
from auth.routes import auth
from resume.resume_routes import resume
from flask_cors import CORS

app = Flask(__name__)

# Allow CORS for frontend (supports both dev ports)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, origins=[
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
])

# Blueprints
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(resume, url_prefix="/resume")

if __name__ == "__main__":
    debug_mode = os.getenv("DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode)
