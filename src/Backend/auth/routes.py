from flask import Blueprint, request, jsonify
from Database.connection import get_connection
import os
import re
import bcrypt
import smtplib
import secrets
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

auth = Blueprint("auth", __name__)

# ============================================================
#                     EMAIL VALIDATOR
# ============================================================

def is_valid_email(email):
    """Check it's a real email format — not just any string."""
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


# ============================================================
#              CHECK USERNAME AVAILABILITY
# ============================================================

@auth.route('/check-username', methods=['GET'])
def check_username():
    name = request.args.get('name', '').strip()
    if not name or len(name) < 2:
        return jsonify({"available": False}), 200

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT ID FROM auth WHERE Name=%s", (name,))
        exists = cursor.fetchone()
        return jsonify({"available": exists is None}), 200
    finally:
        cursor.close()
        conn.close()


# ============================================================
#                SIGNUP  (HASHED PASSWORD)
# ============================================================

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid request"}), 400

    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')

    # Validate all fields
    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400
    if len(name) < 2:
        return jsonify({"message": "Username must be at least 2 characters"}), 400
    if not is_valid_email(email):
        return jsonify({"message": "Please enter a valid email address"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    hashed_pw = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO auth (Name, Email, Password) VALUES (%s, %s, %s)",
            (name, email, hashed_pw)
        )
        conn.commit()
        return jsonify({"message": "✅ Account created successfully"}), 201

    except Exception as e:
        conn.rollback()
        if "1062" in str(e):
            if "Name" in str(e):
                return jsonify({"message": "❌ Username already taken"}), 409
            elif "Email" in str(e):
                return jsonify({"message": "❌ Email already registered"}), 409
        return jsonify({"message": "⚠️ Something went wrong. Please try again."}), 400

    finally:
        cursor.close()
        conn.close()


# ============================================================
#                          LOGIN
# ============================================================

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid request"}), 400

    identifier = data.get('identifier', '').strip()
    password   = data.get('password', '')

    if not identifier or not password:
        return jsonify({"message": "All fields are required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM auth WHERE Name=%s OR Email=%s",
            (identifier, identifier.lower())
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "❌ No account found with that username or email"}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['Password'].encode('utf-8')):
            return jsonify({"message": "❌ Incorrect password"}), 401

        return jsonify({
            "message": "Login successful",
            "user": {
                "id":    user['ID'],
                "name":  user['Name'],
                "email": user['Email']
            }
        }), 200

    finally:
        cursor.close()
        conn.close()


# ============================================================
#                 FORGET PASSWORD (SEND EMAIL)
# ============================================================

@auth.route('/forget-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid request"}), 400

    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({"message": "Email is required"}), 400
    if not is_valid_email(email):
        return jsonify({"message": "Please enter a valid email address"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM auth WHERE Email=%s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "❌ No account found with this email"}), 404

        # Generate token with 1-hour expiry
        token      = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        cursor.execute(
            "UPDATE auth SET reset_token=%s, reset_token_expiry=%s WHERE Email=%s",
            (token, expires_at, email)
        )
        conn.commit()

    finally:
        cursor.close()
        conn.close()

    # Send email outside DB block
    sent = send_reset_email(email, token)
    if not sent:
        return jsonify({"message": "⚠️ Failed to send email. Please try again."}), 500

    return jsonify({"message": "✅ Password reset link sent to your email"}), 200


# ============================================================
#               CHECK TOKEN VALIDITY
# ============================================================

@auth.route('/reset-password/<token>', methods=['GET'])
def validate_token(token):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM auth WHERE reset_token=%s",
            (token,)
        )
        user = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not user:
        return jsonify({"valid": False, "message": "Invalid or expired token"}), 400

    # Check expiry
    expiry = user.get('reset_token_expiry')
    if expiry and datetime.utcnow() > expiry:
        return jsonify({"valid": False, "message": "Reset link has expired. Please request a new one."}), 400

    return jsonify({"valid": True, "message": "Token is valid"}), 200


# ============================================================
#                  RESET PASSWORD (HASHED)
# ============================================================

@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid request"}), 400

    new_password = data.get('new_password', '')

    if not new_password:
        return jsonify({"message": "❌ Password required"}), 400
    if len(new_password) < 6:
        return jsonify({"message": "❌ Password must be at least 6 characters"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check token + expiry
        cursor.execute(
            "SELECT * FROM auth WHERE reset_token=%s",
            (token,)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "❌ Invalid or expired token"}), 400

        expiry = user.get('reset_token_expiry')
        if expiry and datetime.utcnow() > expiry:
            return jsonify({"message": "❌ Reset link has expired. Please request a new one."}), 400

        hashed_pw = bcrypt.hashpw(
            new_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

        cursor.execute(
            "UPDATE auth SET Password=%s, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=%s",
            (hashed_pw, token)
        )
        conn.commit()

    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "✅ Password updated successfully"}), 200


# ============================================================
#                        SEND EMAIL
# ============================================================

def send_reset_email(to_email, token):
    sender       = os.getenv("EMAIL_SENDER")
    password     = os.getenv("EMAIL_PASSWORD")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link   = f"{frontend_url}/ResetPass/{token}"

    html = f"""
    <html>
    <body style="font-family: Arial; background-color: #f9f9f9; padding: 30px;">
        <table width="600" style="margin:auto; background:white; border-radius:10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <tr style="background-color:#0a6efd; color:white;">
                <td style="padding:24px; text-align:center; font-size:22px; font-weight:bold;">
                    🔐 Password Reset Request
                </td>
            </tr>
            <tr>
                <td style="padding:30px; color:#333; font-size:15px; line-height:1.6;">
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your <strong>AI Resume Analyzer</strong> account.</p>
                    <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
                    <p style="text-align:center; margin: 28px 0;">
                        <a href="{reset_link}"
                           style="background:#0a6efd; color:white; padding:14px 32px;
                                  border-radius:8px; text-decoration:none; font-weight:bold;
                                  font-size:15px; display:inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p style="color:#888; font-size:13px;">
                        If you didn't request this, you can safely ignore this email.
                        Your password will not be changed.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding:16px; text-align:center; color:#aaa; font-size:12px; border-top:1px solid #eee;">
                    © AI Powered Resume Analyzer
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset Your Password — AI Resume Analyzer"
    msg["From"]    = sender
    msg["To"]      = to_email
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, to_email, msg.as_string())
        print(f"✅ Reset email sent to {to_email}")
        return True
    except Exception as e:
        print("❌ Error sending email:", e)
        return False
