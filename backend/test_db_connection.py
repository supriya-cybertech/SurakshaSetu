import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# 1. User supplied "accurate" link (Step 132) - Project ID: aoyebxzrziqktmtmjfgr
# username: postgres.aoyebxzrziqktmtmjfgr
URL_1 = "postgresql://postgres.aoyebxzrziqktmtmjfgr:Suraksha1234@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

# 2. Original Project ID from (Step 69) but with New Password - Project ID: aoyebxrzriqktmtmjfgr
# username: postgres.aoyebxrzriqktmtmjfgr
URL_2 = "postgresql://postgres.aoyebxrzriqktmtmjfgr:Suraksha1234@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

# 3. Direct Connection for Project ID 1
URL_3 = "postgresql://postgres:Suraksha1234@db.aoyebxzrziqktmtmjfgr.supabase.co:5432/postgres"

# 4. Direct Connection for Project ID 2
URL_4 = "postgresql://postgres:Suraksha1234@db.aoyebxrzriqktmtmjfgr.supabase.co:5432/postgres"

urls_to_test = [
    ("User Provided (Step 132)", URL_1),
    ("Original Project ID (Step 69)", URL_2),
    ("Direct Connection (ID 1)", URL_3),
    ("Direct Connection (ID 2)", URL_4)
]

print("🔍 Testing Database Connections...")

for name, url in urls_to_test:
    print(f"\nTesting: {name}")
    print(f"URL: {url}")
    try:
        engine = create_engine(url, connect_args={"connect_timeout": 5})
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ SUCCESS! Connected.")
            with open("success.txt", "w") as f:
                f.write(url)
            sys.exit(0) # Exit with success code if any work
    except Exception as e:
        print(f"❌ FAILED: {e}")

print("\n❌ All connection attempts failed.")
sys.exit(1)
