import os
import logging
from datetime import datetime
from tinydb import TinyDB, Query

# Logging setup
logger = logging.getLogger(__name__)

# Use TinyDB for a lightweight, file-based NoSQL alternative
# This avoids the need for a running MongoDB server
class MockCollection:
    def __init__(self, db, name):
        self.table = db.table(name)
        self.name = name

    def insert_one(self, document):
        # Allow _id if present, else TinyDB handles ID
        if "_id" in document:
            document["_id"] = str(document["_id"])
        
        doc_id = self.table.insert(document)
        
        # Return a mock InsertOneResult
        class InsertOneResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        
        return InsertOneResult(doc_id)

    def find_one(self, query):
        Q = Query()
        # Simple exact match query support
        # For complex queries, this mock would need expansion
        if not query:
            return self.table.all()[0] if self.table.all() else None
        
        # We only support single key-value match for now
        key, value = list(query.items())[0]
        result = self.table.search(getattr(Q, key) == value)
        return result[0] if result else None

    def find(self, query=None):
        if not query:
            return self.table.all()
        # Mock currently returns all for find() to avoid complexity
        # In a real scenario, implement full query parsing
        return self.table.all()
    
    def count_documents(self, query=None):
        if not query:
            return len(self.table.all())
        
        # Simple count with single key filtering
        try:
            Q = Query()
            key, value = list(query.items())[0]
            return self.table.count(getattr(Q, key) == value)
        except Exception:
            # Fallback if query is complex or empty
            return 0

    def create_index(self, key, unique=False):
        # TinyDB doesn't need explicit indexes, but we log it
        logger.info(f"Mock index created on {self.name}.{key}")
        return key

# Initialize TinyDB
try:
    db_path = os.path.join(os.path.dirname(__file__), 'local_db.json')
    local_db = TinyDB(db_path)
    logger.info(f"Using local file database: {db_path}")

    # Create mock collections that mimic PyMongo behavior
    residents_collection = MockCollection(local_db, "residents")
    visitors_collection = MockCollection(local_db, "visitors")
    incident_logs_collection = MockCollection(local_db, "incident_logs")
    access_logs_collection = MockCollection(local_db, "access_logs")
    camera_configs_collection = MockCollection(local_db, "camera_configs")

    # Mock client and db objects for compatibility
    client = local_db
    db = local_db

except Exception as e:
    logger.error(f"Failed to initialize local database: {e}")
    raise e

def get_db():
    return db