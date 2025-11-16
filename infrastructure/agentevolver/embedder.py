"""
Task Embedder - Generate embeddings for task descriptions

Uses OpenAI text-embedding-3-small model for efficient semantic
similarity search in the experience buffer.
"""

import logging
import numpy as np
from typing import Optional

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
        import hashlib

        # Create deterministic hash
        hash_obj = hashlib.sha256(text.encode())
        hash_bytes = hash_obj.digest()

        # Convert to 1536-dim vector for compatibility with OpenAI embeddings
        # Use seed in valid range (0 to 2**32 - 1)
        seed = int.from_bytes(hash_bytes[:4], 'big') % (2**31)
        rng = np.random.RandomState(seed)
        embedding = rng.randn(1536).astype(np.float32)

        # Normalize
        embedding = embedding / (np.linalg.norm(embedding) + 1e-10)

        return embedding

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
