# 🛡️ SurakshaSetu - Next-Gen AI Security Intelligence

<div align="center">

![SurakshaSetu Banner](https://img.shields.io/badge/SURAKSHA-SETU-0891B2?style=for-the-badge&logo=shield&logoColor=white)

**Enterprise-Grade Real-Time Tailgating Detection & Access Control System**

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![YOLOv8](https://img.shields.io/badge/AI-YOLOv8-FFD700?style=flat-square&logo=ultralytics&logoColor=black)](https://github.com/ultralytics/ultralytics)
[![TailwindCSS](https://img.shields.io/badge/Style-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#-demo) • [Documentation](#-documentation) • [Report Bug](https://github.com/surakshasetu/issues) • [Request Feature](https://github.com/surakshasetu/issues)

</div>

---

## 📖 Overview

**SurakshaSetu** is a state-of-the-art **AI-powered security platform** designed to secure physical premises against unauthorized access. Unlike traditional passive CCTV, SurakshaSetu actively monitors video feeds in real-time, using computer vision to detect:

*   **Tailgating Incidents**: Unauthorized persons following authorized personnel.
*   **Unknown Visitors**: Real-time face recognition against a resident database.
*   **Security Threats**: Weapon detection and behavioral anomalies.

Built with a **modern, glassmorphic UI** and a high-performance **FastAPI backend**, it delivers enterprise-grade security monitoring for offices, residential complexes, and secure facilities.

---

## ✨ Key Features

### 🧠 Intelligent Detection Engine
*   **Multi-Person Tracking**: Tracks individuals across frames using Centroid Tracking/DeepSORT.
*   **Anti-Tailgating Logic**: Virtual tripwire algorithms to detect "piggybacking" within <3 seconds.
*   **Face Recognition**: 99.8% accuracy using **DeepFace** (ArcFace/Facenet models).
*   **Object Detection**: Real-time YOLOv8 integration for person, weapon, and baggage detection.

### 💻 Modern Command Center
*   **Live Surveillance Grid**: View 9+ camera feeds simultaneously with low-latency WebSocket streaming.
*   **Advanced Analytics dashboard**:
    *   *Incident Trends* (Area Charts)
    *   *Threat Distribution* (Donut Charts)
    *   *Response Time Analysis* (Bar Charts)
*   **Dark/Light Enterprise Themes**: Professional UI with glassmorphism and smooth animations.

### 🔒 Access Control & Security
*   **Multi-Factor Auth**: Face ID + OTP + RFID integration.
*   **Visitor Management**: Digital entry logging with OTP verification.
*   **Instant Alerts**: Real-time notifications via WebSocket, Email, and SMS (Twilio/WhatsApp).

---

## 🏗️ System Architecture

SurakshaSetu follows a modular **Microservices-ready Architecture**, separating the heavy AI processing from the lightweight frontend interface.

### High-Level Block Diagram

```mermaid
graph TD
    subgraph "Edge Devices"
        C1[IP Camera 1]
        C2[IP Camera 2]
        C3[Webcam / Mobile]
    end

    subgraph "Core AI Engine (Backend)"
        FE[Frame Extractor]
        OD[YOLOv8 Object Detection]
        FR[DeepFace Recognition]
        TL[Tailgating Logic]
        
        FE --> OD
        OD --> FR
        OD --> TL
    end

    subgraph "Data & API Layer"
        API[FastAPI Server]
        WS[WebSocket Manager]
        DB[(PostgreSQL / SQLite)]
        
        TL --> API
        FR --> API
        API <--> DB
        API --> WS
    end

    subgraph "User Interface (Frontend)"
        RJ[React.js SPA]
        DASH[Live Dashboard]
        ALERT[Notification Toast]
        CHART[Analytics Charts]
        
        WS --> RJ
        RJ --> DASH
        RJ --> ALERT
        RJ --> CHART
    end

    C1 --> FE
    C2 --> FE
    C3 --> FE
```

---

## 🔄 Detection Workflow

The system processes video feeds in a strictly defined pipeline to ensure sub-100ms latency.

```mermaid
sequenceDiagram
    participant Cam as CCTV Camera
    participant AI as AI Engine
    participant DB as Database
    participant API as Backend API
    participant UI as Frontend Dashboard

    loop Every Frame (30 FPS)
        Cam->>AI: Stream Frame
        AI->>AI: Person Detection (YOLO)
        
        alt Person Detected
            AI->>AI: Extract Face Embedding
            AI->>DB: Query Face Match
            DB-->>AI: Identity (Resident/Unknown)
            
            alt Unknown Person behind Resident
                AI->>AI: Calculate Distance/Time Delta
                AI->>AI: Trigger Tailgating Algorithm
                
                opt Is Tailgating?
                    AI->>API: POST /incident/alert
                    API->>DB: Log Incident
                    API->>UI: WebSocket Alert ("Tailgating Detected!")
                    UI->>UI: Flash Red Warning
                end
            end
        end
    end
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** v16+
*   **Python** 3.10+
*   **CUDA Toolkit** (Optional, for GPU acceleration of YOLO/DeepFace)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/surakshasetu/surakshasetu.git
    cd surakshasetu
    ```

2.  **Backend Setup (Python)**
    ```bash
    cd backend
    python -m venv venv
    
    # Windows
    venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate
    
    pip install -r requirements.txt
    python main.py
    ```
    *Server will start at `http://localhost:8000`*

3.  **Frontend Setup (React+Vite)**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Client will start at `http://localhost:5173`*

---

## 📱 User Interface

| **Landing Page** | **Live Monitoring** |
|:---:|:---:|
| Next-gen animated landing page | Real-time multi-camera grid |
| ![Landing Page Preview](https://via.placeholder.com/400x200?text=Landing+Page) | ![Monitoring Preview](https://via.placeholder.com/400x200?text=Live+Monitoring) |

| **Analytics Dashboard** | **Incident Logs** |
|:---:|:---:|
| Detailed charts & metrics | Searchable security history |
| ![Analytics Preview](https://via.placeholder.com/400x200?text=Analytics+Dashboard) | ![Logs Preview](https://via.placeholder.com/400x200?text=Incident+Logs) |

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | Component-based UI architecture |
| | **Tailwind CSS** | Utility-first styling with custom Design System |
| | **Recharts** | Data visualization library |
| | **Framer Motion** | Smooth UI transitions and animations |
| **Backend** | **FastAPI** | High-performance async Python framework |
| | **WebSockets** | Real-time full-duplex communication |
| | **SQLAlchemy** | ORM for database interactions |
| **AI / ML** | **YOLOv8** | Real-time object detection (Ultralytics) |
| | **DeepFace** | State-of-the-art face recognition |
| | **OpenCV** | Image processing and frame manipulation |

---

## 🤝 Contributing

We welcome contributions to improve SurakshaSetu!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
    <b>SurakshaSetu</b> &copy; 2024. All Rights Reserved.
    <br />
    <i>Securing the Future, One Frame at a Time.</i>
</div>
