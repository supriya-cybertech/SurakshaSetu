from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Supabase PostgreSQL URL
# Assuming password is 'X_sibam@8604' without brackets
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.aoyebxrzriqktmtmjfgr:Suraksha1234@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"sslmode": "require"})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()