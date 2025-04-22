from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
from db import discounts_collection

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "DELETE"])


@app.route("/discount/calculate", methods=["POST"])
def calculate_discount():
    data = request.get_json()
    dob_str = data.get("dob")  # format: YYYY-MM-DD
    today_str = data.get("today")  # optional override for today's date

    try:
        # Fetch the seasonal discount settings from the database
        seasonal_discount = discounts_collection.find_one({"type": "seasonal"})
        seasonal_discount_months = seasonal_discount["months"] if seasonal_discount else [4, 6,
                                                                                          12]  # Default months if not set

        # Parse the DOB and today dates
        dob = datetime.strptime(dob_str, "%Y-%m-%d")
        today = datetime.strptime(today_str, "%Y-%m-%d") if today_str else datetime.today()

        discount = 0
        reason = []

        # Check if it's the user's birthday
        if dob.day == today.day and dob.month == today.month:
            discount = 10  # 10% discount for birthday
            reason.append("Birthday 🎂")

        # Check for seasonal discounts
        if today.month in seasonal_discount_months:
            seasonal_discount_value = seasonal_discount["discount"] if seasonal_discount else 10  # Default to 10%
            if discount < seasonal_discount_value:  # Apply seasonal discount only if it's greater than birthday discount
                discount = seasonal_discount_value
                reason = ["Seasonal ❄️"]

        # Format reason
        discount_reason = " and ".join(reason) if reason else "No discount"

        # Return discount percentage and reason
        return jsonify({
            "discount_percent": discount,
            "reason": discount_reason
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid date format", "details": str(e)}), 400


@app.route("/admin/discount", methods=["GET", "POST", "DELETE"])
def manage_discount():
    if request.method == "GET":
        # Fetch the current seasonal discount settings from the database
        seasonal_discount = discounts_collection.find_one({"type": "seasonal"})

        if seasonal_discount:
            return jsonify({
                "months": seasonal_discount["months"],
                "discount": seasonal_discount["discount"]
            }), 200
        else:
            # No discount exists, return a message indicating no discount is set
            return jsonify({"message": "No seasonal discount set yet"}), 200

    elif request.method == "POST":
        # Add or update the seasonal discount settings
        data = request.get_json()
        months = data.get("months")
        discount = data.get("discount")

        # Validation for months and discount
        if not months or not discount:
            return jsonify({"error": "Missing required fields"}), 400

        # Validate months: Ensure the list is not empty and each month is between 1 and 12
        if not isinstance(months, list) or len(months) == 0:
            return jsonify({"error": "Months should be a non-empty list of months between 1 and 12"}), 400

        if any(month < 1 or month > 12 for month in months):
            return jsonify({"error": "Months must be between 1 and 12"}), 400

        # Validate discount: It must be between 1 and 100
        if not isinstance(discount, (int, float)) or discount < 1 or discount > 100:
            return jsonify({"error": "Discount must be a number between 1 and 100"}), 400

        # Check if the seasonal discount exists, and update or insert accordingly
        existing_discount = discounts_collection.find_one({"type": "seasonal"})
        if existing_discount:
            # Update the existing discount
            discounts_collection.update_one(
                {"type": "seasonal"},
                {"$set": {"months": months, "discount": discount}}
            )
            return jsonify({"message": "Seasonal discount updated successfully"}), 200
        else:
            # Add a new seasonal discount
            discounts_collection.insert_one({
                "type": "seasonal",
                "months": months,
                "discount": discount
            })
            return jsonify({"message": "New seasonal discount added successfully"}), 201

    elif request.method == "DELETE":
        try:
            # Delete the seasonal discount from the database
            result = discounts_collection.delete_one({"type": "seasonal"})

            if result.deleted_count > 0:
                return jsonify({"message": "Seasonal discount deleted successfully"}), 200
            else:
                return jsonify({"error": "No seasonal discount found to delete"}), 404

        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5003, debug=True)
