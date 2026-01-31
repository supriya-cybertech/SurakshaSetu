import streamlit as st
import qrcode
from io import BytesIO
import time
import sys
import os
from datetime import datetime

# Adjust path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from whatsapp_integration.whatsapp_handler import WhatsAppHandler
from agent_mode.agent_core import SurakshaSetuAgent

def show_activation_page():
    """
    Streamlit page for activating agent mode
    """
    st.set_page_config(page_title="SurakshaSetu Agent", page_icon="🤖")
    
    st.title("🤖 Activate SurakshaSetu Agent Mode")
    
    # Initialize session state
    if 'agent' not in st.session_state:
        st.session_state.agent = SurakshaSetuAgent()
    
    if 'whatsapp' not in st.session_state:
        st.session_state.whatsapp = WhatsAppHandler()
    
    if 'agent_active' not in st.session_state:
        st.session_state.agent_active = False
    
    # Status
    if not st.session_state.agent_active:
        st.info("📱 Scan the QR code below with WhatsApp to activate Agent Mode")
        
        # User phone number input
        phone = st.text_input(
            "Your WhatsApp Number",
            placeholder="919876543210",
            help="Include country code (e.g., 91 for India)"
        )
        
        if st.button("Generate QR Code", type="primary"):
            if phone:
                # Check if already connected first
                if st.session_state.whatsapp.is_ready():
                    st.success("✅ WhatsApp is already connected! Activating...")
                    st.session_state.agent.activate(phone)
                    st.session_state.agent_active = True
                    time.sleep(1)
                    st.rerun()
                
                # Get QR code from bridge
                qr_data = st.session_state.whatsapp.get_qr_code()
                
                if qr_data:
                    # Display QR code
                    qr_img = qrcode.make(qr_data)
                    
                    # Convert to bytes for Streamlit
                    buf = BytesIO()
                    qr_img.save(buf, format='PNG')
                    
                    st.image(buf.getvalue(), caption="Scan with WhatsApp", width=300)
                    
                    # Check connection status
                    with st.spinner("Waiting for WhatsApp connection..."):
                        # Poll for success
                        for _ in range(30):  # Wait up to 30 seconds
                            if st.session_state.whatsapp.is_ready():
                                st.success("✅ WhatsApp Connected!")
                                
                                # Activate agent
                                st.session_state.agent.activate(phone)
                                st.session_state.agent_active = True
                                
                                st.balloons()
                                time.sleep(2)
                                st.rerun()
                                break
                            
                            time.sleep(1)
                else:
                    st.error("Failed to generate QR code. Make sure WhatsApp bridge is running (npm start).")
            else:
                st.warning("Please enter your WhatsApp number")
    
    else:
        # Agent is active
        st.success("🟢 Agent Mode is ACTIVE")
        
        # Show agent dashboard
        show_agent_dashboard()
        
        # Deactivate button
        if st.button("Deactivate Agent", type="secondary"):
            st.session_state.agent.deactivate()
            st.session_state.agent_active = False
            st.rerun()

def show_agent_dashboard():
    """Show live agent status"""
    
    agent = st.session_state.agent
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Alerts Sent", agent.stats['alerts_sent'])
    
    with col2:
        st.metric("Decisions Made", agent.stats['decisions_made'])
    
    with col3:
        st.metric("Auto-Actions", agent.stats['auto_actions'])
    
    with col4:
        if agent.stats['uptime_start']:
            uptime = datetime.now() - agent.stats['uptime_start']
            hours = int(uptime.total_seconds() // 3600)
            mins = int((uptime.total_seconds() % 3600) // 60)
            st.metric("Uptime", f"{hours}h {mins}m")
        else:
             st.metric("Uptime", "0h 0m")
    
    # Live conversation log
    st.subheader("📱 Live WhatsApp Conversation")
    
    # This would be populated from actual conversation history
    st.text_area(
        "Recent Messages",
        value=(
            "🤖 [System] Agent initialized.\n"
            "🤖 [System] Connected to camera feeds.\n"
        ),
        height=200,
        disabled=True
    )

if __name__ == "__main__":
    show_activation_page()
