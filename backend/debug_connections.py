import sys
from sqlalchemy import create_engine, text

# Define all potential connection strings
# Password: Suraksha1234

# 1. Project ID: aoyebxrzriqktmtmjfgr (Original form)
# Pooler (Transaction/Session)
ID1_POOLER = "postgresql://postgres.aoyebxrzriqktmtmjfgr:Suraksha1234@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
# Direct Connection
ID1_DIRECT = "postgresql://postgres:Suraksha1234@db.aoyebxrzriqktmtmjfgr.supabase.co:5432/postgres"

# 2. Project ID: aoyebxzrziqktmtmjfgr (User provided form in Step 132)
# Pooler
ID2_POOLER = "postgresql://postgres.aoyebxzrziqktmtmjfgr:Suraksha1234@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
# Direct Connection
ID2_DIRECT = "postgresql://postgres:Suraksha1234@db.aoyebxzrziqktmtmjfgr.supabase.co:5432/postgres"

candidates = [
    ("ID1_DIRECT", ID1_DIRECT),
    ("ID1_POOLER", ID1_POOLER),
    ("ID2_DIRECT", ID2_DIRECT),
    ("ID2_POOLER", ID2_POOLER),
]

print("🔍 STARTING CONNECTION TESTS...\n")

success_url = None

for name, url in candidates:
    print(f"👉 Testing: {name}")
    print(f"   URL: {url}")
    try:
        # Connect timeout 5s to fail fast
        engine = create_engine(url, connect_args={"connect_timeout": 5, "sslmode": "require"})
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print(f"✅ SUCCESS: {name} connected!\n")
            success_url = url
            # Prefer DIRECT for stability if needed, or POOLER if working. 
            # We will stop at the first success.
            break 
    except Exception as e:
        print(f"❌ FAILED: {name}")
        print(f"   Error: {e}\n")

if success_url:
    print(f"🏆 FOUND WORKING URL: {success_url}")
    with open("success.txt", "w") as f:
        f.write(success_url)
    sys.exit(0)
else:
    print("💀 ALL CONNECTIONS FAILED.")
    sys.exit(1)
