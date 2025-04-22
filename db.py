import os
from pymongo import MongoClient

# Fetch the Mongo URI from the environment variable (it will be set in docker-compose.yml)
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mmt')  # Default to localhost if not set
client = MongoClient(mongo_uri)

# Database and collections
db = client["mmt"]  # Database name
packages_collection = db["packages"]
users_collection = db["users"]
discounts_collection = db["discounts"]