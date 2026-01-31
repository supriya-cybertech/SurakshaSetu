import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./surakshasetu.db")

# Camera Settings
CAMERA_CONFIG = {
    1: {"name": "Entry Gate", "stream_url": "http://192.168.0.190:8080/video", "active": True},
    2: {"name": "Lobby", "stream_url": "http://192.0.0.2:8080/video", "active": True},
    3: {"name": "Stairwell", "stream_url": "http://192.168.0.122:8080/video", "active": True},
    4: {"name": "Parking", "stream_url": "http://192.168.0.116:8080/video", "active": True},
    0: {"name": "Webcam", "stream_url": 0, "active": True}
}

# Detection Settings
TAILGATING_CONFIG = {
    "tripwire_y": 300,
    "time_window": 3.0,
    "distance_threshold": 50
}

OTP_CONFIG = {
    "length": 6,
    "validity_minutes": 15,
    "max_attempts": 3
}

AI_CONFIG = {
    "face_model": "Facenet",
    "confidence_threshold": 0.6,
    "object_detection_model": "yolov8m",
    "object_confidence": 0.5
}

INCIDENT_CONFIG = {
    "snapshot_quality": 80,
    "snapshot_dir": BASE_DIR / "incidents"
}

FEATURES = {
    "siren_enabled": True,
    "record_snapshots": True,
    "data_privacy_mode": True
}