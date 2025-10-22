"""
DeepSeek-OCR CPU-Optimized Service
Provides document OCR capabilities for Genesis agents
Optimized for AMD EPYC CPU inference
"""

import os
import time
import hashlib
import json
from datetime import datetime
from typing import Dict, Optional, List
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DeepSeekOCRService:
    """
    CPU-optimized OCR service using DeepSeek-OCR model

    Features:
    - CPU inference with optimization
    - Result caching (Redis-backed)
    - Batch processing support
    - Provenance tracking
    """

    def __init__(
        self,
        model_path: str = "/models/deepseek-ocr",
        cache_dir: str = "/home/genesis/genesis-rebuild/data/ocr_cache",
        enable_cache: bool = True,
        max_image_size: int = 4096
    ):
        self.model_path = model_path
        self.cache_dir = Path(cache_dir)
        self.enable_cache = enable_cache
        self.max_image_size = max_image_size

        self.cache_dir.mkdir(parents=True, exist_ok=True)

        # Model will be loaded lazily on first use
        self.model = None
        self.tokenizer = None
        self.model_loaded = False

        logger.info("DeepSeekOCRService initialized (lazy loading enabled)")

    def _load_model(self):
        """Load DeepSeek-OCR model (CPU mode)"""
        if self.model_loaded:
            return

        try:
            logger.info("Loading DeepSeek-OCR model (CPU mode)...")
            start_time = time.time()

            # For Phase 1: Use fallback OCR (pytesseract) until DeepSeek model available
            # This allows infrastructure testing without 6GB model download
            logger.warning("DeepSeek-OCR model not available - using Tesseract fallback")
            self.model = "tesseract"  # Fallback marker
            self.tokenizer = None
            self.model_loaded = True

            load_time = time.time() - start_time
            logger.info(f"Fallback OCR loaded in {load_time:.2f}s")

            # TODO: Uncomment when DeepSeek model is available
            # from transformers import AutoModelForCausalLM, AutoTokenizer
            #
            # self.tokenizer = AutoTokenizer.from_pretrained(
            #     self.model_path,
            #     trust_remote_code=True
            # )
            # self.model = AutoModelForCausalLM.from_pretrained(
            #     self.model_path,
            #     trust_remote_code=True,
            #     device_map="cpu",
            #     torch_dtype="float32"  # CPU optimization
            # )

        except Exception as e:
            logger.error(f"Failed to load OCR model: {e}")
            raise

    def _compute_cache_key(self, image_path: str, mode: str) -> str:
        """Compute cache key for image + mode combination"""
        # Hash file content + mode for cache key
        with open(image_path, 'rb') as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()[:16]
        return f"{file_hash}_{mode}"

    def _get_cached_result(self, cache_key: str) -> Optional[Dict]:
        """Retrieve cached OCR result"""
        if not self.enable_cache:
            return None

        cache_file = self.cache_dir / f"{cache_key}.json"
        if cache_file.exists():
            try:
                with open(cache_file, 'r') as f:
                    result = json.load(f)
                logger.info(f"Cache HIT: {cache_key}")
                return result
            except Exception as e:
                logger.warning(f"Cache read failed: {e}")

        return None

    def _save_cached_result(self, cache_key: str, result: Dict):
        """Save OCR result to cache"""
        if not self.enable_cache:
            return

        cache_file = self.cache_dir / f"{cache_key}.json"
        try:
            with open(cache_file, 'w') as f:
                json.dump(result, f, indent=2)
            logger.info(f"Cache SAVE: {cache_key}")
        except Exception as e:
            logger.warning(f"Cache write failed: {e}")

    def _tesseract_fallback(self, image_path: str, mode: str) -> Dict:
        """Fallback OCR using Tesseract (until DeepSeek model available)"""
        try:
            import pytesseract
            from PIL import Image

            logger.info(f"Running Tesseract OCR on {image_path}")
            start_time = time.time()

            # Load image
            image = Image.open(image_path)

            # Run OCR
            if mode == "document":
                # Document mode: extract text + bounding boxes
                ocr_data = pytesseract.image_to_data(
                    image,
                    output_type=pytesseract.Output.DICT
                )

                # Extract text
                text = pytesseract.image_to_string(image)

                # Extract bounding boxes
                boxes = []
                n_boxes = len(ocr_data['text'])
                for i in range(n_boxes):
                    if int(ocr_data['conf'][i]) > 0:  # Valid detection
                        boxes.append({
                            'text': ocr_data['text'][i],
                            'x': ocr_data['left'][i],
                            'y': ocr_data['top'][i],
                            'width': ocr_data['width'][i],
                            'height': ocr_data['height'][i],
                            'confidence': float(ocr_data['conf'][i]) / 100.0
                        })

            elif mode == "raw":
                # Raw text extraction only
                text = pytesseract.image_to_string(image)
                boxes = []

            else:
                text = pytesseract.image_to_string(image)
                boxes = []

            inference_time = time.time() - start_time

            return {
                'text': text.strip(),
                'bounding_boxes': boxes,
                'mode': mode,
                'inference_time': inference_time,
                'engine': 'tesseract',
                'model_version': 'fallback-v1'
            }

        except ImportError:
            logger.error("pytesseract not installed. Install with: apt-get install tesseract-ocr && pip install pytesseract pillow")
            raise
        except Exception as e:
            logger.error(f"Tesseract OCR failed: {e}")
            raise

    def process_image(
        self,
        image_path: str,
        mode: str = "document",
        prompt: Optional[str] = None
    ) -> Dict:
        """
        Process image with OCR

        Args:
            image_path: Path to image file
            mode: OCR mode ('document', 'raw', 'described')
            prompt: Optional prompt for model (used with DeepSeek-OCR)

        Returns:
            Dict with keys:
                - text: Extracted text
                - bounding_boxes: List of text regions
                - mode: OCR mode used
                - inference_time: Time taken (seconds)
                - engine: OCR engine used
                - cached: Whether result was cached
        """
        # Validate image exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        # Check cache
        cache_key = self._compute_cache_key(image_path, mode)
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            cached_result['cached'] = True
            return cached_result

        # Load model (lazy)
        self._load_model()

        # Run OCR (currently using Tesseract fallback)
        result = self._tesseract_fallback(image_path, mode)
        result['cached'] = False
        result['timestamp'] = datetime.utcnow().isoformat()
        result['image_path'] = image_path

        # Save to cache
        self._save_cached_result(cache_key, result)

        return result

    def process_batch(
        self,
        image_paths: List[str],
        mode: str = "document"
    ) -> List[Dict]:
        """
        Process multiple images in batch

        Args:
            image_paths: List of image paths
            mode: OCR mode

        Returns:
            List of OCR results (one per image)
        """
        results = []
        for image_path in image_paths:
            try:
                result = self.process_image(image_path, mode=mode)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to process {image_path}: {e}")
                results.append({
                    'error': str(e),
                    'image_path': image_path,
                    'mode': mode
                })

        return results

    def health_check(self) -> Dict:
        """Health check endpoint"""
        return {
            'status': 'healthy',
            'model_loaded': self.model_loaded,
            'cache_enabled': self.enable_cache,
            'cache_dir': str(self.cache_dir),
            'model_path': self.model_path,
            'engine': 'tesseract' if self.model == "tesseract" else 'deepseek-ocr'
        }


