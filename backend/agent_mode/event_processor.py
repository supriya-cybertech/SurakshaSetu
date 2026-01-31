from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List

class EventProcessor:
    """
    Process and categorize security events
    """
    
    def __init__(self):
        self.hourly_events = []
        self.daily_events = []
        self.batch_queue = []
    
    def store_for_batch(self, event: Dict):
        """Store low-priority event for batching"""
        self.batch_queue.append(event)
        self.hourly_events.append(event)
        self.daily_events.append(event)
    
    def get_hourly_stats(self) -> Dict:
        """Calculate hourly statistics"""
        now = datetime.now()
        hour_ago = now - timedelta(hours=1)
        
        # Filter events from last hour
        try:
            recent_events = [
                e for e in self.hourly_events
                if datetime.fromisoformat(e['timestamp']) > hour_ago
            ]
        except Exception:
            # Fallback if timestamp parsing fails
            recent_events = self.hourly_events
        
        stats = {
            'authorized_entries': len([e for e in recent_events if e.get('type') == 'AUTHORIZED_ENTRY']),
            'unknown_visitors': len([e for e in recent_events if e.get('type') == 'UNKNOWN_PERSON']),
            'alerts': len([e for e in recent_events if e.get('priority') in ['CRITICAL', 'WARNING']]),
            'crowd_level': self._calculate_crowd_level(recent_events),
            'system_health': 98  # Could be calculated from system metrics
        }
        
        # Clear hourly events (optional, or keep rolling window)
        # For this implementation we clear to avoid duplicates in next report
        self.hourly_events = []
        
        return stats
    
    def get_daily_stats(self) -> Dict:
        """Calculate daily statistics"""
        stats = {
            'total_entries': len([e for e in self.daily_events if 'ENTRY' in e.get('type', '')]),
            'tailgating': len([e for e in self.daily_events if e.get('type') == 'TAILGATING']),
            'weapons': len([e for e in self.daily_events if e.get('type') == 'WEAPON_DETECTED']),
            'pets': len([e for e in self.daily_events if e.get('type') == 'PET_VIOLATION']),
            'unknown': len([e for e in self.daily_events if e.get('type') == 'UNKNOWN_PERSON']),
            'peak_morning': self._get_peak_hour(6, 12),
            'peak_evening': self._get_peak_hour(17, 23)
        }
        
        # Clear daily events
        self.daily_events = []
        
        return stats
    
    def _calculate_crowd_level(self, events: List[Dict]) -> str:
        """Determine crowd density"""
        if not events:
            return "Low"
            
        person_counts = [e.get('person_count', 0) for e in events]
        if not person_counts:
            return "Low"
            
        avg_count = sum(person_counts) / len(person_counts)
        
        if avg_count >= 10:
            return "High"
        elif avg_count >= 5:
            return "Medium"
        else:
            return "Low"
    
    def _get_peak_hour(self, start_hour: int, end_hour: int) -> str:
        """Find peak activity hour in time range"""
        hour_counts = defaultdict(int)
        
        for event in self.daily_events:
            try:
                hour = datetime.fromisoformat(event['timestamp']).hour
                if start_hour <= hour < end_hour:
                    hour_counts[hour] += 1
            except:
                continue
        
        if hour_counts:
            peak_hour = max(hour_counts, key=hour_counts.get)
            peak_count = hour_counts[peak_hour]
            return f"{peak_hour}:00 ({peak_count} entries)"
        else:
            return "N/A"
