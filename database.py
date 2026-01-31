from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, LargeBinary, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

DATABASE_URL = "sqlite:///./surakshasetu.db"
# For Production: DATABASE_URL = "postgresql://user:password@localhost/surakshasetu"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Resident(Base):
    __tablename__ = "residents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    flat_number = Column(String, unique=True, index=True)
    height_cm = Column(Float)
    phone_number = Column(String)
    face_embedding = Column(LargeBinary)  # Serialized NumPy array
    embedding_version = Column(String, default="1.0")
    rfid_tag = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    embedding_version = Column(String, default="1.0")
    rfid_tag = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Visitor(Base):
    __tablename__ = "visitors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone_number = Column(String)
    resident_id = Column(Integer, index=True)
    visit_date = Column(DateTime, default=datetime.utcnow)
    otp_code = Column(String, nullable=True)
    otp_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    entry_time = Column(DateTime, nullable=True)


class IncidentLog(Base):
    __tablename__ = "incident_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String)  # "TAILGATING", "UNAUTHORIZED_ENTRY", "WEAPON_DETECTED", etc.
    severity = Column(String, default="MEDIUM")  # "LOW", "MEDIUM", "HIGH"
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    camera_id = Column(Integer)
    frame_snapshot = Column(LargeBinary, nullable=True)  # Encoded image
    detected_persons = Column(Integer)  # How many people detected
    authorized_persons = Column(Integer)  # How many were authorized
    person_ids = Column(String, nullable=True)  # Comma-separated IDs or "UNKNOWN"
    weapon_detected = Column(Boolean, default=False)
    weapon_type = Column(String, nullable=True)
    additional_details = Column(String, nullable=True)
    resolved = Column(Boolean, default=False)


class AccessLog(Base):
    __tablename__ = "access_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    resident_id = Column(Integer, index=True)
    visitor_id = Column(Integer, nullable=True, index=True)
    access_type = Column(String)  # "FACE_RECOGNITION", "RFID", "OTP", "MANUAL"
    timestamp = Column(DateTime, default=datetime.utcnow)
    camera_id = Column(Integer)
    confidence_score = Column(Float)
    authorized = Column(Boolean)


class CameraConfig(Base):
    __tablename__ = "camera_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, unique=True, index=True)
    camera_name = Column(String)
    stream_url = Column(String)
    location = Column(String)
    is_active = Column(Boolean, default=True)
    last_heartbeat = Column(DateTime)


# Create tables
Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency injection for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()