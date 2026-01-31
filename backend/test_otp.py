#!/usr/bin/env python
from SECURITY.visitor_otp_system import otp_system, rfid_auth, VisitorStatus
from datetime import datetime, timedelta

print("\n" + "="*60)
print("🧪 VISITOR OTP SYSTEM TEST")
print("="*60 + "\n")

# Test 1: OTP Generation
print("Test 1: OTP Generation")
print("-" * 60)

# Generate OTP for visitor
visitor_id = 1  # Changed to int as per system expectation
otp_system.initiate_visitor_entry(visitor_id, "John Doe", 101, "9999999999")
session = otp_system.get_session(visitor_id)
otp_code = session.otp_code

print(f"✅ Generated OTP for {visitor_id}: {otp_code}")

# Test OTP verification
result = otp_system.verify_otp(visitor_id, otp_code)
print(f"✅ OTP verification: {'Valid' if result['success'] else 'Invalid'}")
assert result['success'] == True

# Test expired OTP
print("ℹ️  Forcing session expiry for test...")
session.expiry_time = datetime.utcnow() - timedelta(seconds=1)

result_expired = otp_system.verify_otp(visitor_id, otp_code)
print(f"ℹ️  OTP after expiry check: {'Still valid' if result_expired['success'] else 'Expired (as expected)'}")
assert result_expired['success'] == False, "OTP should be expired"

# Test 2: Visitor Status Management
print("\nTest 2: Visitor Status Management")
print("-" * 60)

# Reuse session status
print(f"✅ Current visitor status: {session.status}")
assert session.status == VisitorStatus.EXPIRED

# Test 3: RFID Authentication (Mock)
print("\nTest 3: RFID Authentication")
print("-" * 60)

# Mock RFID tag
rfid_tag = "RFID_123456"
rfid_auth.enroll_rfid(101, rfid_tag) # Need to enroll first
resident_id = rfid_auth.authenticate(rfid_tag)
print(f"✅ RFID authentication for {rfid_tag}: {'Authorized' if resident_id else 'Not authorized'}")
assert resident_id == 101

# Test invalid RFID
invalid_rfid = "INVALID_RFID"
resident_id_invalid = rfid_auth.authenticate(invalid_rfid)
print(f"✅ Invalid RFID {invalid_rfid}: {'Authorized' if resident_id_invalid else 'Not authorized (as expected)'}")
assert resident_id_invalid is None

print("\n✅ All OTP system tests completed successfully!\n")
print("="*60 + "\n")