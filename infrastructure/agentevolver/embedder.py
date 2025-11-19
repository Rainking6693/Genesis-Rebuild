"""
Task Embedder - Generate embeddings for task descriptions

Uses OpenAI text-embedding-3-small model for efficient semantic
similarity search in the experience buffer.
"""

import hashlib
import logging
import re
import numpy as np
from typing import Optional

CATEGORY_KEYWORD_MAP = {
    "auth": ["auth", "authentication", "oauth", "jwt", "session", "password"],
    "database": ["database", "sql", "query", "index", "pool", "deadlock"],
    "ui": ["ui", "button", "layout", "css", "dark", "responsive", "dashboard"],
}

logger = logging.getLogger(__name__)


class TaskEmbedder:
    """
    Generate embeddings for task descriptions using OpenAI API.
    
    For local development, provides fallback hashing-based embeddings.
    """

    def __init__(self, model: str = "text-embedding-3-small", use_local: bool = False):
        """
        Initialize embedder.
        
        Args:
            model: OpenAI model to use
            use_local: If True, use local hash-based embeddings (no API calls)
        """
        self.model = model
        self.use_local = use_local
        self.client = None
        
        if not use_local:
            try:
                from openai import OpenAI
                self.client = OpenAI()
                logger.info(f"[TaskEmbedder] Initialized with OpenAI model: {model}")
            except ImportError:
                logger.warning(
                    f"[TaskEmbedder] OpenAI client not available, falling back to local embeddings"
                )
                self.use_local = True
        
        if self.use_local:
            logger.info("[TaskEmbedder] Using local hash-based embeddings")

    async def embed(self, text: str) -> np.ndarray:
        """
        Generate embedding for text.
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector (numpy array, shape: (1536,))
        """
        if not self.use_local and self.client:
            try:
                response = self.client.embeddings.create(
                    input=text,
                    model=self.model
                )
                embedding = np.array(response.data[0].embedding, dtype=np.float32)
                return embedding
            except Exception as e:
                logger.warning(f"[TaskEmbedder] OpenAI embedding failed: {e}, using local fallback")
                return self._local_embed(text)
        else:
            return self._local_embed(text)

    def _local_embed(self, text: str) -> np.ndarray:
        """
        Generate local hash-based embedding (1536 dimensions for compatibility).

        Args:
            text: Text to embed

        Returns:
            Deterministic embedding based on text hash
        """
        tokens = re.findall(r"\w+", text.lower())

        if not tokens:
            tokens = [text]

        vector = np.zeros(1536, dtype=np.float32)

        def _add_token(tok: str, weight: float = 1.0) -> None:
            idx = int(hashlib.sha256(tok.encode()).hexdigest(), 16) % 1536
            vector[idx] += weight

        for token in tokens:
            _add_token(token, weight=1.0)

        # Include bi-grams to capture some context
        for first, second in zip(tokens, tokens[1:]):
            _add_token(f"{first}_{second}", weight=0.5)

        lower_text = text.lower()
        for category, keywords in CATEGORY_KEYWORD_MAP.items():
            if any(keyword in lower_text for keyword in keywords):
                _add_token(f"category_{category}", weight=2.0)

        # Fallback if vector is still zero
        norm = np.linalg.norm(vector)
        if norm == 0:
            vector += 1.0
            norm = np.linalg.norm(vector)

        return vector / (norm + 1e-10)

    @staticmethod
    def compute_similarity(emb1: np.ndarray, emb2: np.ndarray) -> float:
        """
        Compute cosine similarity between two embeddings.

        Args:
            emb1: First embedding vector
            emb2: Second embedding vector

        Returns:
            Cosine similarity score in range [-1, 1]
        """
        if emb1.shape != emb2.shape:
            raise ValueError(f"Embedding shapes must match: {emb1.shape} vs {emb2.shape}")

        norm1 = np.linalg.norm(emb1) + 1e-10
        norm2 = np.linalg.norm(emb2) + 1e-10

        similarity = np.dot(emb1, emb2) / (norm1 * norm2)
        return float(np.clip(similarity, -1.0, 1.0))

    @staticmethod
    def compute_similarity_batch(
        query_embedding: np.ndarray,
        embeddings: np.ndarray
    ) -> np.ndarray:
        """
        Compute cosine similarities between query and batch of embeddings.

        Args:
            query_embedding: Query embedding (shape: (1536,))
            embeddings: Batch of embeddings (shape: (n, 1536))

        Returns:
            Similarity scores (shape: (n,))
        """
        if embeddings.size == 0:
            return np.array([])

        # Normalize
        query_normalized = query_embedding / (np.linalg.norm(query_embedding) + 1e-10)
        embeddings_normalized = embeddings / (np.linalg.norm(embeddings, axis=1, keepdims=True) + 1e-10)

        # Cosine similarity
        similarities = np.dot(embeddings_normalized, query_normalized)

        return similarities

    def get_embedding_dimension(self) -> int:
        """Get dimension of embeddings produced by this embedder."""
        return 1536
