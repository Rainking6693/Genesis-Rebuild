"""
Local LLM Client for Genesis Agents

Provides interface to local Qwen2.5-VL-7B-Instruct model for all agent inference.
Zero-cost alternative to cloud APIs.
"""

import logging
import os
import yaml
from typing import Dict, Any, Optional

try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

# Setup logger first
logger = logging.getLogger("local_llm_client")

# Try to import Unsloth for optimization
try:
    import torch
    # Unsloth requires GPU - only import if CUDA is available
    if torch.cuda.is_available():
        from unsloth import FastLanguageModel
        UNSLOTH_AVAILABLE = True
    else:
        # CPU-only system - skip Unsloth
        UNSLOTH_AVAILABLE = False
        logger.info("Unsloth skipped (requires GPU, using CPU offload instead)")
except (ImportError, NotImplementedError):
    UNSLOTH_AVAILABLE = False


class LocalLLMClient:
    """Client for local Qwen2.5-VL-7B-Instruct model."""

    def __init__(self, config_path: str = "config/local_llm_config.yml"):
        self.config = self._load_config(config_path)
        self.model = None
        self.tokenizer = None
        self.device = None
        self.loaded = False

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        try:
            with open(config_path) as f:
                return yaml.safe_load(f)
        except:
            return {"llm_backend": {"model_name": "Qwen/Qwen2.5-VL-7B-Instruct"}}

    def load_model(self) -> bool:
        if not TRANSFORMERS_AVAILABLE:
            return False
        if self.loaded:
            return True

        try:
            model_name = self.config["llm_backend"]["model_name"]
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
            # Use Unsloth for optimized loading if available
            if UNSLOTH_AVAILABLE:
                logger.info("🚀 Loading model with Unsloth optimization...")
                self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                    model_name=model_name,
                    max_seq_length=4096,
                    dtype=None,  # Auto-detect best dtype
                    load_in_4bit=True,  # Use 4-bit quantization for RAM savings
                )
                # Enable CPU offloading for layers
                FastLanguageModel.for_inference(self.model)
                logger.info(f"✅ Model loaded with Unsloth (4-bit, CPU offload) on {self.device}")
            else:
                # Fallback to standard transformers loading
                logger.info("Loading model with standard transformers...")
                self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
                
                # Use CPU offloading even without Unsloth
                self.model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    trust_remote_code=True,
                    device_map="auto",  # Automatically distribute across GPU/CPU
                    load_in_8bit=True if torch.cuda.is_available() else False,  # 8-bit if CUDA available
                    low_cpu_mem_usage=True,  # Enable low CPU memory mode
                    offload_folder="offload",  # Offload to disk if needed
                )
                logger.info(f"✅ Model loaded with CPU offload on {self.device}")
            
            self.loaded = True
            return True
        except Exception as e:
            logger.error(f"Failed to load: {e}")
            return False

    def generate(self, prompt: str, max_new_tokens: int = 2048, **kwargs) -> str:
        if not self.loaded and not self.load_model():
            return "ERROR: Model not loaded"

        try:
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
            with torch.no_grad():
                outputs = self.model.generate(**inputs, max_new_tokens=max_new_tokens, **kwargs)
            return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            return f"ERROR: {e}"

_client = None

def get_local_llm_client():
    global _client
    if _client is None:
        _client = LocalLLMClient()
    return _client
