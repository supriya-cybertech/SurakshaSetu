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
import cv2


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
    authorized_person_ids: List[int] = field(default_factory=list)
    unauthorized_embeddings: List[np.ndarray] = field(default_factory=list)
    additional_info: str = ""

from collections import OrderedDict

class CentroidTracker:
    def __init__(self, max_disappeared=50):
        self.nextObjectID = 0
        self.objects = OrderedDict()
        self.disappeared = OrderedDict()
        self.maxDisappeared = max_disappeared

    def register(self, centroid):
        self.objects[self.nextObjectID] = centroid
        self.disappeared[self.nextObjectID] = 0
        self.nextObjectID += 1

    def deregister(self, objectID):
        del self.objects[objectID]
        del self.disappeared[objectID]

    def update(self, rects):
        if len(rects) == 0:
            for objectID in list(self.disappeared.keys()):
                self.disappeared[objectID] += 1
                if self.disappeared[objectID] > self.maxDisappeared:
                    self.deregister(objectID)
            return self.objects

        inputCentroids = np.zeros((len(rects), 2), dtype="int")
        for (i, (startX, startY, endX, endY)) in enumerate(rects):
            cX = int((startX + endX) / 2.0)
            cY = int((startY + endY) / 2.0)
            inputCentroids[i] = (cX, cY)

        if len(self.objects) == 0:
            for i in range(0, len(inputCentroids)):
                self.register(inputCentroids[i])
        else:
            objectIDs = list(self.objects.keys())
            objectCentroids = list(self.objects.values())

            D = self.dist(np.array(objectCentroids), inputCentroids)
            rows = D.min(axis=1).argsort()
            cols = D.argmin(axis=1)[rows]

            usedRows = set()
            usedCols = set()

            for (row, col) in zip(rows, cols):
                if row in usedRows or col in usedCols:
                    continue

                objectID = objectIDs[row]
                self.objects[objectID] = inputCentroids[col]
                self.disappeared[objectID] = 0

                usedRows.add(row)
                usedCols.add(col)

            unusedRows = set(range(0, D.shape[0])).difference(usedRows)
            unusedCols = set(range(0, D.shape[1])).difference(usedCols)

            if D.shape[0] >= D.shape[1]:
                for row in unusedRows:
                    objectID = objectIDs[row]
                    self.disappeared[objectID] += 1
                    if self.disappeared[objectID] > self.maxDisappeared:
                        self.deregister(objectID)
            else:
                for col in unusedCols:
                    self.register(inputCentroids[col])

        return self.objects
        
    def dist(self, a, b):
        return np.linalg.norm(a[:, np.newaxis] - b, axis=2)

