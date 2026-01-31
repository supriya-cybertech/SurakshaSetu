from pymongo import MongoClient
import os
import sys

# MongoDB Configuration
# Using the user-provided Atlas connection string
MONGODB_URL = "mongodb+srv://kumari200supriya_db_user:3S0e4DjTrVzb03cE@cluster0.moogy28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    print(f"Connecting to MongoDB Atlas...")
    client = MongoClient(MONGODB_URL)
    
    # Verify connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB Atlas successfully!")
    
    db = client["suraksha_setu_db"]

    # Collections
    residents_collection = db["residents"]
    visitors_collection = db["visitors"]
    incident_logs_collection = db["incident_logs"]
    access_logs_collection = db["access_logs"]
    camera_configs_collection = db["camera_configs"]

except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    # Fallback to avoid immediate crash, but app won't work well
    sys.exit(1)

def get_db():
    return db