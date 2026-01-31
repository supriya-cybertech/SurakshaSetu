"""
TAILGATING DETECTION LOGIC
Detects multiple persons crossing a virtual tripwire within a short time window.
Uses Centroid Tracking for person continuity tracking.
"""

import numpy as np
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional
import threading
import time


@dataclass
class Person:
    """Represents a detected person in the frame"""
    id: int
    centroid: Tuple[float, float]
    bbox: Tuple[int, int, int, int]  # x1, y1, x2, y2
    timestamp: datetime
    confidence: float
    is_authorized: bool = False
    face_embedding: Optional[np.ndarray] = None


@dataclass
class TailgatingAlert:
    """Alert structure for tailgating incidents"""
    alert_id: str
    timestamp: datetime
    camera_id: int
    persons_detected: int
    persons_authorized: int
    persons_unauthorized: int
    time_window: float  # seconds
    severity: str  # "LOW", "MEDIUM", "HIGH"
    snapshot: Optional[np.ndarray] = None
    additional_info: str = ""


class CentroidTracker:
    """
    Multi-object tracker using centroid tracking algorithm.
    Maintains object IDs across frames.
    """
    
    def __init__(self, max_disappeared=50):
        self.next_object_id = 0
        self.objects = {}  # {id: centroid}
        self.disappeared = {}  # {id: count}
        self.max_disappeared = max_disappeared
    
    def register(self, centroid: Tuple[float, float]):
        """Register a new object"""
        self.objects[self.next_object_id] = centroid
        self.disappeared[self.next_object_id] = 0
        self.next_object_id += 1
    
    def deregister(self, object_id: int):
        """Deregister an object"""
        del self.objects[object_id]
        del self.disappeared[object_id]
    
    def update(self, rects: List[Tuple[int, int, int, int]]) -> Dict[int, Tuple[float, float]]:
        """
        Update tracker with new bounding boxes.
        Args:
            rects: List of bounding boxes (x1, y1, x2, y2)
        Returns:
            Dictionary mapping object IDs to their centroids
        """
        if len(rects) == 0:
            for object_id in list(self.disappeared.keys()):
                self.disappeared[object_id] += 1
                if self.disappeared[object_id] > self.max_disappeared:
                    self.deregister(object_id)
            return self.objects
        
        # Calculate centroids of new detections
        input_centroids = np.zeros((len(rects), 2))
        for i, (startX, startY, endX, endY) in enumerate(rects):
            cX = (startX + endX) // 2
            cY = (startY + endY) // 2
            input_centroids[i] = [cX, cY]
        
        # Match centroids
        if len(self.objects) == 0:
            for i in range(0, len(input_centroids)):
                self.register(input_centroids[i])
        else:
            object_ids = list(self.objects.keys())
            object_centroids = np.array(list(self.objects.values()))
            
            # Calculate Euclidean distance between each pair
            D = np.zeros((len(object_centroids), len(input_centroids)))
            for i in range(len(object_centroids)):
                for j in range(len(input_centroids)):
                    D[i, j] = np.linalg.norm(object_centroids[i] - input_centroids[j])
            
            # Simple greedy assignment
            rows = D.min(axis=1).argsort()
            cols = D.argmin(axis=1)[rows]
            
            used_rows = set()
            used_cols = set()
            
            for (row, col) in zip(rows, cols):
                if row in used_rows or col in used_cols:
                    continue
                if D[row, col] > 50:  # Distance threshold
                    continue
                
                object_id = object_ids[row]
                self.objects[object_id] = input_centroids[col]
                self.disappeared[object_id] = 0
                used_rows.add(row)
                used_cols.add(col)
            
            # Register new objects
            unused_rows = set(range(0, D.shape[0])).difference(used_rows)
            unused_cols = set(range(0, D.shape[1])).difference(used_cols)
            
            if D.shape[0] >= D.shape[1]:
                for row in unused_rows:
                    object_id = object_ids[row]
                    self.disappeared[object_id] += 1
                    if self.disappeared[object_id] > self.max_disappeared:
                        self.deregister(object_id)
            else:
                for col in unused_cols:
                    self.register(input_centroids[col])
        
        return self.objects


