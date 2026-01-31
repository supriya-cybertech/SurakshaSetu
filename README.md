# SurakshaSetu - AI-Powered Security System

SurakshaSetu is a comprehensive security solution integrating AI/ML for real-time unauthorized entry detection, tailgating detection, and resident management.

## Project Structure
- `backend/`: FastAPI server, AI models, Database, and Security logic.
- `frontend/`: React + Vite application for the dashboard.

## 🚀 How to Run

### 1. Backend Setup
The backend handles the API, database, and AI processing.

1.  **Navigate to the backend folder**:
    ```bash
    cd backend
    ```

2.  **Activate Virtual Environment**:
    - Windows:
      ```bash
      .\venv\Scripts\activate
      ```
    - Linux/Mac:
      ```bash
      source venv/bin/activate
      ```

3.  **Install Dependencies** (if not already done):
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Server**:
    ```bash
    uvicorn SERVER.main:app --reload
    ```
    The server will start at `http://localhost:8000`.

### 2. Frontend Setup
The frontend provides the user interface for monitoring and management.

1.  **Open a new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies** (first time only):
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The app will ideally run at `http://localhost:5173`.

## Features
- **Real-time Tailgating Detection**: AI analyzes video feeds to detect unauthorized entry.
- **Face Recognition**: Identifies residents.
- **Visitor Management**: OTP-based entry for visitors.
- **Dashboard**: Live stats and incident logs.

## Troubleshooting
- **Database Error**: If you see a database error, delete `surakshasetu.db` in the backend folder and restart the server (it will be recreated).
- **Missing DLLs**: If `tensorflow` or `torch` fails, ensure you have the Visual C++ Redistributables installed.
