import requests

url = "http://127.0.0.1:5001/packages"

res = requests.get(url)

print("Status Code:", res.status_code)
print("Response:", res.json())