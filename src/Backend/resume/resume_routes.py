from flask import Blueprint, request, jsonify
from .extract import extract_pdf_text
from .analyzer import analyze_resume_text
from Database.connection import get_connection
import json

resume = Blueprint("resume", __name__)

ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@resume.route("/analyze", methods=["POST"])
def analyze_resume():
    if "file" not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    file = request.files["file"]

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    # Extract text
    try:
        text = extract_pdf_text(file)
        if not text.strip():
            return jsonify({"error": "PDF contains no text"}), 400
    except Exception as e:
        print("PDF extraction error:", e)
        return jsonify({"error": "Failed to extract text from PDF"}), 500

    # AI analysis — returns dict directly now
    try:
        analysis = analyze_resume_text(text)
    except Exception as e:
        print("AI analysis error:", e)
        return jsonify({"error": "Failed to analyze resume"}), 500

    # Store in DB
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO analyses (resume_text, result) VALUES (%s, %s)",
            (text, json.dumps(analysis))
        )
        conn.commit()
    except Exception as e:
        print("DB Error:", e)
    finally:
        cur.close()
        conn.close()

    return jsonify({
        "message": "Resume analyzed successfully",
        "resume_text": text,
        "analysis": analysis
    })
