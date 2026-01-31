"""
VISITOR OTP SYSTEM
For "Rare Visitors" - OTP-based entry authorization
"""

import random
import string
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class VisitorStatus(str, Enum):
    PENDING = "PENDING"
    OTP_SENT = "OTP_SENT"
    OTP_VERIFIED = "OTP_VERIFIED"
    ENTRY_ALLOWED = "ENTRY_ALLOWED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


@dataclass
class VisitorSession:
    """Represents an active visitor authorization session"""
    visitor_id: int
    visitor_name: str
    resident_id: int
    resident_phone: str
    otp_code: str
    status: VisitorStatus
    created_at: datetime
    otp_sent_at: Optional[datetime] = None
    otp_verified_at: Optional[datetime] = None
    entry_time: Optional[datetime] = None
    expiry_time: datetime = None
    max_attempts: int = 3
    attempts_made: int = 0
    notes: str = ""
    
    def __post_init__(self):
        if self.expiry_time is None:
            self.expiry_time = self.created_at + timedelta(minutes=15)


class OTPGenerator:
    """Generate and manage OTPs"""
    
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """
        Generate a random OTP.
        
        Args:
            length: Length of OTP (default 6 digits)
        
        Returns:
            OTP string
        """
        return ''.join(random.choices(string.digits, k=length))
    
    @staticmethod
    def is_valid_otp(otp: str, length: int = 6) -> bool:
        """Validate OTP format"""
        return len(otp) == length and otp.isdigit()


