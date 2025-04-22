import requests

url = "http://localhost:5005/user/select"

payload = {
    "user_id": "u789",
    "package_id": "67f6af95c33a80190f81001a",
    "custom_dates": "2025-07-01 to 2025-07-07",
    "activities": ["Trekking", "River Rafting"]
}

res = requests.post(url, json=payload)
print("Status Code:", res.status_code)
print("Response:", res.json())
