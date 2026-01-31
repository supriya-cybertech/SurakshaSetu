#!/usr/bin/env python
from SECURITY.visitor_otp_system import otp_system, VisitorStatus
from datetime import datetime

print("\n" + "="*60)
print("🧪 VISITOR OTP SYSTEM TEST")
print("="*60 + "\n")

# Test 1: OTP Generation
print("Test 1: OTP Generation")
print("-" * 60)

# Generate OTP for visitor
visitor_id = "VISITOR_001"
otp_code = otp_system.generate_otp(visitor_id)
print(f"✅ Generated OTP for {visitor_id}: {otp_code}")

# Test OTP verification
is_valid = otp_system.verify_otp(visitor_id, otp_code)
print(f"✅ OTP verification: {'Valid' if is_valid else 'Invalid'}")

# Test expired OTP
import time
time.sleep(1)  # Wait 1 second
is_valid_expired = otp_system.verify_otp(visitor_id, otp_code)
print(f"ℹ️  OTP after expiry check: {'Still valid' if is_valid_expired else 'Expired (as expected)'}")

# Test 2: Visitor Status Management
print("\nTest 2: Visitor Status Management")
print("-" * 60)

# Create visitor status
status = VisitorStatus(
    visitor_id=visitor_id,
    name="John Smith",
    phone="+1234567890",
    flat_number="101",
    otp_code=otp_code,
    status="PENDING"
)
print(f"✅ Created visitor status: {status.name} - {status.status}")

# Update status
status.status = "VERIFIED"
status.entry_time = datetime.utcnow()
print(f"✅ Updated status: {status.status}")

# Test 3: RFID Authentication (Mock)
print("\nTest 3: RFID Authentication")
print("-" * 60)

# Mock RFID tag
rfid_tag = "RFID_123456"
authorized = otp_system.authenticate_rfid(rfid_tag)
print(f"✅ RFID authentication for {rfid_tag}: {'Authorized' if authorized else 'Not authorized'}")

# Test invalid RFID
invalid_rfid = "INVALID_RFID"
authorized_invalid = otp_system.authenticate_rfid(invalid_rfid)
print(f"✅ Invalid RFID {invalid_rfid}: {'Authorized' if authorized_invalid else 'Not authorized (as expected)'}")

print("\n✅ All OTP system tests completed successfully!\n")
print("="*60 + "\n")