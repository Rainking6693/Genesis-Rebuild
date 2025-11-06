"""
Auto-load .env file for Genesis infrastructure

This module automatically loads environment variables from .env
when any Genesis module is imported. Place this import at the top
of entry point files to ensure configuration is loaded.

Usage:
    from infrastructure.load_env import load_genesis_env
    load_genesis_env()  # Loads .env if exists
"""

import os
from pathlib import Path

_ENV_LOADED = False


def load_genesis_env(env_file: str = ".env", override: bool = False):
    """
    Load environment variables from .env file
    
    Args:
        env_file: Path to .env file (default: ".env" in project root)
        override: Whether to override existing environment variables
    
    Returns:
        Number of variables loaded
    """
    global _ENV_LOADED
    
    if _ENV_LOADED and not override:
        return 0  # Already loaded, skip
    
    # Find project root (where .env is located)
    current_dir = Path(__file__).parent.parent  # infrastructure/ -> genesis-rebuild/
    env_path = current_dir / env_file
    
    if not env_path.exists():
        # Try python-dotenv if available
        try:
            from dotenv import load_dotenv
            success = load_dotenv(env_path, override=override)
            if success:
                _ENV_LOADED = True
            return 0
        except ImportError:
            return 0  # No .env file and no dotenv library
    
    # Manual .env parsing (simple implementation)
    loaded_count = 0
    try:
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                
                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    continue
                
                # Parse KEY=VALUE
                if '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()
                    
                    # Remove quotes if present
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]
                    
                    # Remove inline comments
                    if '#' in value:
                        value = value.split('#')[0].strip()
                    
                    # Set environment variable (if not already set or override=True)
                    if override or key not in os.environ:
                        os.environ[key] = value
                        loaded_count += 1
        
        _ENV_LOADED = True
        
    except Exception as e:
        print(f"Warning: Could not load .env file: {e}")
        return 0
    
    return loaded_count


# Auto-load on import (convenient for infrastructure modules)
load_genesis_env()