class VisitorOTPSystem:
    """
    Visitor authorization system using OTP.
    Flow:
    1. Visitor arrives -> Request entry
    2. System sends OTP to resident's phone/email
    3. Resident provides OTP to visitor
    4. Visitor enters OTP -> System verifies
    5. If match -> Entry allowed
    """
    
    def __init__(self, otp_validity_minutes: int = 15, max_otp_attempts: int = 3):
        """
        Args:
            otp_validity_minutes: How long OTP is valid
            max_otp_attempts: Max failed attempts before session expires
        """
        self.otp_validity_minutes = otp_validity_minutes
        self.max_otp_attempts = max_otp_attempts
        self.active_sessions = {}  # {visitor_id: VisitorSession}
    
    def initiate_visitor_entry(self,
                             visitor_id: int,
                             visitor_name: str,
                             resident_id: int,
                             resident_phone: str,
                             resident_email: str = None) -> Optional[VisitorSession]:
        """
        Initiate visitor entry request.
        
        Returns:
            VisitorSession object or None if failed
        """
        if visitor_id in self.active_sessions:
            existing_session = self.active_sessions[visitor_id]
            if existing_session.status in [VisitorStatus.OTP_VERIFIED, VisitorStatus.ENTRY_ALLOWED]:
                logger.warning(f"Visitor {visitor_id} already has active session")
                return existing_session
        
        # Generate OTP
        otp_code = OTPGenerator.generate_otp(6)
        
        session = VisitorSession(
            visitor_id=visitor_id,
            visitor_name=visitor_name,
            resident_id=resident_id,
            resident_phone=resident_phone,
            otp_code=otp_code,
            status=VisitorStatus.OTP_SENT,
            created_at=datetime.utcnow(),
            otp_sent_at=datetime.utcnow(),
            max_attempts=self.max_otp_attempts
        )
        
        self.active_sessions[visitor_id] = session
        
        # Send OTP (mocked here)
        self._send_otp(resident_phone, otp_code, visitor_name, resident_email)
        
        logger.info(f"OTP generated for visitor {visitor_name}: {otp_code}")
        
        return session
    
    def verify_otp(self, visitor_id: int, provided_otp: str) -> Dict[str, any]:
        """
        Verify OTP provided by visitor.
        
        Returns:
            {
                "success": bool,
                "message": str,
                "status": VisitorStatus,
                "session": VisitorSession or None
            }
        """
        if visitor_id not in self.active_sessions:
            return {
                "success": False,
                "message": "No active visitor session found",
                "status": VisitorStatus.REJECTED,
                "session": None
            }
        
        session = self.active_sessions[visitor_id]
        
        # Check expiry
        if datetime.utcnow() > session.expiry_time:
            session.status = VisitorStatus.EXPIRED
            return {
                "success": False,
                "message": "OTP has expired",
                "status": VisitorStatus.EXPIRED,
                "session": session
            }
        
        # Check attempts
        if session.attempts_made >= session.max_attempts:
            session.status = VisitorStatus.REJECTED
            return {
                "success": False,
                "message": f"Maximum OTP attempts ({session.max_attempts}) exceeded",
                "status": VisitorStatus.REJECTED,
                "session": session
            }
        
        # Verify OTP
        session.attempts_made += 1
        
        if provided_otp == session.otp_code:
            session.status = VisitorStatus.OTP_VERIFIED
            session.otp_verified_at = datetime.utcnow()
            session.status = VisitorStatus.ENTRY_ALLOWED
            
            logger.info(f"Visitor {session.visitor_name} OTP verified successfully")
            
            return {
                "success": True,
                "message": "OTP verified. Entry authorized.",
                "status": VisitorStatus.ENTRY_ALLOWED,
                "session": session
            }
        else:
            remaining_attempts = session.max_attempts - session.attempts_made
            
            return {
                "success": False,
                "message": f"Invalid OTP. {remaining_attempts} attempts remaining.",
                "status": session.status,
                "session": session
            }
    
    def record_entry(self, visitor_id: int) -> bool:
        """Record that visitor has entered the building"""
        if visitor_id not in self.active_sessions:
            return False
        
        session = self.active_sessions[visitor_id]
        session.entry_time = datetime.utcnow()
        logger.info(f"Visitor {session.visitor_name} entry recorded at {session.entry_time}")
        
        return True
    
    def close_session(self, visitor_id: int):
        """Close visitor session"""
        if visitor_id in self.active_sessions:
            del self.active_sessions[visitor_id]
    
    def get_session(self, visitor_id: int) -> Optional[VisitorSession]:
        """Get active session for visitor"""
        return self.active_sessions.get(visitor_id)
    
    def get_active_sessions(self) -> Dict[int, VisitorSession]:
        """Get all active sessions"""
        # Clean up expired sessions
        expired = [v_id for v_id, session in self.active_sessions.items()
                  if datetime.utcnow() > session.expiry_time]
        for v_id in expired:
            self.active_sessions[v_id].status = VisitorStatus.EXPIRED
        
        return self.active_sessions
    
    def _send_otp(self, phone: str, otp: str, visitor_name: str, email: str = None):
        """
        Send OTP to resident via SMS/Email.
        
        Note: In production, integrate with Twilio (SMS) or SES (Email)
        For hackathon: Mock implementation
        """
        try:
            message = (
                f"[SurakshaSetu] Visitor {visitor_name} is at your door. "
                f"Share this OTP with them: {otp} (Valid for 15 min)"
            )
            
            # Mock SMS/Email sending
            logger.info(f"[OTP SENT TO {phone}] {message}")
            
            if email:
                logger.info(f"[OTP EMAIL TO {email}] {message}")
            
            # In production:
            # from twilio.rest import Client
            # client = Client(account_sid, auth_token)
            # client.messages.create(to=phone, from_="+1234567890", body=message)
            
        except Exception as e:
            logger.error(f"Failed to send OTP: {e}")


class RFIDAuthenticator:
    """
    RFID-based authentication for residents.
    Simulates RFID card/tag scanning.
    """
    
    def __init__(self):
        self.enrolled_rfids = {}  # {rfid_tag: resident_id}
        self.scan_log = []
    
    def enroll_rfid(self, resident_id: int, rfid_tag: str):
        """Enroll an RFID tag for a resident"""
        self.enrolled_rfids[rfid_tag] = resident_id
        logger.info(f"RFID {rfid_tag} enrolled for resident {resident_id}")
    
    def authenticate(self, rfid_tag: str) -> Optional[int]:
        """
        Authenticate using RFID.
        
        Returns:
            resident_id if match, None otherwise
        """
        resident_id = self.enrolled_rfids.get(rfid_tag)
        
        self.scan_log.append({
            "rfid_tag": rfid_tag,
            "timestamp": datetime.utcnow(),
            "authenticated": resident_id is not None,
            "resident_id": resident_id
        })
        
        return resident_id
    
    def get_scan_history(self, rfid_tag: str = None) -> list:
        """Get RFID scan history"""
        if rfid_tag:
            return [log for log in self.scan_log if log["rfid_tag"] == rfid_tag]
        return self.scan_log


# Global instances
otp_system = VisitorOTPSystem()
rfid_auth = RFIDAuthenticator()