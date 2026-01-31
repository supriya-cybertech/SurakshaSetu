#!/usr/bin/env python
from AI.tailgating_logic import CentroidTracker, TailgatingDetector
from datetime import datetime

print("\n" + "="*60)
print("🧪 TAILGATING DETECTION TEST")
print("="*60 + "\n")

# Test 1: Centroid Tracker
print("Test 1: Centroid Tracker")
print("-" * 60)
tracker = CentroidTracker()

# Frame 1
detections = [(100, 100, 150, 200), (300, 150, 350, 250)]
objects = tracker.update(detections)
print(f"✅ Frame 1: Tracked {len(objects)} persons with IDs {list(objects.keys())}")

# Frame 2
detections = [(105, 105, 155, 205), (305, 155, 355, 255)]
objects = tracker.update(detections)
print(f"✅ Frame 2: Tracked {len(objects)} persons with IDs {list(objects.keys())}\n")

# Test 2: Tailgating Detector
print("Test 2: Tailgating Detector")
print("-" * 60)

alerts_received = []

def alert_callback(alert):
    alerts_received.append(alert)
    print(f"🚨 ALERT: {alert.incident_type} - Severity: {alert.severity}")

detector = TailgatingDetector(tripwire_y=300, alert_callback=alert_callback)

# Authorize person
detector.mark_authorization(person_id=0)
print("✅ Person 0 authorized")

# Simulate crossing
detections = [
    (100, 250, 150, 350),  # Person 0 crossing
    (300, 250, 350, 350),  # Person 1 crossing (unauthorized)
]
alert = detector.update(detections, authorized_ids=[0], camera_id=3)

if alert:
    print("✅ Alert generated!")
    print(f"   Severity: {alert.severity}")
    print(f"   Detected: {alert.persons_detected}, Authorized: {alert.persons_authorized}\n")
    assert alert.severity == "MEDIUM" or alert.severity == "HIGH"
else:
    print("ℹ️  No alert (test conditions)\n")
    # In this specific test setup (simulating crossing), we EXPECT an alert
    assert False, "Expected an alert but none was generated"

print("✅ Test completed successfully!\n")
print("="*60 + "\n")