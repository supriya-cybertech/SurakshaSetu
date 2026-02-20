import requests
from typing import Optional

class WhatsAppHandler:
    """
    Python interface to Node.js WhatsApp bridge
    """
    
    def __init__(self, bridge_url='http://localhost:3000'):
        self.bridge_url = bridge_url
        self.user_number = None
        
    def get_qr_code(self) -> Optional[str]:
        """Get QR code for scanning"""
        try:
            response = requests.get(f'{self.bridge_url}/qr')
            data = response.json()
            return data.get('qr')
        except Exception as e:
            print(f"Error getting QR: {e}")
            return None
    
    def is_ready(self) -> bool:
        """Check if WhatsApp is connected"""
        try:
            response = requests.get(f'{self.bridge_url}/qr')
            return response.json().get('ready', False)
        except:
            return False
    
    def send_message(self, message: str, number: Optional[str] = None) -> bool:
        """Send text message. If number is provided, it overrides self.user_number"""
        target = number or self.user_number
        if not target:
            print("Error: Recipient number not set")
            return False
            
        try:
            response = requests.post(
                f'{self.bridge_url}/send',
                json={'number': target, 'message': message}
            )
            return response.json().get('success', False)
        except Exception as e:
            print(f"Error sending message to {target}: {e}")
            return False
    
    def send_snapshot(self, image_path: str, caption: str = '', number: Optional[str] = None) -> bool:
        """Send image with caption. If number is provided, it overrides self.user_number"""
        target = number or self.user_number
        if not target:
            print("Error: Recipient number not set")
            return False
            
        try:
            import os
            if not os.path.exists(image_path):
                print(f"Error: Snapshot file not found at {image_path}")
                return False

            abs_path = os.path.abspath(image_path)
            
            response = requests.post(
                f'{self.bridge_url}/send-media',
                json={
                    'number': target,
                    'mediaPath': abs_path,
                    'caption': caption
                }
            )
            return response.json().get('success', False)
        except Exception as e:
            print(f"Error sending snapshot to {target}: {e}")
            return False

    def broadcast_message(self, numbers: list, message: str):
        """Send message to multiple recipients"""
        results = {}
        for num in numbers:
            success = self.send_message(message, number=num)
            results[num] = success
        return results

    def broadcast_snapshot(self, numbers: list, image_path: str, caption: str = ''):
        """Send snapshot to multiple recipients"""
        results = {}
        for num in numbers:
            success = self.send_snapshot(image_path, caption, number=num)
            results[num] = success
        return results

    def set_user_number(self, number: str):
        """Set default recipient phone number"""
        self.user_number = number
