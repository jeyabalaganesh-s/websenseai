from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="jeya",
    password="Jeya@123",
    database="websenceai"
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
    cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", (data['name'], data['email']))
    db.commit()
    return jsonify({"message": "User added!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
