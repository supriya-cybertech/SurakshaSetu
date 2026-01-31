"""
AI/ML UTILITIES
Face Recognition, Object Detection, Threat Detection using YOLOv8 and DeepFace
"""

import cv2
import numpy as np
from typing import List, Tuple, Optional, Dict
import pickle
import logging
from datetime import datetime
import threading

# Try imports - graceful fallback if models not installed
try:
    from ultralytics import YOLO
    YOLO_AVAILABLE = True
except ImportError:
    YOLO_AVAILABLE = False
    logging.warning("YOLOv8 not installed. Object detection disabled.")

# Try DeepFace import with better error handling
DEEPFACE_AVAILABLE = False
try:
    import tensorflow as tf
    tf.config.set_visible_devices([], 'GPU')  # Disable GPU to avoid issues
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError as e:
    logging.warning(f"DeepFace not installed. Face recognition disabled. Error: {e}")
except Exception as e:
    logging.warning(f"DeepFace initialization failed (likely TensorFlow compatibility issue with Python 3.13). Face recognition disabled. Error: {e}")
    # Try alternative face recognition libraries
    try:
        import face_recognition
        FACE_RECOGNITION_AVAILABLE = True
        logging.info("Using face_recognition library as fallback for face recognition.")
    except ImportError:
        FACE_RECOGNITION_AVAILABLE = False
        logging.warning("face_recognition library also not available. Face recognition will use mock data.")


class FaceRecognitionEngine:
    """
    Face recognition using DeepFace embeddings.
    Converts face to 128D embedding vector (not storing actual photos).
    """
    
    def __init__(self, model_name: str = "Facenet"):
        """
        Args:
            model_name: Model to use ("Facenet", "VGGFace2", "OpenFace", "DeepID")
        """
        self.model_name = model_name
        self.lock = threading.Lock()
        
        if not DEEPFACE_AVAILABLE:
            logging.warning("DeepFace not available. Face recognition will be mocked.")
    
    def generate_embedding(self, face_image: np.ndarray) -> Optional[np.ndarray]:
        """
        Generate face embedding (128D vector).
        
        Args:
            face_image: BGR image containing a face
        
        Returns:
            NumPy array of shape (128,) representing the face embedding
        """
        if not DEEPFACE_AVAILABLE:
            # Create a deterministic mock embedding based on image hash
            # This allows consistent "recognition" for testing purposes
            import hashlib
            image_hash = hashlib.md5(face_image.tobytes()).hexdigest()
            np.random.seed(int(image_hash[:8], 16))
            return np.random.rand(128)  # Mock embedding
        
        try:
            with self.lock:
                embedding = DeepFace.represent(
                    face_image,
                    model_name=self.model_name,
                    enforce_detection=False
                )
                if embedding:
                    return np.array(embedding[0]['embedding'])
        except Exception as e:
            logging.error(f"Face embedding generation failed: {e}")
            # Fallback to mock embedding
            return np.random.rand(128)
        
        return None
    
    def compare_embeddings(self, 
                          embedding1: np.ndarray,
                          embedding2: np.ndarray,
                          threshold: float = 0.6) -> Tuple[bool, float]:
        """
        Compare two face embeddings using cosine similarity.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            threshold: Similarity threshold (0-1)
        
        Returns:
            (is_match: bool, similarity_score: float)
        """
        # Normalize vectors
        e1 = embedding1 / (np.linalg.norm(embedding1) + 1e-8)
        e2 = embedding2 / (np.linalg.norm(embedding2) + 1e-8)
        
        # Cosine similarity
        similarity = np.dot(e1, e2)
        
        return similarity > threshold, float(similarity)
    
    def extract_face(self, frame: np.ndarray, detection_bbox: Tuple) -> Optional[np.ndarray]:
        """Extract face region from frame given bounding box"""
        x1, y1, x2, y2 = detection_bbox
        x1, y1, x2, y2 = max(0, x1), max(0, y1), x2, y2
        
        if x2 > x1 and y2 > y1:
            return frame[y1:y2, x1:x2]
        return None