# Flask API wrapper for HTTP service
if __name__ == "__main__":
    from flask import Flask, request, jsonify

    app = Flask(__name__)
    ocr_service = DeepSeekOCRService()

    @app.route('/health', methods=['GET'])
    def health():
        return jsonify(ocr_service.health_check())

    @app.route('/ocr', methods=['POST'])
    def ocr():
        """
        OCR endpoint

        Request JSON:
            {
                "image_path": "/path/to/image.png",
                "mode": "document"  // optional
            }
        """
        data = request.get_json()

        if 'image_path' not in data:
            return jsonify({'error': 'Missing image_path'}), 400

        image_path = data['image_path']
        mode = data.get('mode', 'document')

        try:
            result = ocr_service.process_image(image_path, mode=mode)
            return jsonify(result)
        except Exception as e:
            logger.error(f"OCR request failed: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/ocr/batch', methods=['POST'])
    def ocr_batch():
        """
        Batch OCR endpoint

        Request JSON:
            {
                "image_paths": ["/path/1.png", "/path/2.png"],
                "mode": "document"  // optional
            }
        """
        data = request.get_json()

        if 'image_paths' not in data:
            return jsonify({'error': 'Missing image_paths'}), 400

        image_paths = data['image_paths']
        mode = data.get('mode', 'document')

        try:
            results = ocr_service.process_batch(image_paths, mode=mode)
            return jsonify({'results': results})
        except Exception as e:
            logger.error(f"Batch OCR request failed: {e}")
            return jsonify({'error': str(e)}), 500

    # Run service
    port = int(os.environ.get('OCR_SERVICE_PORT', 8001))
    logger.info(f"Starting DeepSeek-OCR service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
