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
    
    def send_message(self, message: str) -> bool:
        """Send text message"""
        if not self.user_number:
            print("Error: User number not set")
            return False
            
        try:
            response = requests.post(
                f'{self.bridge_url}/send',
                json={'number': self.user_number, 'message': message}
            )
            return response.json().get('success', False)
        except Exception as e:
            print(f"Error sending message: {e}")
            return False
    
    def send_snapshot(self, image_path: str, caption: str = '') -> bool:
        """Send image with caption"""
        if not self.user_number:
            print("Error: User number not set")
            return False
            
        try:
            # Check if file exists to avoid bridge errors
            import os
            if not os.path.exists(image_path):
                print(f"Error: Snapshot file not found at {image_path}")
                return False

            # Convert to absolute path if needed, bridge usually handles it but better safe
            abs_path = os.path.abspath(image_path)
            
            response = requests.post(
                f'{self.bridge_url}/send-media',
                json={
                    'number': self.user_number,
                    'mediaPath': abs_path,
                    'caption': caption
                }
            )
            return response.json().get('success', False)
        except Exception as e:
            print(f"Error sending snapshot: {e}")
            return False
    
    def send_video(self, video_path: str, caption: str = '') -> bool:
        """Send video with caption"""
        return self.send_snapshot(video_path, caption)  # Same API for media
    
    def set_user_number(self, number: str):
        """Set recipient phone number"""
        self.user_number = number
