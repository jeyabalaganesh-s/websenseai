from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Database connection using environment variables
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", 3306)),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    database=os.getenv("DB_NAME")
)
cursor = db.cursor(dictionary=True)

# Fetch users from MySQL
@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return jsonify(users)

# Insert a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    cursor.execute(
        "INSERT INTO users (name, email) VALUES (%s, %s)", 
        (data['name'], data['email'])
    )
    db.commit()
    return jsonify({"message": "User added!"})

if __name__ == '__main__':
    # Render sets PORT environment variable
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
