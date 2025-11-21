# Genesis Rebuild WSGI Configuration for PythonAnywhere
# Auto-generated from deploy-clean branch deployment

import sys
import os

# Add project to path
project_home = '/home/rainking6693/genesis-rebuild'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add venv to path
venv_path = '/home/rainking6693/genesis-rebuild/venv/lib/python3.12/site-packages'
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

# Set environment variables
os.environ.setdefault('GENESIS_ENV', 'production')
os.environ.setdefault('ENVIRONMENT', 'production')
os.environ.setdefault('PYTHONPATH', project_home)

# Load .env file if it exists
try:
    from dotenv import load_dotenv
    env_path = os.path.join(project_home, '.env')
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print("✓ Loaded .env file")
except ImportError:
    print("⚠ python-dotenv not available")

# Import application with fallback chain
try:
    # Try dashboard backend first (recommended)
    from genesis_dashboard.backend.api import app as application
    print("✓ Loaded Genesis Dashboard API")
except ImportError as e:
    print(f"⚠ Dashboard import failed: {e}")
    try:
        # Fallback to A2A FastAPI service
        from a2a_fastapi import app as application
        print("✓ Loaded A2A FastAPI Service")
    except ImportError as e2:
        print(f"⚠ A2A FastAPI import failed: {e2}")
        try:
            # Fallback to A2A service
            from a2a_service import app as application
            print("✓ Loaded A2A Service")
        except ImportError as e3:
            print(f"⚠ A2A service import failed: {e3}")
            # Last resort: simple health check
            from fastapi import FastAPI
            application = FastAPI(title="Genesis Rebuild", version="1.0.0")

            @application.get("/")
            def root():
                return {
                    "status": "ok",
                    "service": "genesis-rebuild",
                    "branch": "deploy-clean",
                    "message": "Dashboard not available - minimal health check active"
                }

            @application.get("/api/health")
            def api_health():
                return {
                    "status": "healthy",
                    "service": "genesis-rebuild",
                    "version": "1.0.0",
                    "branch": "deploy-clean"
                }

            print("⚠ Using fallback health check app")
