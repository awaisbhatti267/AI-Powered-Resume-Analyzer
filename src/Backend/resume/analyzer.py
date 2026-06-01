import os
import json
from groq import Groq

# Module-level singleton — created once after app.py loads .env
_client = None

def get_client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _client

def analyze_resume_text(text):
    client = get_client()

    prompt = f"""
You are an expert AI Resume Analyzer.

Analyze the following resume text and extract key_skills, strengths, weaknesses, job_fit_suggestions, ats_tips.

If you cannot find a value, write "Not found".

Return ONLY a valid JSON object, no extra text, no markdown, no code fences, just raw JSON like this:

{{
  "key_skills": [],
  "strengths": [],
  "weaknesses": [],
  "job_fit_suggestions": [],
  "ats_tips": []
}}

Resume Text:
{text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert AI Resume Analyzer. Always respond with valid JSON only. No markdown, no code fences, just raw JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
        )

        ai_text = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if ai_text.startswith("```"):
            ai_text = ai_text.split("```")[1]
            if ai_text.startswith("json"):
                ai_text = ai_text[4:]
            ai_text = ai_text.strip()

        analysis_json = json.loads(ai_text)
        return analysis_json

    except Exception as e:
        print("AI Error or invalid JSON:", e)
        return {
            "key_skills": ["Not found"],
            "strengths": ["Not found"],
            "weaknesses": ["Not found"],
            "job_fit_suggestions": ["Not found"],
            "ats_tips": ["Not found"]
        }
