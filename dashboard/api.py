"""Genesis Dashboard API - Receives events and serves data"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import sqlite3
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
from pathlib import Path

app = FastAPI(title="Genesis Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = Path(__file__).parent / "genesis_events.db"

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            event_type TEXT NOT NULL,
            business_name TEXT,
            agent_name TEXT,
            message TEXT,
            data TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS businesses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            status TEXT,
            deployment_url TEXT,
            github_url TEXT,
            revenue REAL DEFAULT 0,
            costs REAL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_events_timestamp
        ON events(timestamp DESC)
    """)

    conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_events_business
        ON events(business_name)
    """)

    conn.commit()
    conn.close()

init_db()

@app.post("/events")
async def receive_event(event: dict):
    """Receive event from Genesis"""
    conn = sqlite3.connect(str(DB_PATH))

    try:
        cursor = conn.execute("""
            INSERT INTO events (timestamp, event_type, business_name, agent_name, message, data)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            event.get("timestamp", datetime.now().isoformat()),
            event.get("type"),
            event.get("business_name"),
            event.get("agent_name"),
            event.get("message"),
            json.dumps(event.get("data", {}))
        ))
        event_id = cursor.lastrowid

        if event.get("business_name"):
            business_name = event["business_name"]
            event_type = event.get("type")
            event_data = event.get("data", {})

            if event_type == "deployment_complete":
                conn.execute("""
                    INSERT OR REPLACE INTO businesses (name, status, deployment_url, github_url, updated_at)
                    VALUES (?, 'live', ?, ?, ?)
                """, (
                    business_name,
                    event_data.get("url"),
                    event_data.get("github"),
                    datetime.now().isoformat()
                ))
            elif event_type in ["deployment_failed", "business_killed"]:
                conn.execute("""
                    INSERT OR IGNORE INTO businesses (name, status, updated_at)
                    VALUES (?, 'failed', ?)
                """, (business_name, datetime.now().isoformat()))

                conn.execute("""
                    UPDATE businesses SET status = 'failed', updated_at = ?
                    WHERE name = ?
                """, (datetime.now().isoformat(), business_name))
            elif event_type == "business_generation_started":
                conn.execute("""
                    INSERT OR IGNORE INTO businesses (name, status, updated_at)
                    VALUES (?, 'building', ?)
                """, (business_name, datetime.now().isoformat()))

        conn.commit()
        return {"status": "received", "event_id": event_id}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/events/recent")
async def get_recent_events(limit: int = 100, business_name: Optional[str] = None):
    """Get recent events"""
    conn = sqlite3.connect(str(DB_PATH))

    if business_name:
        cursor = conn.execute("""
            SELECT * FROM events
            WHERE business_name = ?
            ORDER BY id DESC
            LIMIT ?
        """, (business_name, limit))
    else:
        cursor = conn.execute("""
            SELECT * FROM events
            ORDER BY id DESC
            LIMIT ?
        """, (limit,))

    events = []
    for row in cursor.fetchall():
        events.append({
            "id": row[0],
            "timestamp": row[1],
            "type": row[2],
            "business_name": row[3],
            "agent_name": row[4],
            "message": row[5],
            "data": json.loads(row[6]) if row[6] else {}
        })

    conn.close()
    return events

@app.get("/businesses")
async def get_businesses():
    """Get all businesses"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.execute("""
        SELECT name, status, deployment_url, github_url, revenue, costs, created_at, updated_at
        FROM businesses
        ORDER BY updated_at DESC
    """)

    businesses = []
    for row in cursor.fetchall():
        businesses.append({
            "name": row[0],
            "status": row[1],
            "deployment_url": row[2],
            "github_url": row[3],
            "revenue": row[4],
            "costs": row[5],
            "created_at": row[6],
            "updated_at": row[7]
        })

    conn.close()
    return businesses

@app.get("/agents/status")
async def get_agent_status():
    """Get status of all agents"""
    conn = sqlite3.connect(str(DB_PATH))

    cursor = conn.execute("""
        SELECT agent_name, MAX(timestamp) as last_active, COUNT(*) as event_count
        FROM events
        WHERE agent_name IS NOT NULL
        GROUP BY agent_name
        ORDER BY last_active DESC
    """)

    agents = []
    for row in cursor.fetchall():
        agents.append({
            "name": row[0],
            "last_active": row[1],
            "event_count": row[2],
            "status": "active" if is_recent(row[1]) else "idle"
        })

    conn.close()
    return agents

@app.get("/stats")
async def get_stats():
    """Get overall statistics"""
    conn = sqlite3.connect(str(DB_PATH))

    cursor = conn.execute("""
        SELECT status, COUNT(*)
        FROM businesses
        GROUP BY status
    """)
    status_counts = dict(cursor.fetchall())

    cursor = conn.execute("""
        SELECT SUM(revenue), SUM(costs)
        FROM businesses
    """)
    revenue, costs = cursor.fetchone()

    yesterday = (datetime.now() - timedelta(days=1)).isoformat()
    cursor = conn.execute("""
        SELECT COUNT(*)
        FROM events
        WHERE timestamp > ?
    """, (yesterday,))
    recent_events = cursor.fetchone()[0]

    conn.close()

    return {
        "businesses": {
            "live": status_counts.get("live", 0),
            "building": status_counts.get("building", 0),
            "failed": status_counts.get("failed", 0),
            "total": sum(status_counts.values())
        },
        "revenue": revenue or 0,
        "costs": costs or 0,
        "profit": (revenue or 0) - (costs or 0),
        "events_24h": recent_events
    }

def is_recent(timestamp_str: str, minutes: int = 5) -> bool:
    """Check if timestamp is recent"""
    try:
        ts = datetime.fromisoformat(timestamp_str)
        return datetime.now() - ts < timedelta(minutes=minutes)
    except:
        return False

@app.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

dashboard_dir = Path(__file__).parent / "static"
dashboard_dir.mkdir(exist_ok=True)

@app.get("/")
async def serve_dashboard():
    """Serve dashboard"""
    index_file = dashboard_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "Dashboard API running. Frontend at /static/index.html"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
