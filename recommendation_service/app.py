from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Sample tags data
tags = [
    {"name": "hill station"},
    {"name": "relaxation"},
    {"name": "adventure"},
    {"name": "beach"}
]

@app.route('/')
def home():
    return jsonify(message="Recommendation Service is running")

# Define the /tags endpoint
@app.route('/tags', methods=['GET'])
def get_tags():
    return jsonify(tags)

@app.route('/recommend', methods=['POST'])
def recommend_packages():
    user_tags = request.json.get("tags", [])
    if not user_tags:
        return jsonify({"error": "Tags are required"}), 400

    try:
        # Convert user tags to lowercase
        user_tags = [tag.lower() for tag in user_tags]

        # Call the admin_service to get all packages
        response = requests.get("http://admin_service:5001/packages")
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch packages"}), 500

        all_packages = response.json()

        # Filter packages based on matching tags (case-insensitive)
        recommended = []
        for pkg in all_packages:
            pkg_tags = [t.lower() for t in pkg.get("tags", [])]
            if any(tag in pkg_tags for tag in user_tags):
                recommended.append(pkg)

        return jsonify(recommended), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5004, debug=True)