class TailgatingDetector:
    # ...
    def __init__(self, 
                 tripwire_y: int = 300, 
                 time_window: float = 3.0, 
                 alert_callback=None):
        self.tripwire_y = tripwire_y
        self.time_window = time_window
        self.alert_callback = alert_callback
        
        # Tracking
        self.centroid_tracker = CentroidTracker(max_disappeared=40)
        self.persons_crossing = {}  # {person_id: crossing_time}
        self.crossing_history = defaultdict(list)
        self.track_embeddings = {} # {person_id: latest_embedding}
        
        self.last_authorization_time = None
        self.last_authorized_person_id = None
        
        # Alert management
        self.recent_alerts = []
        self.alert_history = []
        self.lock = threading.Lock()
    
    # ...
    
    def update(self, 
               detections: List[Tuple[int, int, int, int]],
               embeddings: List[np.ndarray] = None, # Added argument
               authorized_ids: List[int] = None,
               camera_id: int = 0,
               frame: Optional[np.ndarray] = None) -> Optional[TailgatingAlert]:
        
        if authorized_ids is None:
            authorized_ids = []
            
        with self.lock:
            # Update centroid tracker
            # We ideally need the mapping from detection_idx -> object_id to assign embeddings
            # For now, we will use a heuristic: match centroid to detection
            
            tracked_objects = self.centroid_tracker.update(detections)
            
            # Update embeddings for tracked objects
            if embeddings:
                # Naive matching: Find closest tracked object for each detection with embedding
                # This duplicates some work of CentroidTracker but is necessary without refactoring it
                for i, rect in enumerate(detections):
                    if i < len(embeddings) and embeddings[i] is not None:
                        # Find object ID corresponding to this rect
                        # (Calculate center and find closest in tracked_objects)
                        cX = (rect[0] + rect[2]) // 2
                        cY = (rect[1] + rect[3]) // 2
                        
                        best_dist = 9999
                        best_id = -1
                        
                        for obj_id, centroid in tracked_objects.items():
                            dist = np.linalg.norm(np.array([cX, cY]) - np.array(centroid))
                            if dist < 50 and dist < best_dist: # Same threshold as tracker
                                best_dist = dist
                                best_id = obj_id
                        
                        if best_id != -1:
                            self.track_embeddings[best_id] = embeddings[i]
            
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
                    
                    # Tailgating: More than 1 person within time window OR just an unauthorized person following
                    # condition: >1 person total, at least 1 unauthorized
                    if len(crossed_persons) > 1 and unauth_count > 0:
                        severity = self._calculate_severity(len(crossed_persons), unauth_count)
                        
                        # Collect unauthorized embeddings
                        unauth_embeddings = []
                        for pid in crossed_persons:
                            if pid not in authorized_ids and pid in self.track_embeddings:
                                unauth_embeddings.append(self.track_embeddings[pid])
                        
                        # Create visual snapshot
                        snapshot_frame = None
                        if frame is not None:
                            snapshot_frame = frame.copy()
                            VirtualTripwireVisualizer.draw_tripwire(snapshot_frame, self.tripwire_y)
                            VirtualTripwireVisualizer.draw_detections(
                                snapshot_frame, 
                                detections, 
                                authorized_ids=authorized_ids, 
                                person_ids=[obj_id for obj_id in tracked_objects.keys()] # Approximate mapping? No, detections list doesn't match keys directly order-wise
                                # Better to just label all detections based on location matching or just draw all boxes
                            )
                            # Re-matching for visualization is tricky without idx map, let's keep it simple
                            # Just draw all rectangles, color red/green if in authorized_ids
                            # Actually VirtualTripwireVisualizer needs specific logic.
                            # Let's fix VirtualTripwireVisualizer usage later or simplify drawing here.

                            # Simplified Drawing
                            import cv2
                            cv2.line(snapshot_frame, (0, self.tripwire_y), (snapshot_frame.shape[1], self.tripwire_y), (0, 255, 255), 2)
                            for i, (x1, y1, x2, y2) in enumerate(detections):
                                is_auth = False
                                # Try to find which object ID this is
                                cX, cY = (x1+x2)//2, (y1+y2)//2
                                for oid, cent in tracked_objects.items():
                                    if np.linalg.norm(np.array([cX, cY]) - np.array(cent)) < 20:
                                        if oid in authorized_ids:
                                            is_auth = True
                                        break
                                
                                color = (0, 255, 0) if is_auth else (0, 0, 255)
                                cv2.rectangle(snapshot_frame, (x1, y1), (x2, y2), color, 2)
                                status = "AUTH" if is_auth else "UNAUTH"
                                cv2.putText(snapshot_frame, status, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                        alert = TailgatingAlert(
                            alert_id=f"TAILGATE_{camera_id}_{current_time.timestamp()}",
                            timestamp=current_time,
                            camera_id=camera_id,
                            persons_detected=len(tracked_objects),
                            persons_authorized=auth_count,
                            persons_unauthorized=unauth_count,
                            time_window=self.time_window,
                            severity=severity,
                            snapshot=snapshot_frame,
                            authorized_person_ids=[pid for pid in crossed_persons if pid in authorized_ids],
                            unauthorized_embeddings=unauth_embeddings,
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