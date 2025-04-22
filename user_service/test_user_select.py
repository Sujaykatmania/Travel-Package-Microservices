import requests

url = "http://127.0.0.1:5005/user/select"

payload = {
    "user_id": "u123",
    "package_id": "67f6af95c33a80190f81001a",
    "custom_dates": "2025-05-15 to 2025-05-20",
    "custom_activities": ["Paragliding", "Local Food Tour"]
}

res = requests.post(url, json=payload)

print("Status Code:", res.status_code)
print("Response:", res.json())
