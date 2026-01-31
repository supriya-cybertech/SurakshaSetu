import cv2
import time
import sys
import platform

# Import config to get URLs
try:
    from config import CAMERA_CONFIG
except ImportError:
    print("Could not import config.py. Make sure you run this from the 'backend' directory.")
    sys.exit(1)

def test_camera(camera_id, config):
    url = config.get('stream_url')
    name = config.get('name', f"Camera {camera_id}")
    
    print(f"\n--- Testing {name} (ID: {camera_id}) ---")
    print(f"URL: {url}")
    
    if url == 0:
        print("Type: Webcam (Index 0)")
    else:
        print("Type: Network Stream")

    # Attempt connection
    print("Attempting to open stream...")
    start_time = time.time()
    
    # Try different backends if on Windows
    backends = [cv2.CAP_ANY]
    if platform.system() == 'Windows':
        backends.append(cv2.CAP_DSHOW) # DirectShow (good for webcams)
        backends.append(cv2.CAP_FFMPEG) # FFMPEG (good for IP streams)
        
    cap = None
    worked = False
    
    for backend in backends:
        backend_name = "CAP_ANY"
        if backend == cv2.CAP_DSHOW: backend_name = "CAP_DSHOW"
        if backend == cv2.CAP_FFMPEG: backend_name = "CAP_FFMPEG"
        
        print(f"Trying backend: {backend_name}...")
        try:
            temp_cap = cv2.VideoCapture(url, backend)
            if temp_cap.isOpened():
                print(f"  SUCCESS: Stream opened with {backend_name}")
                cap = temp_cap
                worked = True
                break
            else:
                print(f"  FAILED: Could not open with {backend_name}")
        except Exception as e:
            print(f"  ERROR with {backend_name}: {e}")

    if not worked or cap is None:
        print("❌ CRITICAL: Failed to open stream with all backends.")
        print("   Suggestion: Check if the URL is correct and accessible from this machine.")
        print("   Suggestion: Try opening the URL in a browser or VLC player.")
        return

    # Read a few frames
    print("Reading frames...")
    success_count = 0
    params_read = False
    
    for i in range(10):
        ret, frame = cap.read()
        if ret:
            success_count += 1
            if not params_read:
                h, w = frame.shape[:2]
                print(f"  Frame Size: {w}x{h}")
                fps = cap.get(cv2.CAP_PROP_FPS)
                print(f"  FPS: {fps}")
                params_read = True
        else:
            print(f"  Failed to read frame {i+1}")
            time.sleep(0.5)
            
    cap.release()
    
    if success_count > 0:
        print(f"✅ PASSED: Successfully read {success_count}/10 frames.")
    else:
        print("❌ FAILED: Stream opened but could not read any frames.")

print("==========================================")
print("   SURAKSHASETU CAMERA DEBUGGER")
print("==========================================")
print(f"OpenCV Version: {cv2.__version__}")
print(f"OS: {platform.system()} {platform.release()}")

for cam_id, cfg in CAMERA_CONFIG.items():
    if cfg.get('active', True):
        test_camera(cam_id, cfg)

print("\nDebug complete.")
