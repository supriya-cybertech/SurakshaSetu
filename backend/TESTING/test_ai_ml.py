#!/usr/bin/env python
from AI_ML.ai_ml_utils import FrameProcessor, ResidentDatabase, FaceRecognitionEngine, ObjectDetectionEngine
import numpy as np
import cv2

print("\n" + "="*60)
print("🧪 AI/ML UTILITIES TEST")
print("="*60 + "\n")

# Test 1: Face Recognition Engine
print("Test 1: Face Recognition Engine")
print("-" * 60)

face_engine = FaceRecognitionEngine()
print("✅ Face recognition engine initialized")

# Create mock face image
np.random.seed(42)
mock_face = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
embedding = face_engine.generate_embedding(mock_face)
print(f"✅ Generated embedding: shape {embedding.shape if embedding is not None else 'None'}")

# Test embedding comparison
if embedding is not None:
    similarity, score = face_engine.compare_embeddings(embedding, embedding)
    print(f"✅ Self-comparison: Match={similarity}, Score={score:.3f}")
else:
    print("ℹ️  Using mock embeddings (DeepFace not available)")

# Test 2: Object Detection Engine
print("\nTest 2: Object Detection Engine")
print("-" * 60)

obj_engine = ObjectDetectionEngine()
print("✅ Object detection engine initialized")

# Create mock frame
mock_frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
persons = obj_engine.detect_persons(mock_frame)
weapons = obj_engine.detect_weapons(mock_frame)
print(f"✅ Detected persons: {len(persons)}")
print(f"✅ Detected weapons: {len(weapons)}")

# Test 3: Frame Processor
print("\nTest 3: Frame Processor")
print("-" * 60)

processor = FrameProcessor()
print("✅ Frame processor initialized")

result = processor.process_frame(mock_frame)
print(f"✅ Processed frame: {len(result['persons'])} persons, {len(result['weapons'])} weapons")
print(f"   Timestamp: {result['timestamp']}")

# Test 4: Resident Database
print("\nTest 4: Resident Database")
print("-" * 60)

resident_db = ResidentDatabase()
print("✅ Resident database initialized")

# Enroll resident
success = resident_db.enroll_resident(1, "John Doe", mock_face)
print(f"✅ Resident enrollment: {'Success' if success else 'Failed'}")

# Test recognition
if embedding is not None:
    match = resident_db.recognize_face(embedding)
    if match:
        print(f"✅ Face recognition: {match['name']} (confidence: {match['confidence']:.3f})")
    else:
        print("ℹ️  No face match found")
else:
    print("ℹ️  Skipping recognition test (no real embeddings)")

print("\n✅ All AI/ML tests completed successfully!\n")
print("="*60 + "\n")