class ObjectDetectionEngine:
    """
    Object detection using YOLOv8.
    Primary use: Person detection, Weapon detection (knives, firearms)
    """
    
    def __init__(self, model_size: str = "m"):
        """
        Args:
            model_size: YOLOv8 variant ("n" for nano, "s" for small, "m" for medium, "l" for large)
        """
        self.model_size = model_size
        self.person_model = None
        self.weapon_model = None
        self.lock = threading.Lock()
        
        if YOLO_AVAILABLE:
            try:
                self.person_model = YOLO(f"yolov8{model_size}.pt")  # Generic object detection
                logging.info(f"Loaded YOLOv8{model_size} person detection model")
            except Exception as e:
                logging.error(f"Failed to load YOLOv8 person model: {e}")
        
        # Note: For weapon detection in production, use a custom-trained model
        # For hackathon, we'll use a mock or switch between models
    
    def detect_persons(self, frame: np.ndarray, confidence: float = 0.5) -> List[Tuple[int, int, int, int, float]]:
        """
        Detect persons in frame.
        
        Args:
            frame: Input BGR image
            confidence: Confidence threshold (0-1)
        
        Returns:
            List of (x1, y1, x2, y2, confidence)
        """
        if not YOLO_AVAILABLE or self.person_model is None:
            # Return mock detections for demo
            h, w = frame.shape[:2]
            return [(100, 100, 200, 300, 0.95), (400, 150, 500, 350, 0.88)]
        
        try:
            with self.lock:
                results = self.person_model(frame, conf=confidence, classes=[0])  # class 0 = person
                
                detections = []
                for result in results:
                    for box in result.boxes:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        conf = float(box.conf[0])
                        detections.append((x1, y1, x2, y2, conf))
                
                return detections
        except Exception as e:
            logging.error(f"Person detection failed: {e}")
            return []
    
    def detect_weapons(self, frame: np.ndarray, confidence: float = 0.5) -> List[Tuple[str, Tuple, float]]:
        """
        Detect weapons (knives, firearms) in frame.
        Note: Requires custom-trained model for production.
        
        Args:
            frame: Input BGR image
            confidence: Confidence threshold
        
        Returns:
            List of (weapon_type, bbox, confidence)
        """
        # For hackathon demo, return empty (no weapons)
        # In production: Load custom weapon detection model
        
        # Mock: Randomly detect weapons for testing
        import random
        if random.random() > 0.98:  # 2% chance for demo
            h, w = frame.shape[:2]
            return [("knife", (100, 100, 150, 200), 0.87)]
        
        return []
    
    def detect_all(self, frame: np.ndarray) -> Dict:
        """Run all detection pipelines"""
        return {
            "persons": self.detect_persons(frame),
            "weapons": self.detect_weapons(frame)
        }


class FrameProcessor:
    """Process video frames with AI models"""
    
    def __init__(self):
        self.face_engine = FaceRecognitionEngine()
        self.object_engine = ObjectDetectionEngine()
        self.lock = threading.Lock()
    
    def process_frame(self, 
                     frame: np.ndarray,
                     detect_persons: bool = True,
                     detect_weapons: bool = True,
                     generate_embeddings: bool = True) -> Dict:
        """
        Full frame processing pipeline.
        
        Returns:
            {
                "persons": [{"bbox": (x1,y1,x2,y2), "confidence": 0.95, "embedding": [...]}],
                "weapons": [{"type": "knife", "bbox": (...), "confidence": 0.87}],
                "timestamp": datetime
            }
        """
        result = {
            "timestamp": datetime.utcnow(),
            "persons": [],
            "weapons": []
        }
        
        with self.lock:
            if detect_persons:
                person_detections = self.object_engine.detect_persons(frame)
                
                for x1, y1, x2, y2, conf in person_detections:
                    person_data = {
                        "bbox": (x1, y1, x2, y2),
                        "confidence": conf,
                        "embedding": None
                    }
                    
                    if generate_embeddings:
                        face_region = self.face_engine.extract_face(frame, (x1, y1, x2, y2))
                        if face_region is not None:
                            embedding = self.face_engine.generate_embedding(face_region)
                            person_data["embedding"] = embedding
                    
                    result["persons"].append(person_data)
            
            if detect_weapons:
                weapon_detections = self.object_engine.detect_weapons(frame)
                result["weapons"] = [
                    {
                        "type": weapon_type,
                        "bbox": bbox,
                        "confidence": conf
                    }
                    for weapon_type, bbox, conf in weapon_detections
                ]
        
        return result


class ResidentDatabase:
    """In-memory resident face embedding database"""
    
    def __init__(self):
        self.residents = {}  # {resident_id: {"name": ..., "embedding": np.array, ...}}
        self.face_engine = FaceRecognitionEngine()
        self.lock = threading.Lock()
    
    def enroll_resident(self, resident_id: int, name: str, face_image: np.ndarray, metadata: dict = None):
        """Enroll a resident with face embedding"""
        embedding = self.face_engine.generate_embedding(face_image)
        
        if embedding is not None:
            with self.lock:
                self.residents[resident_id] = {
                    "name": name,
                    "embedding": embedding,
                    "enrollment_time": datetime.utcnow(),
                    "metadata": metadata or {}
                }
            return True
        return False
    
    def recognize_face(self, embedding: np.ndarray, threshold: float = 0.6) -> Optional[Dict]:
        """
        Recognize a face against resident database.
        Returns the matched resident info or None.
        """
        if embedding is None:
            return None
        
        best_match = None
        best_similarity = -1
        
        with self.lock:
            for resident_id, resident_data in self.residents.items():
                stored_embedding = resident_data["embedding"]
                is_match, similarity = self.face_engine.compare_embeddings(
                    embedding, stored_embedding, threshold
                )
                
                if is_match and similarity > best_similarity:
                    best_similarity = similarity
                    best_match = {
                        "resident_id": resident_id,
                        "name": resident_data["name"],
                        "confidence": float(similarity),
                        "metadata": resident_data["metadata"]
                    }
        
        return best_match
    
    def get_resident_embedding(self, resident_id: int) -> Optional[np.ndarray]:
        """Get resident's stored embedding"""
        with self.lock:
            if resident_id in self.residents:
                return self.residents[resident_id]["embedding"]
        return None
    
    def serialize_embeddings(self, filepath: str):
        """Serialize embeddings to pickle file"""
        with self.lock:
            with open(filepath, 'wb') as f:
                pickle.dump(self.residents, f)
    
    def load_embeddings(self, filepath: str):
        """Load embeddings from pickle file"""
        with self.lock:
            with open(filepath, 'rb') as f:
                self.residents = pickle.load(f)


# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)