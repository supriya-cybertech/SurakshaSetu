from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, LargeBinary, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Resident(Base):
    __tablename__ = "residents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    flat_number = Column(String)
    height_cm = Column(Float)
    phone_number = Column(String)
    face_embedding = Column(LargeBinary) # Pickled numpy array
    embedding_version = Column(String, default="1.0")
    is_active = Column(Boolean, default=True)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone_number = Column(String)
    resident_id = Column(Integer, ForeignKey("residents.id"))
    visit_date = Column(DateTime, default=datetime.utcnow)
    otp_code = Column(String, nullable=True)
    otp_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    entry_time = Column(DateTime, nullable=True)

    resident = relationship("Resident")

class IncidentLog(Base):
    __tablename__ = "incident_logs"

    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String)
    severity = Column(String) # HIGH, MEDIUM, LOW
    timestamp = Column(DateTime, default=datetime.utcnow)
    camera_id = Column(Integer)
    detected_persons = Column(Integer, default=0)
    authorized_persons = Column(Integer, default=0)
    person_ids = Column(String, nullable=True)
    additional_details = Column(String, nullable=True)
    resolved = Column(Boolean, default=False)
    snapshot_path = Column(String, nullable=True)

class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(Integer, ForeignKey("visitors.id"), nullable=True)
    resident_id = Column(Integer, ForeignKey("residents.id"), nullable=True)
    access_type = Column(String) # OTP, RFID, FACE
    camera_id = Column(Integer)
    confidence_score = Column(Float, default=1.0)
    authorized = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CameraConfig(Base):
    __tablename__ = "camera_configs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, unique=True)
    name = Column(String)
    url = Column(String) # RTSP URL or "0"
    enabled = Column(Boolean, default=True)
