import time
import sys
import os
from datetime import datetime

# Setup path to import backend modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from agent_mode.agent_core import SurakshaSetuAgent

def run_simulation():
    print("===================================================")
    print("       🤖 SurakshaSetu Agent Simulation 🤖       ")
    print("===================================================")
    print("This script will simulate security events to test")
    print("WhatsApp alerts without needing physical triggers.")
    print("---------------------------------------------------")
    
    # Initialize Agent
    print("\n[1/4] Initializing Agent Core...")
    agent = SurakshaSetuAgent()
    
    # Get Phone Number
    print("\nPlease enter the WhatsApp number to receive alerts.")
    print("Format: CountryCode + Number (e.g., 919876543210)")
    phone = input("Enter Number: ").strip()
    
    if not phone:
        print("❌ Phone number is required!")
        return

    # Activate Agent
    print("\n[2/4] Activating Agent...")
    try:
        agent.activate(phone)
        print("✅ Agent Activated! You should receive a welcome message on WhatsApp.")
        time.sleep(2)
    except Exception as e:
        print(f"❌ Failed to activate agent: {e}")
        print("Make sure the WhatsApp Bridge is running (npm start)!")
        return

    # Simulate Tailgating
    print("\n[3/4] Simulating TAILGATING Event (CRITICAL)...")
    print("Sending alert in 2 seconds...")
    time.sleep(2)
    
    tailgating_event = {
        "type": "TAILGATING",
        "timestamp": datetime.now().isoformat(),
        "location": "Main Entrance - Camera 1",
        "total_people": 2,
        "authorized_count": 1,
        "unauthorized_count": 1,
        "persons_detected": 2,
        "persons_authorized": 1,
        "persons_unauthorized": 1,
        "authorized_names": ["Amit Kumar"],
        "severity": "HIGH",
        # We don't have a real snapshot, so we'll skip the image part or use a dummy if we had one
        # "snapshot_path": "path/to/dummy.jpg" 
    }
    
    agent.handle_security_event(tailgating_event)
    print("✅ Tailgating Alert Sent! Check your WhatsApp.")

    # Simulate Weapon Detection
    print("\n[4/4] Simulating WEAPON DETECTED Event (CRITICAL)...")
    print("Sending alert in 3 seconds...")
    time.sleep(3)
    
    weapon_event = {
        "type": "WEAPON_DETECTED",
        "timestamp": datetime.now().isoformat(),
        "location": "Lobby Area - Camera 3",
        "weapon_type": "Handgun",
        "confidence": 98,
        "severity": "HIGH"
    }
    
    agent.handle_security_event(weapon_event)
    print("✅ Weapon Alert Sent! Check your WhatsApp.")
    
    # Simulate Authorized Entry (Info)
    print("\n[Bonus] Simulating Authorized Entry (Info Level)...")
    entry_event = {
        "type": "AUTHORIZED_ENTRY",
        "timestamp": datetime.now().isoformat(),
        "location": "Main Entrance",
        "person_count": 1,
        "method": "RFID"
    }
    agent.handle_security_event(entry_event)
    print("✅ Event logged internally (Will be in Hourly Report).")
    
    print("\n===================================================")
    print("   🎉 Simulation Complete! Verify alerts on phone  ")
    print("===================================================")

if __name__ == "__main__":
    run_simulation()