class TailgatingDetector:
    """
    Detects tailgating using virtual tripwire logic.
    Alert triggered if >1 person crosses within 3 seconds of authorization.
    """
    
    def __init__(self, 
                 tripwire_y: int = 300,  # Horizontal line position
                 time_window: float = 3.0,  # 3 seconds
                 alert_callback=None):
        """
        Args:
            tripwire_y: Y-coordinate of the virtual tripwire
            time_window: Time window in seconds to detect tailgating
            alert_callback: Callback function when alert is triggered
        """
        self.tripwire_y = tripwire_y
        self.time_window = time_window
        self.alert_callback = alert_callback
        
        # Tracking
        self.centroid_tracker = CentroidTracker(max_disappeared=40)
        self.persons_crossing = {}  # {person_id: crossing_time}
        self.crossing_history = defaultdict(list)  # {person_id: [crossing_times]}
        self.last_authorization_time = None
        self.last_authorized_person_id = None
        
        # Alert management
        self.recent_alerts = []  # Keep recent alerts to prevent duplicates
        self.alert_history = []
        self.lock = threading.Lock()
    
    def mark_authorization(self, person_id: int, confidence: float = 1.0):
        """Record that a person has been authorized (biometric/RFID match)"""
        with self.lock:
            self.last_authorization_time = datetime.utcnow()
            self.last_authorized_person_id = person_id
    
    def update(self, 
               detections: List[Tuple[int, int, int, int]],  # [x1, y1, x2, y2, ...]
               authorized_ids: List[int] = None,
               camera_id: int = 0,
               frame: Optional[np.ndarray] = None) -> Optional[TailgatingAlert]:
        """
        Update detector with new frame detections.
        
        Args:
            detections: List of bounding boxes
            authorized_ids: IDs of people who are authorized
            camera_id: Camera ID for logging
            frame: The current frame (for snapshot)
        
        Returns:
            TailgatingAlert if tailgating is detected, else None
        """
        if authorized_ids is None:
            authorized_ids = []
        
        with self.lock:
            # Update centroid tracker
            tracked_objects = self.centroid_tracker.update(detections)
            
            # Check crossing logic
            current_time = datetime.utcnow()
            crossed_persons = []
            
            for person_id, centroid in tracked_objects.items():
                cy = centroid[1]
                
                # Check if person crosses tripwire (coming from above)
                if cy > self.tripwire_y:
                    if person_id not in self.persons_crossing:
                        self.persons_crossing[person_id] = current_time
                        self.crossing_history[person_id].append(current_time)
                        crossed_persons.append(person_id)
                else:
                    # Remove from crossing dict if person goes back
                    if person_id in self.persons_crossing:
                        del self.persons_crossing[person_id]
            
            # Analyze crossing pattern
            alert = None
            if len(crossed_persons) > 0 and self.last_authorization_time:
                time_since_auth = (current_time - self.last_authorization_time).total_seconds()
                
                # Check if crossing occurred within time window after authorization
                if time_since_auth < self.time_window:
                    # Count authorized vs unauthorized
                    auth_count = sum(1 for pid in crossed_persons if pid in authorized_ids)
                    unauth_count = len(crossed_persons) - auth_count
                    
                    # Tailgating: More than 1 person within time window
                    if len(crossed_persons) > 1 and unauth_count > 0:
                        severity = self._calculate_severity(len(crossed_persons), unauth_count)
                        
                        alert = TailgatingAlert(
                            alert_id=f"TAILGATE_{camera_id}_{current_time.timestamp()}",
                            timestamp=current_time,
                            camera_id=camera_id,
                            persons_detected=len(tracked_objects),
                            persons_authorized=auth_count,
                            persons_unauthorized=unauth_count,
                            time_window=self.time_window,
                            severity=severity,
                            snapshot=frame.copy() if frame is not None else None,
                            additional_info=f"Authorized: {self.last_authorized_person_id}, "
                                          f"Unauthorized crossed: {unauth_count}"
                        )
                        
                        self.recent_alerts.append(alert)
                        self.alert_history.append(alert)
                        
                        if self.alert_callback:
                            self.alert_callback(alert)
            
            return alert
    
    def _calculate_severity(self, total_persons: int, unauth_persons: int) -> str:
        """Calculate alert severity based on number of unauthorized persons"""
        if unauth_persons >= 3:
            return "HIGH"
        elif unauth_persons == 2:
            return "MEDIUM"
        else:
            return "LOW"
    
    def get_recent_alerts(self, minutes: int = 5) -> List[TailgatingAlert]:
        """Get alerts from the last N minutes"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=minutes)
        return [alert for alert in self.alert_history if alert.timestamp > cutoff_time]
    
    def reset(self):
        """Reset tracker state"""
        with self.lock:
            self.centroid_tracker = CentroidTracker()
            self.persons_crossing = {}
            self.last_authorization_time = None
            self.last_authorized_person_id = None


class VirtualTripwireVisualizer:
    """Helper to draw tripwire and crossings on frame"""
    
    @staticmethod
    def draw_tripwire(frame: np.ndarray, tripwire_y: int, color: Tuple[int, int, int] = (0, 255, 0)):
        """Draw tripwire line on frame"""
        import cv2
        h, w = frame.shape[:2]
        cv2.line(frame, (0, tripwire_y), (w, tripwire_y), color, 2)
        cv2.putText(frame, "VIRTUAL TRIPWIRE", (10, tripwire_y - 10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        return frame
    
    @staticmethod
    def draw_detections(frame: np.ndarray,
                       detections: List[Tuple[int, int, int, int]],
                       authorized_ids: List[int] = None,
                       person_ids: List[int] = None):
        """Draw bounding boxes on frame"""
        import cv2
        if authorized_ids is None:
            authorized_ids = []
        if person_ids is None:
            person_ids = list(range(len(detections)))
        
        for i, (x1, y1, x2, y2) in enumerate(detections):
            pid = person_ids[i] if i < len(person_ids) else i
            is_auth = pid in authorized_ids
            color = (0, 255, 0) if is_auth else (0, 0, 255)
            
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"ID:{pid} {'AUTH' if is_auth else 'UNK'}"
            cv2.putText(frame, label, (x1, y1 - 5),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        return frame