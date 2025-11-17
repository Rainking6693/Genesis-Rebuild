"""
Memoryos stub for Genesis integration.
Temporary implementation to unblock testing.
"""


class Memoryos:
    """Stub implementation of MemoryOS for testing."""

    def __init__(self, *args, **kwargs):
        """Initialize stub MemoryOS."""
        self.short_term = []
        self.mid_term = []
        self.long_term = {}

    def add(self, content, memory_type="short"):
        """Add content to memory."""
        if memory_type == "short":
            self.short_term.append(content)
        elif memory_type == "mid":
            self.mid_term.append(content)
        else:
            self.long_term[str(len(self.long_term))] = content
        return True

    def retrieve(self, query, k=5):
        """Retrieve from memory."""
        # Simple stub - return last k items
        return self.short_term[-k:] if len(self.short_term) >= k else self.short_term

    def clear(self):
        """Clear all memory."""
        self.short_term = []
        self.mid_term = []
        self.long_term = {}


__all__ = ["Memoryos"]
