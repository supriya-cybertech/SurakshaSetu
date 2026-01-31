from typing import Dict

class DecisionEngine:
    """
    AI decision making for event handling
    """
    
    def analyze(self, event: Dict) -> Dict:
        """
        Analyze event and determine action
        
        Returns decision with:
        - priority: CRITICAL, WARNING, INFO
        - action: What to do
        - delay: How long to wait before acting
        """
        
        event_type = event.get('type')
        
        # CRITICAL events
        if event_type in ['TAILGATING', 'WEAPON_DETECTED', 'FORCED_ENTRY']:
            return {
                'priority': 'CRITICAL',
                'action': 'IMMEDIATE_ALERT',
                'delay': 0,
                'auto_actions': self._get_auto_actions(event_type)
            }
        
        # WARNING events
        elif event_type in ['UNKNOWN_PERSON', 'PET_VIOLATION', 'LOITERING']:
            return {
                'priority': 'WARNING',
                'action': 'DELAYED_ALERT',
                'delay': 120,  # 2 minutes
                'auto_actions': []
            }
        
        # INFO events
        elif event_type in ['AUTHORIZED_ENTRY', 'NORMAL_VISITOR']:
            return {
                'priority': 'INFO',
                'action': 'BATCH',
                'delay': 3600,  # 1 hour (batch into report)
                'auto_actions': []
            }
        
        # Unknown event type
        else:
            return {
                'priority': 'INFO',
                'action': 'LOG_ONLY',
                'delay': -1,
                'auto_actions': []
            }
    
    def _get_auto_actions(self, event_type: str) -> list:
        """Define automated responses"""
        actions = {
            'WEAPON_DETECTED': ['LOCK_ALL_DOORS', 'NOTIFY_POLICE', 'START_RECORDING'],
            'TAILGATING': ['SOUND_ALARM', 'LOCK_DOOR', 'RECORD_VIDEO'],
            'FORCED_ENTRY': ['LOCK_ALL_DOORS', 'NOTIFY_POLICE', 'MAX_ALERT']
        }
        
        return actions.get(event_type, [])
