"""
Web + Image Search Tools for DeepEyesV2
========================================

Provides search helpers used by Research and Computer Use agents.
"""

from __future__ import annotations

import random
from typing import Dict, List


def search_web(query: str) -> Dict[str, List[str]]:
    return {
        "links": [f"https://example.com/{query.replace(' ', '_')}/{i}" for i in range(3)],
        "images": [f"https://images.example.com/{query}_{i}.jpg" for i in range(2)],
        "videos": [f"https://video.example.com/watch/{i}" for i in range(2)],
    }


def image_search(query: str) -> List[Dict[str, str]]:
    return [
        {"url": f"https://images.search/{query}_{i}.png", "caption": f"{query} sample {i}"}
        for i in range(3)
    ]


def video_search(query: str) -> List[Dict[str, str]]:
    return [
        {"url": f"https://videos.search/{query}_{i}.mp4", "duration": f"{random.randint(30, 120)}s"}
        for i in range(2)
    ]
