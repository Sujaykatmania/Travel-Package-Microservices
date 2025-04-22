import requests

url = "http://127.0.0.1:5003/discount/calculate"

payload = {
    "dob": "2000-04-09",          # Set to today’s date for birthday test
    "today": "2025-04-09"         # Simulate current date (can skip this to use real date)
}

res = requests.post(url, json=payload)

print("Status Code:", res.status_code)
print("Response:", res.json())
