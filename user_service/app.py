import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import users_collection
from datetime import datetime

app = Flask(__name__)
CORS(app)

ADMIN_URL = "http://admin_service:5001/packages"

# CARBON_URL = "http://127.0.0.1:5002/carbon/estimate"

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    userType = data.get("userType", "user")  # default role is 'user'
    dob = data.get("dob")  # Extract DOB from the request data
    email = data.get("email")  # Extract email from the request data

    if not username or not password or not dob or not email:
        return jsonify({"error": "Username, password, DOB, and email are required"}), 400

    # Check if user already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already taken"}), 409

    # Save to DB
    new_user = {
        "username": username,
        "password": password,
        "userType": userType,
        "dob": dob,
        "email": email  # Include email in the user data
    }
    users_collection.insert_one(new_user)

    return jsonify({"message": "Registration successful"}), 201

@app.route('/user/packages', methods=['GET'])
def get_packages():
    try:
        res = requests.get(ADMIN_URL)
        res.raise_for_status()
        return jsonify(res.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route('/user/select', methods=['POST'])
def select_package():
    data = request.get_json()
    package_id = data.get("package_id")
    user_id = data.get("user_id")
    custom_activities = data.get("custom_activities", [])
    custom_dates = data.get("custom_dates")

    # Step 1: Fetch package details from Admin service
    try:
        all_packages = requests.get(ADMIN_URL).json()
        selected = next((pkg for pkg in all_packages if pkg["_id"] == package_id), None)
    except Exception as e:
        return jsonify({"error": "Failed to fetch package data", "details": str(e)}), 500

    if not selected:
        return jsonify({"error": "Package not found"}), 404

    # Step 2: Estimate Carbon Footprint
    '''try:
        carbon_payload = {
            "destination": selected["destination"],
            "activities": custom_activities or selected["activities"],
            "duration_days": int(selected["duration"].split()[0])  # "5 days" => 5
        }

        carbon_res = requests.post(CARBON_URL, json=carbon_payload)
        carbon_data = carbon_res.json()

    except Exception as e:
        return jsonify({"error": "Carbon estimation failed", "details": str(e)}), 500'''

    # Fetch package info from admin_service as you're already doing
    package_price = selected.get("price", 0)

    # Simulated user DOB (in real case, would come from user profile)
    user_dob = "2000-04-09"

    # Call discount service
    try:
        discount_response = requests.post(
            "http://localhost:5003/discount/calculate",
            json={"dob": user_dob}
        )
        discount_data = discount_response.json()
        discount_percent = discount_data.get("discount_percent", 0)
        discount_reason = discount_data.get("reason", "")

        final_price = package_price * (1 - discount_percent / 100)

    except Exception as e:
        discount_percent = 0
        discount_reason = "Discount service unavailable"
        final_price = package_price

    # Final response
    response = {
        "user_id": user_id,
        "package_id": package_id,
        "custom_dates": custom_dates,
        "custom_activities": custom_activities,
        "carbon_estimate": carbon_data,
        "original_price": package_price,
        "discount_percent": discount_percent,
        "discount_reason": discount_reason,
        "final_price": final_price,
        "notes": "Package customized, evaluated, and priced."
    }

    return jsonify(response), 200


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})

    if user and user["password"] == password:
        return jsonify({"message": "Login successful", "userType": user["userType"]}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route('/packages/<pkg_id>', methods=['GET'])
def get_package_by_id(pkg_id):
    try:
        # Query the database to find the package by its ID
        package = users_collection.packages.find_one({"_id": ObjectId(pkg_id)})

        if package:
            return jsonify(package), 200
        else:
            return jsonify({"error": "Package not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/user', methods=['GET'])
def get_user():
    username = request.args.get('username')
    if username:
        # Fetch user data (including birthday message)
        user = users_collection.find_one({"username": username})
        if user:
            # Check birthday
            today = datetime.now()
            dob = datetime.strptime(user['dob'], '%Y-%m-%d')
            birthday_today = today.month == dob.month and today.day == dob.day
            birthday_wish = f"🎉 Happy Birthday, {username}!" if birthday_today else ""
            return jsonify({"birthday_wish": birthday_wish, "username": username})
        else:
            return jsonify({"error": "User not found"}), 404
    return jsonify({"error": "Username is required"}), 400


@app.route('/user/<username>', methods=['GET'])
def get_user_by_username(username):
    user = users_collection.find_one({"username": username})
    if user:
        return jsonify({
            "username": user["username"],
            "dob": user.get("dob", ""),
            "email": user.get("email", "")
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()

    if not isinstance(data, dict):  # Expecting a single object for checkout
        return jsonify({"error": "Expected checkout data object"}), 400

    username = data.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    # Fetch user email from MongoDB based on username
    try:
        user = db.users.find_one({"username": username})
        if not user or not user.get("email"):
            return jsonify({"error": "User not found or email missing"}), 404

        user_email = user["email"]

    except Exception as e:
        return jsonify({"error": f"Failed to fetch user email: {str(e)}"}), 500

    results = {
        "email": user_email,
        "message": "Checkout successful"
    }

    return jsonify(results), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5005, debug=True)
