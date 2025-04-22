from flask import Flask, request, jsonify
from flask_cors import CORS
from db import packages_collection, users_collection
from datetime import datetime
import requests
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/')
def home():
    return jsonify(message="Admin Service is running")

# POST route to add a holiday package
@app.route('/packages', methods=['POST'])
def add_package():
    package_id = ObjectId()
    data = request.json
    print("Inisde /packages", flush=True)
    # Basic validation: Ensure all required fields are present
    required_fields = ["destination", "price", "duration", "activities"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Optional tags field: Default to an empty list if not provided
    tags = data.get("tags", [])
    if not isinstance(tags, list):
        return jsonify({"error": "Tags must be a list"}), 400

    # Calculate dynamic price if enabled
    final_price = data["price"]
    pricing_service_error = False  # Flag to track pricing service errors
    if data.get("dynamicPricing", False):
        pricing_payload = {
            "packageId": str(package_id),
            "date": data.get("selectedDates", []),
            "destination": data["destination"],
            "visitors": data.get("visitors", 1),
            "bookings": data.get("bookings", 0),
            "price": data["price"],
            "duration": data["duration"],
            "activities": data["activities"],
            "tags": tags,
            "dynamicPricing": data["dynamicPricing"]
        }

        # Make a request to the pricing service (assuming it's running on port 5006)
        try:
            print("[DEBUG] Sending payload to pricing service:", pricing_payload, flush= True)
            pricing_res = requests.post('http://bore.pub:30001/package-price', json=pricing_payload)
            print("[DEBUG] Pricing service response status code:", pricing_res.status_code, flush= True)
            pricing_res.raise_for_status()  # Raise exception for invalid responses
            pricing_data = pricing_res.json()
            print("[DEBUG] Parsed JSON from pricing service:", pricing_data, flush= True)
            final_price = pricing_data.get("finalPrice", final_price)
            print("[DEBUG] Computed final_price to use:", final_price, flush= True)

        except requests.RequestException as err:
            print(f"Warning: Pricing service error: {err}")  # Log the error, don't immediately return
            pricing_service_error = True
            # Keep the final_price as the base price

    # Build the package document to insert into MongoDB
    package = {
        "_id": package_id,
        "destination": data["destination"],
        "price": data["price"],
        "duration": data["duration"],
        "activities": data["activities"],
        "tags": tags,
        "basePrice": data["price"],
        "computedPrice": final_price,
        "dynamicPricing": data.get("dynamicPricing", False)
    }

    # Insert into MongoDB
    try:
        print("Final computed price to be saved:", final_price)
        result = packages_collection.insert_one(package)
        response_data = {"message": "Package added successfully", "package_id": str(result.inserted_id)}
        if pricing_service_error:
            response_data["warning"] = "Dynamic pricing service was unavailable. Base price used."
        return jsonify(response_data), 201
    except Exception as e:
        return jsonify({"error": f"Failed to insert package: {str(e)}"}), 500

@app.route('/packages', methods=['GET'])
def get_all_packages():
    packages = list(packages_collection.find())
    for pkg in packages:
        pkg["_id"] = str(pkg["_id"]) # convert ObjectId to string
    return jsonify(packages), 200

@app.route('/packages/<package_id>', methods=['DELETE'])
def delete_package(package_id):
    result = packages_collection.delete_one({'_id': ObjectId(package_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Package deleted"}), 200
    return jsonify({"error": "Package not found"}), 404

@app.route('/admin', methods=['GET'])
def get_user():
    username = request.args.get('username')
    if username:
        # Fetch user data (including birthday message)
        user = users_collection.find_one({"username": username})
        if user:
            # Check birthday
            today = datetime.now()
            # Ensure 'dob' is in the correct format, and handle potential parsing issues
            try:
                dob = datetime.strptime(user['dob'], '%Y-%m-%d')
                birthday_today = today.month == dob.month and today.day == dob.day
                birthday_wish = f"🎉 Happy Birthday, {username}!" if birthday_today else ""
                return jsonify({"birthday_wish": birthday_wish, "username": username})
            except Exception as e:
                return jsonify({"error": f"Error parsing date of birth: {str(e)}"}), 400
        else:
            return jsonify({"error": "User not found"}), 404
    return jsonify({"error": "Username is required"}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5001, debug=True)
