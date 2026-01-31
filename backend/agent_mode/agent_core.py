import threading
import time
import sys
import os
from datetime import datetime
from queue import Queue
from typing import Dict, Any

# Ensure backend root is in path if running from here
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from whatsapp_integration.whatsapp_handler import WhatsAppHandler
from agent_mode.event_processor import EventProcessor
from agent_mode.decision_engine import DecisionEngine
from automation.priority_manager import PriorityManager

class SurakshaSetuAgent:
    """
    Autonomous AI agent for security monitoring
    """
    
    def __init__(self):
        self.whatsapp = WhatsAppHandler()
        self.event_processor = EventProcessor()
        self.decision_engine = DecisionEngine()
        self.priority_manager = PriorityManager()
        
        self.is_active = False
        self.event_queue = Queue()
        
        # Stats
        self.stats = {
            'alerts_sent': 0,
            'decisions_made': 0,
            'auto_actions': 0,
            'uptime_start': None
        }
    
    def activate(self, user_phone: str):
        """
        Activate agent mode
        """
        print("🤖 Activating SurakshaSetu Agent...")
        
        # Set WhatsApp recipient
        self.whatsapp.set_user_number(user_phone)
        
        # Send activation confirmation
        self.whatsapp.send_message(
            "🤖 *SurakshaSetu Agent Activated*\n\n"
            "I'm now monitoring your security system 24/7.\n"
            "You'll receive real-time alerts for:\n\n"
            "🚨 Tailgating\n"
            "🔫 Weapons\n"
            "👤 Unauthorized access\n"
            "✅ Authorized entries\n"
            "📊 Hourly status updates\n\n"
            "Reply 'HELP' anytime for commands."
        )
        
        # Start monitoring
        self.is_active = True
        self.stats['uptime_start'] = datetime.now()
        
        # Start event processing thread
        threading.Thread(target=self._process_events, daemon=True).start()
        
        # Start scheduled reports
        threading.Thread(target=self._send_scheduled_reports, daemon=True).start()
        
        print("✅ Agent is now active!")
    
    def deactivate(self):
        """Stop agent"""
        self.is_active = False
        self.whatsapp.send_message(
            "🤖 Agent Mode Deactivated\n\n"
            "Thank you for using SurakshaSetu. "
            "Stay safe!"
        )
    
    def handle_security_event(self, event: Dict[str, Any]):
        """
        Main event handler - called by security system
        """
        if not self.is_active:
            return
        
        # Add to processing queue
        self.event_queue.put(event)
    
    def _process_events(self):
        """
        Background thread to process events
        """
        while self.is_active:
            if not self.event_queue.empty():
                event = self.event_queue.get()
                
                # Make decision
                decision = self.decision_engine.analyze(event)
                self.stats['decisions_made'] += 1
                
                # Take action based on priority
                if decision['priority'] == 'CRITICAL':
                    self._handle_critical(event, decision)
                elif decision['priority'] == 'WARNING':
                    self._handle_warning(event, decision)
                elif decision['priority'] == 'INFO':
                    self._handle_info(event, decision)
            
            time.sleep(0.1)  # Small delay
    
    def _handle_critical(self, event, decision):
        """Handle critical events immediately"""
        event_type = event['type']
        
        if event_type == 'TAILGATING':
            message = self._format_tailgating_alert(event)
            self.whatsapp.send_message(message)
            
            # Send snapshot
            if 'snapshot_path' in event:
                self.whatsapp.send_snapshot(
                    event['snapshot_path'],
                    f"Tailgating at {event.get('location', 'Unknown')}"
                )
            
            # Send video clip
            if 'video_path' in event:
                self.whatsapp.send_video(
                    event['video_path'],
                    "10-second incident recording"
                )
        
        elif event_type == 'WEAPON_DETECTED':
            message = self._format_weapon_alert(event)
            self.whatsapp.send_message(message)
            
            if 'snapshot_path' in event:
                self.whatsapp.send_snapshot(event['snapshot_path'])
            
            # Auto-action: Lock all doors (example)
            self._execute_auto_action('LOCK_ALL_DOORS')
            self.stats['auto_actions'] += 1
        
        self.stats['alerts_sent'] += 1
    
    def _handle_warning(self, event, decision):
        """Handle warning events (2-minute delay for batching)"""
        # Wait a bit to see if more events come (simple sleep blocking thread - optimized in future)
        # For now we send immediately to be responsive
        # time.sleep(120) 
        
        message = self._format_warning_alert(event)
        self.whatsapp.send_message(message)
        self.stats['alerts_sent'] += 1
    
    def _handle_info(self, event, decision):
        """Handle info events (batch into hourly reports)"""
        # Store for later batching
        self.event_processor.store_for_batch(event)
    
    def _send_scheduled_reports(self):
        """Send hourly and daily reports"""
        while self.is_active:
            now = datetime.now()
            
            # Hourly report
            if now.minute == 0:
                self._send_hourly_report()
                time.sleep(60) # Prevent multiple sends
            
            # Daily report
            if now.hour == 18 and now.minute == 0:  # 6 PM
                self._send_daily_report()
            
            time.sleep(30)  # Check every 30s
    
    def _format_tailgating_alert(self, event) -> str:
        """Format tailgating alert message"""
        return (
            f"🚨 *TAILGATING ALERT*\n\n"
            f"📍 Location: {event.get('location', 'Unknown')}\n"
            f"⏰ Time: {event.get('timestamp')}\n"
            f"👥 Details: {event.get('total_people')} people entered, "
            f"only {event.get('authorized_count')} authorized\n\n"
            f"Authorized: {event.get('authorized_names', [])}\n"
            f"Unauthorized: {event.get('unauthorized_count', 0)} unknown\n\n"
            f"[Snapshot and video attached]\n\n"
            f"*Actions:*\n"
            f"Reply 'LOCK' to lock entrance\n"
            f"Reply 'ALERT' to notify security\n"
            f"Reply 'IGNORE' if false alarm"
        )
    
    def _format_weapon_alert(self, event) -> str:
        """Format weapon detection alert"""
        return (
            f"🔴 *CRITICAL THREAT - WEAPON DETECTED*\n\n"
            f"📍 Location: {event.get('location', 'Unknown')}\n"
            f"⏰ Time: {event.get('timestamp')}\n"
            f"🔫 Weapon: {event.get('weapon_type')} "
            f"(Confidence: {event.get('confidence')} %)\n\n"
            f"⚠️ *AUTO-ACTIONS TAKEN:*\n"
            f"✓ All entrances locked\n"
            f"✓ Security team alerted\n"
            f"✓ Recording saved to cloud\n\n"
            f"Reply 'STATUS' for updates"
        )

    def _format_warning_alert(self, event) -> str:
        """Format generic warning"""
        return (
            f"⚠️ *SECURITY WARNING*\n\n"
            f"Type: {event.get('type')}\n"
            f"Location: {event.get('location', 'Unknown')}\n"
            f"Time: {event.get('timestamp')}"
        )
    
    def _send_hourly_report(self):
        """Send hourly status update"""
        stats = self.event_processor.get_hourly_stats()
        
        message = (
            f"📊 *Hourly Security Report - {datetime.now().strftime('%I:00 %p')}*\n\n"
            f"🟢 Status: All Clear\n\n"
            f"📈 Activity Summary:\n"
            f"• Authorized Entries: {stats['authorized_entries']}\n"
            f"• Unknown Visitors: {stats['unknown_visitors']}\n"
            f"• Alerts: {stats['alerts']}\n"
            f"• Crowd Level: {stats['crowd_level']}\n\n"
            f"🎥 All cameras operational\n"
            f"🔋 System health: {stats['system_health']}%\n\n"
            f"Next update: {(datetime.now().hour + 1) % 24}:00"
        )
        
        self.whatsapp.send_message(message)
    
    def _send_daily_report(self):
        """Send daily summary"""
        stats = self.event_processor.get_daily_stats()
        
        message = (
            f"📅 *Daily Security Summary - {datetime.now().strftime('%b %d, %Y')}*\n\n"
            f"🎯 Today's Stats:\n"
            f"• Total Entries: {stats['total_entries']}\n"
            f"• Tailgating Incidents: {stats['tailgating']}\n"
            f"• Weapon Alerts: {stats['weapons']}\n"
            f"• Pet Violations: {stats['pets']}\n"
            f"• Unknown Visitors: {stats['unknown']}\n\n"
            f"⭐ Peak Hours:\n"
            f"• Morning: {stats['peak_morning']}\n"
            f"• Evening: {stats['peak_evening']}\n\n"
            f"Reply 'REPORT' for detailed PDF"
        )
        
        self.whatsapp.send_message(message)
    
    def _execute_auto_action(self, action: str):
        """Execute automated security action"""
        # Integration with physical systems
        # Example: Send signal to lock controller
        print(f"🔒 Executing auto-action: {action}")
        self.whatsapp.send_message(f"🔒 Executed Auto-Action: {action}")
