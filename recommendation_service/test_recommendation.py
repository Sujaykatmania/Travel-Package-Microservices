import requests

payload = {
    "user_id": "u123",
    "preferences": {
        "liked_destinations": ["Manali", "Goa"],
        "preferred_activities": ["Paragliding", "Beach"]
    }
}

res = requests.post("http://localhost:5004/recommend", json=payload)
print("Status Code:", res.status_code)
print("Response:", res.json())
