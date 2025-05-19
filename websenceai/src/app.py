from flask import Flask, jsonify, request, session
from flask_cors import CORS
import mysql.connector
from flask_bcrypt import Bcrypt
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer  # Opinion Mining

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Required for sessions

CORS(app)
bcrypt = Bcrypt(app)
analyzer = SentimentIntensityAnalyzer()  # Initialize Sentiment Analyzer

# ✅ Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Jeya@123",
        database="websenceai",
        port=3306
    )

# ✅ User Registration API
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data["username"]
    email = data["email"]
    password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", 
                       (username, email, password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": "Database error", "error": str(err)}), 500
    finally:
        conn.close()

# ✅ User Login API

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username, password FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user["password"], password):
        session["user_id"] = user["id"]
        return jsonify({"message": "Login successful", "user": user}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

# ✅ Logout API
@app.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully"}), 200

# ✅ Submit Feedback with Sentiment Analysis
@app.route("/api/submit-feedback", methods=["POST"])
def submit_feedback():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request, no data received"}), 400

        print("🔍 Received Feedback Data:", data)

        feedback_text = data.get("feedback", "")
        if not feedback_text:
            return jsonify({"error": "Feedback text is required"}), 400

        sentiment_result = analyzer.polarity_scores(feedback_text)
        sentiment_score = sentiment_result["compound"]
        sentiment_label = "Positive" if sentiment_score > 0 else "Negative" if sentiment_score < 0 else "Neutral"

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """INSERT INTO feedback (name, email, website, feedback, rating, sentiment_score, sentiment_label, sentiment) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (data["name"], data["email"], data["website"], feedback_text, data["rating"], sentiment_score, sentiment_label, sentiment_label)

        print("🔍 SQL Query:", query)
        print("🔍 Query Values:", values)

        cursor.execute(query, values)
        conn.commit()
        conn.close()

        return jsonify({"message": "Feedback submitted successfully!", "sentiment": sentiment_label}), 201

    except Exception as e:
        print("❌ Error:", str(e))  # Log error
        return jsonify({"error": str(e)}), 500

@app.route("/api/ai-reports", methods=["GET"])
def get_ai_reports():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch feedback data with sentiment analysis
    cursor.execute("SELECT name, email, website, feedback, rating, sentiment FROM feedback")
    reports = cursor.fetchall()
    
    conn.close()
    
    if not reports:
        return jsonify({"message": "No reports found"}), 404  # Return a message if no data
    
    return jsonify(reports), 200  # Return AI Reports JSON


@app.route('/analyze', methods=['POST'])
def analyze_website():
    data = request.json
    website = data.get('url')

    if not website:
        return jsonify({"error": "No website URL provided"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # ✅ Fix here

        # Get sentiment counts
        cursor.execute(
            "SELECT sentiment_label, COUNT(*) as count FROM feedback WHERE website = %s GROUP BY sentiment_label",
            (website,))
        sentiment_counts = {row['sentiment_label']: row['count'] for row in cursor.fetchall()}

        # Get sentiment trends
        cursor.execute(
            "SELECT id, sentiment_score FROM feedback WHERE website = %s ORDER BY id ASC", 
            (website,))
        sentiment_trend = [{"score": row['sentiment_score']} for row in cursor.fetchall()]

        return jsonify({
            "sentiment_counts": sentiment_counts,
            "sentiment_trend": sentiment_trend
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        connection.close()


@app.route("/api/dashboard-stats", methods=["GET"])
def dashboard_stats():
    try:
        conn = get_db_connection()  # ✅ Initialize DB connection
        cursor = conn.cursor()

        # Fetch total users
        cursor.execute("SELECT COUNT(*) FROM users")
        users_count = cursor.fetchone()[0]

        # Fetch total AI reports
        cursor.execute("SELECT COUNT(*) FROM feedback")
        reports_count = cursor.fetchone()[0]

        # Fetch total website analyses (check if the table exists)
        try:
            cursor.execute("SELECT COUNT(*) FROM website_analysis")
            analyses_count = cursor.fetchone()[0]
        except mysql.connector.Error:
            analyses_count = 0  # If table doesn't exist, return 0

        conn.close()  # ✅ Close connection after fetching data

        return jsonify({
            "users": users_count,
            "reports": reports_count,
            "analyses": analyses_count
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
