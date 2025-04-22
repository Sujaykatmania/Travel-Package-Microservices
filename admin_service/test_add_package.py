import requests

url = "http://localhost:5001/packages"
data = {
    "destination": "Manali",
    "price": 12000,
    "duration": "5 days",
    "activities": ["Skiing", "Snowboarding", "Sightseeing"]
}

try:
    res = requests.post(url, json=data)
    print("Status Code:", res.status_code)
    print("Response:", res.json())
except Exception as e:
    print("Error:", str(e))
