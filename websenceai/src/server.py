from flask import Flask, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow React to communicate with Flask

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'  # Change if using a remote database
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Jeya@123'
app.config['MYSQL_DB'] = 'websenseai'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'  # Fetch results as dictionaries

mysql = MySQL(app)

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users")  # Replace 'users' with your table name
        users = cur.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
