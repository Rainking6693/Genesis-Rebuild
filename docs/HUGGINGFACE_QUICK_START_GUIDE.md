# Hugging Face Quick Start Guide for Genesis

**Date:** November 4, 2025
**Author:** Claude (Implementation Agent)
**Purpose:** Step-by-step guide to integrate Hugging Face models into Genesis

---

## Prerequisites

```bash
# Install HF libraries
pip install transformers accelerate sentencepiece protobuf
pip install huggingface-hub datasets
pip install text-generation  # For TGI client
pip install sentence-transformers  # For embeddings

# Login to HF (get token from https://huggingface.co/settings/tokens)
huggingface-cli login
```

---

## Quick Win #1: Deploy DeepSeek-R1 for Analyst Agent

### Step 1: Local Deployment

```python
# File: infrastructure/huggingface/deepseek_analyst.py

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from typing import Dict, Any, Optional

class DeepSeekAnalyst:
    """
    DeepSeek-R1-32B integration for Analyst Agent.

    Cost: $0/month (self-hosted)
    Context: 128K tokens
    Latency: ~2-3s for 500 token response
    """

    def __init__(
        self,
        model_name: str = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        device: str = "auto",
        load_in_4bit: bool = True
    ):
        self.model_name = model_name
        self.device = device

        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

        # Load model with 4-bit quantization for memory efficiency
        if load_in_4bit:
            from transformers import BitsAndBytesConfig

            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4"
            )

            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                quantization_config=quantization_config,
                device_map=device,
                torch_dtype=torch.float16,
                trust_remote_code=True
            )
        else:
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                device_map=device,
                torch_dtype=torch.float16,
                trust_remote_code=True
            )

    def analyze(
        self,
        prompt: str,
        max_new_tokens: int = 2048,
        temperature: float = 0.7,
        top_p: float = 0.9
    ) -> str:
        """
        Analyze a complex task using DeepSeek-R1.

        Args:
            prompt: Analysis task prompt
            max_new_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold

        Returns:
            Generated analysis
        """
        # Format prompt with DeepSeek template
        formatted_prompt = self._format_prompt(prompt)

        # Tokenize
        inputs = self.tokenizer(
            formatted_prompt,
            return_tensors="pt",
            truncation=True,
            max_length=128000  # 128K context
        ).to(self.model.device)

        # Generate
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )

        # Decode
        response = self.tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[1]:],
            skip_special_tokens=True
        )

        return response.strip()

    def _format_prompt(self, prompt: str) -> str:
        """Format prompt with DeepSeek system template."""
        return f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert analyst agent in the Genesis multi-agent system. Provide thorough, accurate analysis with clear reasoning.

<|eot_id|><|start_header_id|>user<|end_header_id|>

{prompt}

<|eot_id|><|start_header_id|>assistant<|end_header_id|>

"""


# Usage example
if __name__ == "__main__":
    analyst = DeepSeekAnalyst(load_in_4bit=True)

    result = analyst.analyze(
        prompt="Analyze the technical architecture of a multi-agent orchestration system with error handling and observability.",
        max_new_tokens=1024
    )

    print("Analysis:", result)
```

### Step 2: Integration with Genesis Agents

```python
# File: infrastructure/agents/analyst_agent.py (modify existing)

from infrastructure.huggingface.deepseek_analyst import DeepSeekAnalyst

class AnalystAgent:
    def __init__(self, use_local_model: bool = True):
        self.use_local_model = use_local_model

        if use_local_model:
            self.deepseek = DeepSeekAnalyst(load_in_4bit=True)
        else:
            # Fallback to API
            self.client = OpenAI()  # or Anthropic

    async def analyze_task(self, task: str) -> str:
        if self.use_local_model:
            # Use DeepSeek-R1 (free)
            return self.deepseek.analyze(task)
        else:
            # Fallback to API (costs money)
            return await self.api_analyze(task)
```

### Step 3: Test and Validate

```python
# File: tests/test_deepseek_analyst.py

import pytest
from infrastructure.huggingface.deepseek_analyst import DeepSeekAnalyst

@pytest.mark.integration
def test_deepseek_analyst_quality():
    """Test DeepSeek-R1 vs. GPT-4o quality."""
    analyst = DeepSeekAnalyst(load_in_4bit=True)

    test_prompts = [
        "Explain the benefits of hierarchical task decomposition in agent systems.",
        "Analyze the cost-benefit tradeoffs of fine-tuning vs. prompting.",
        "What are the security implications of dynamic agent creation?"
    ]

    for prompt in test_prompts:
        response = analyst.analyze(prompt, max_new_tokens=512)

        # Quality checks
        assert len(response) > 100, "Response too short"
        assert "reasoning" in response.lower() or "because" in response.lower(), "Lacks reasoning"

        print(f"\nPrompt: {prompt}")
        print(f"Response: {response[:200]}...")

@pytest.mark.integration
def test_deepseek_latency():
    """Test inference latency."""
    import time

    analyst = DeepSeekAnalyst(load_in_4bit=True)

    start = time.time()
    response = analyst.analyze(
        "What is machine learning?",
        max_new_tokens=100
    )
    elapsed = time.time() - start

    print(f"Latency: {elapsed:.2f}s for {len(response.split())} words")

    # Should be <5s for short responses
    assert elapsed < 5.0, f"Latency too high: {elapsed:.2f}s"
```

---

## Quick Win #2: Fine-Tune Qwen-2.5-7B for HALO Routing

### Step 1: Export HALO Routing Decisions

```python
# File: scripts/export_halo_routing_data.py

import json
from pathlib import Path
from datetime import datetime, timedelta
from infrastructure.halo_router import HALORouter
from infrastructure.observability import get_observability_manager

def export_routing_decisions(
    output_path: str = "data/halo_routing_training.jsonl",
    days: int = 30,
    min_confidence: float = 0.8
):
    """
    Export HALO routing decisions as training data.

    Format:
    {
        "prompt": "Route request: Build login page\nRequirements: Fast, secure",
        "completion": "Builder Agent",
        "metadata": {
            "confidence": 0.95,
            "success": true,
            "timestamp": "2025-11-04T10:30:00Z"
        }
    }
    """
    obs = get_observability_manager()

    # Query OTEL traces for routing decisions
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=days)

    routing_traces = obs.query_traces(
        span_name="halo_router.route_request",
        start_time=start_time,
        end_time=end_time
    )

    training_examples = []

    for trace in routing_traces:
        # Extract routing info
        request = trace.attributes.get("request")
        selected_agent = trace.attributes.get("selected_agent")
        confidence = trace.attributes.get("confidence", 0.0)
        success = trace.attributes.get("success", False)

        # Filter by quality
        if confidence < min_confidence or not success:
            continue

        # Format training example
        example = {
            "prompt": f"Route request: {request['task']}\nRequirements: {request['requirements']}",
            "completion": selected_agent,
            "metadata": {
                "confidence": confidence,
                "success": success,
                "timestamp": trace.start_time.isoformat()
            }
        }

        training_examples.append(example)

    # Save to JSONL
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        for example in training_examples:
            f.write(json.dumps(example) + "\n")

    print(f"Exported {len(training_examples)} routing examples to {output_path}")

    return output_path


if __name__ == "__main__":
    export_routing_decisions(days=30, min_confidence=0.8)
```

### Step 2: Fine-Tune with Unsloth

```python
# File: scripts/finetune_halo_router.py

from infrastructure.finetune.unsloth_pipeline import UnslothPipeline
from datasets import load_dataset

def finetune_halo_router():
    """Fine-tune Qwen-2.5-7B for HALO routing."""

    # Initialize pipeline
    pipeline = UnslothPipeline(
        output_dir="/home/genesis/models/halo-routing-v1"
    )

    # Load model
    model, tokenizer = pipeline.load_model_4bit(
        model_name="qwen-2.5-7b",  # Maps to Qwen/Qwen2.5-7B-Instruct
        use_gradient_checkpointing=True,
        max_seq_length=2048
    )

    # Prepare QLoRA
    qlora_config = pipeline.prepare_qlora_config(
        rank=16,
        alpha=32,
        dropout=0.05
    )

    model = pipeline.prepare_model_for_training(model, qlora_config)

    # Load training data
    dataset = load_dataset("json", data_files="data/halo_routing_training.jsonl")["train"]

    # Format dataset
    def format_example(example):
        return {
            "text": f"### Instruction:\n{example['prompt']}\n\n### Response:\n{example['completion']}"
        }

    dataset = dataset.map(format_example)

    # Train
    result = pipeline.train(
        model=model,
        tokenizer=tokenizer,
        dataset=dataset,
        qlora_config=qlora_config,
        agent_name="halo-routing-v1"
    )

    print(f"Training complete!")
    print(f"  Training loss: {result.training_loss:.4f}")
    print(f"  Training time: {result.training_time_seconds:.2f}s")
    print(f"  Peak memory: {result.peak_memory_mb:.2f}MB")
    print(f"  Model saved: {result.model_path}")

    return result


if __name__ == "__main__":
    finetune_halo_router()
```

### Step 3: Deploy and Test

```python
# File: infrastructure/halo_router.py (modify)

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class HALORouter:
    def __init__(self, use_finetuned: bool = False):
        self.use_finetuned = use_finetuned

        if use_finetuned:
            # Load fine-tuned routing model
            model_path = "/home/genesis/models/halo-routing-v1/final_model"
            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForCausalLM.from_pretrained(
                model_path,
                device_map="auto",
                load_in_4bit=True
            )

    async def route_request(self, request: Dict[str, Any]) -> str:
        if self.use_finetuned:
            # Use fine-tuned model (fast, cheap)
            return self._route_with_finetuned(request)
        else:
            # Use logic-based routing (current method)
            return self._route_with_logic(request)

    def _route_with_finetuned(self, request: Dict[str, Any]) -> str:
        prompt = f"Route request: {request['task']}\nRequirements: {request.get('requirements', 'None')}"

        formatted = f"### Instruction:\n{prompt}\n\n### Response:\n"

        inputs = self.tokenizer(formatted, return_tensors="pt").to(self.model.device)

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=20,  # Agent name is short
                temperature=0.1,  # Low temp for deterministic routing
                do_sample=False
            )

        response = self.tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[1]:],
            skip_special_tokens=True
        )

        # Extract agent name (e.g., "Builder Agent")
        agent_name = response.strip().split("\n")[0]

        return agent_name
```

---

## Quick Win #3: Deploy HF Inference Endpoint

### Step 1: Create Endpoint via CLI

```bash
# Install HF CLI
pip install --upgrade huggingface_hub[cli]

# Login
huggingface-cli login

# Create endpoint for Qwen-2.5-72B
huggingface-cli endpoint create \
  --name genesis-analyst-agent \
  --repository Qwen/Qwen2.5-72B-Instruct \
  --accelerator gpu \
  --instance-size x1 \
  --region us-east-1 \
  --vendor aws \
  --task text-generation
```

### Step 2: Python Client

```python
# File: infrastructure/huggingface/inference_endpoint_client.py

from typing import Dict, Any, List, Optional
import httpx
import os

class HFInferenceEndpointClient:
    """
    Client for Hugging Face Inference Endpoints.

    Pricing:
        - GPU (T4): $0.60/hour
        - Auto-scaling: Scale to zero when idle
        - Expected: $100-200/month with 50% idle time
    """

    def __init__(
        self,
        endpoint_url: Optional[str] = None,
        api_token: Optional[str] = None
    ):
        self.endpoint_url = endpoint_url or os.getenv("HF_ENDPOINT_URL")
        self.api_token = api_token or os.getenv("HF_API_TOKEN")

        if not self.endpoint_url or not self.api_token:
            raise ValueError("HF_ENDPOINT_URL and HF_API_TOKEN required")

        self.client = httpx.AsyncClient(timeout=30.0)

    async def generate(
        self,
        prompt: str,
        max_new_tokens: int = 512,
        temperature: float = 0.7,
        top_p: float = 0.9,
        stream: bool = False
    ) -> str:
        """
        Generate text using HF Inference Endpoint.

        Args:
            prompt: Input prompt
            max_new_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold
            stream: Whether to stream response

        Returns:
            Generated text
        """
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_new_tokens,
                "temperature": temperature,
                "top_p": top_p,
                "return_full_text": False
            }
        }

        response = await self.client.post(
            self.endpoint_url,
            headers=headers,
            json=payload
        )

        response.raise_for_status()

        result = response.json()

        if isinstance(result, list) and len(result) > 0:
            return result[0]["generated_text"]
        elif isinstance(result, dict):
            return result["generated_text"]
        else:
            raise ValueError(f"Unexpected response format: {result}")

    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()


# Usage
async def main():
    async with HFInferenceEndpointClient() as client:
        response = await client.generate(
            prompt="Explain multi-agent systems in 3 sentences.",
            max_new_tokens=100
        )
        print(response)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### Step 3: Integration with Genesis

```python
# File: infrastructure/hybrid_llm_client.py (modify)

from infrastructure.huggingface.inference_endpoint_client import HFInferenceEndpointClient

class HybridLLMClient:
    def __init__(self):
        # Priority order: Local → HF Endpoint → OpenAI/Anthropic
        self.local_client = LocalLLMClient()
        self.hf_endpoint = HFInferenceEndpointClient()
        self.openai_client = OpenAI()

    async def complete_text(self, prompt: str) -> str:
        try:
            # Try local first (free)
            return await self.local_client.generate(prompt)
        except Exception as e1:
            logger.warning(f"Local LLM failed: {e1}")

            try:
                # Try HF Endpoint (cheap)
                return await self.hf_endpoint.generate(prompt)
            except Exception as e2:
                logger.warning(f"HF Endpoint failed: {e2}")

                # Fallback to API (expensive but reliable)
                return await self.openai_client.complete(prompt)
```

---

## Quick Win #4: Deploy Text Embeddings Inference (TEI)

### Step 1: Docker Deployment

```bash
# File: scripts/deploy_tei.sh

#!/bin/bash

# Deploy TEI for embeddings
docker run -d \
  --name genesis-embeddings \
  -p 8080:80 \
  -v /data/embeddings:/data \
  --gpus all \
  ghcr.io/huggingface/text-embeddings-inference:latest \
  --model-id nomic-ai/nomic-embed-text-v1.5 \
  --dtype float16 \
  --pooling mean

echo "TEI deployed at http://localhost:8080"
echo "Health check: curl http://localhost:8080/health"
```

### Step 2: Python Client

```python
# File: infrastructure/huggingface/tei_client.py

import httpx
from typing import List, Union
import numpy as np

class TEIClient:
    """
    Text Embeddings Inference (TEI) client.

    Performance:
        - 2,000 embeddings/sec on 1x GPU
        - <10ms latency
        - Zero API costs (self-hosted)
    """

    def __init__(self, endpoint: str = "http://localhost:8080"):
        self.endpoint = endpoint
        self.client = httpx.AsyncClient(timeout=10.0)

    async def embed(self, texts: Union[str, List[str]]) -> np.ndarray:
        """
        Generate embeddings for text(s).

        Args:
            texts: Single text or list of texts

        Returns:
            Numpy array of embeddings (shape: [N, 768])
        """
        if isinstance(texts, str):
            texts = [texts]

        response = await self.client.post(
            f"{self.endpoint}/embed",
            json={"inputs": texts}
        )

        response.raise_for_status()

        embeddings = response.json()

        return np.array(embeddings)

    async def close(self):
        await self.client.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.close()


# Usage
async def main():
    async with TEIClient() as tei:
        texts = [
            "Multi-agent systems enable autonomous task execution",
            "Hierarchical planning improves decomposition accuracy"
        ]

        embeddings = await tei.embed(texts)

        print(f"Embeddings shape: {embeddings.shape}")  # (2, 768)

        # Compute similarity
        similarity = np.dot(embeddings[0], embeddings[1]) / (
            np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1])
        )
        print(f"Similarity: {similarity:.4f}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### Step 3: Integration with Hybrid RAG

```python
# File: infrastructure/memory/agentic_rag.py (modify)

from infrastructure.huggingface.tei_client import TEIClient

class HybridRAGRetriever:
    def __init__(self):
        # Use TEI for embeddings (free, fast)
        self.embedder = TEIClient(endpoint="http://localhost:8080")

        # Connect to vector database
        self.vector_db = VectorDatabase()
        self.graph_db = GraphDatabase()

    async def embed_and_store(self, texts: List[str]):
        """Embed texts and store in vector DB."""
        embeddings = await self.embedder.embed(texts)

        await self.vector_db.store(texts, embeddings)

    async def retrieve(self, query: str, top_k: int = 5):
        """Retrieve relevant documents using hybrid search."""
        # Embed query
        query_embedding = await self.embedder.embed(query)

        # Vector search
        vector_results = await self.vector_db.search(
            query_embedding[0],
            top_k=top_k
        )

        # Graph search (relationships)
        graph_results = await self.graph_db.search(query, limit=top_k)

        # Merge results
        return self._merge_results(vector_results, graph_results)
```

---

## Monitoring and Cost Tracking

### Cost Tracker

```python
# File: infrastructure/huggingface/cost_tracker.py

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List

@dataclass
class ModelUsage:
    model_name: str
    request_count: int
    total_tokens: int
    total_cost: float
    timestamp: datetime

class HFCostTracker:
    """
    Track costs for HF Inference Endpoints.

    Pricing:
        - GPU (T4): $0.60/hour
        - Auto-scaling: Pay only for uptime
    """

    def __init__(self):
        self.usage: Dict[str, List[ModelUsage]] = {}

    def log_request(
        self,
        model_name: str,
        tokens: int,
        duration_seconds: float
    ):
        """Log a request for cost tracking."""
        # Calculate cost (assuming GPU hourly rate)
        cost_per_second = 0.60 / 3600  # $0.60/hour
        cost = cost_per_second * duration_seconds

        if model_name not in self.usage:
            self.usage[model_name] = []

        self.usage[model_name].append(ModelUsage(
            model_name=model_name,
            request_count=1,
            total_tokens=tokens,
            total_cost=cost,
            timestamp=datetime.utcnow()
        ))

    def get_daily_cost(self, model_name: str) -> float:
        """Get daily cost for a model."""
        if model_name not in self.usage:
            return 0.0

        today = datetime.utcnow().date()

        return sum(
            usage.total_cost
            for usage in self.usage[model_name]
            if usage.timestamp.date() == today
        )

    def get_monthly_cost(self) -> float:
        """Get total monthly cost across all models."""
        total = 0.0

        for usages in self.usage.values():
            total += sum(usage.total_cost for usage in usages)

        return total
```

---

## Testing Script

```python
# File: scripts/test_hf_integration.py

import asyncio
import time
from infrastructure.huggingface.deepseek_analyst import DeepSeekAnalyst
from infrastructure.huggingface.inference_endpoint_client import HFInferenceEndpointClient
from infrastructure.huggingface.tei_client import TEIClient

async def test_all_components():
    """Test all HF integrations."""

    print("=" * 60)
    print("TESTING HUGGING FACE INTEGRATIONS")
    print("=" * 60)

    # Test 1: DeepSeek-R1 Local
    print("\n[1/3] Testing DeepSeek-R1 (Local)...")
    try:
        analyst = DeepSeekAnalyst(load_in_4bit=True)

        start = time.time()
        response = analyst.analyze(
            "What are the key benefits of multi-agent systems?",
            max_new_tokens=200
        )
        elapsed = time.time() - start

        print(f"✓ DeepSeek-R1 OK - {elapsed:.2f}s")
        print(f"  Response: {response[:100]}...")
    except Exception as e:
        print(f"✗ DeepSeek-R1 FAILED: {e}")

    # Test 2: HF Inference Endpoint
    print("\n[2/3] Testing HF Inference Endpoint...")
    try:
        async with HFInferenceEndpointClient() as client:
            start = time.time()
            response = await client.generate(
                "Explain embeddings in one sentence.",
                max_new_tokens=50
            )
            elapsed = time.time() - start

            print(f"✓ HF Endpoint OK - {elapsed:.2f}s")
            print(f"  Response: {response}")
    except Exception as e:
        print(f"✗ HF Endpoint FAILED: {e}")

    # Test 3: TEI Embeddings
    print("\n[3/3] Testing TEI Embeddings...")
    try:
        async with TEIClient() as tei:
            start = time.time()
            embeddings = await tei.embed([
                "Test sentence 1",
                "Test sentence 2"
            ])
            elapsed = time.time() - start

            print(f"✓ TEI OK - {elapsed:.2f}s")
            print(f"  Embeddings shape: {embeddings.shape}")
    except Exception as e:
        print(f"✗ TEI FAILED: {e}")

    print("\n" + "=" * 60)
    print("INTEGRATION TESTS COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_all_components())
```

---

## Deployment Checklist

### Week 1 (Quick Wins)

- [ ] Install HF libraries (`pip install transformers accelerate huggingface-hub`)
- [ ] Set HF API token (`huggingface-cli login`)
- [ ] Deploy DeepSeek-R1 locally for Analyst Agent
- [ ] Test: 40% cost reduction validation
- [ ] Create HF Inference Endpoint for overflow
- [ ] Test: Latency and availability
- [ ] Export HALO routing decisions (30 days)
- [ ] Fine-tune Qwen-2.5-7B for routing
- [ ] A/B test: Fine-tuned vs. logic-based routing
- [ ] Document: Deployment process and results

### Week 2 (Embeddings + RAG)

- [ ] Deploy TEI for embeddings
- [ ] Integrate with Hybrid RAG
- [ ] Test: Embedding quality vs. OpenAI
- [ ] Migrate: All embeddings to TEI
- [ ] Validate: Zero embedding API costs

### Weeks 3-4 (Full Migration)

- [ ] Fine-tune 4 agent-specific models
- [ ] Deploy all models to HF Endpoints
- [ ] Configure auto-scaling policies
- [ ] Set up cost monitoring
- [ ] 48-hour production validation
- [ ] Document: Complete HF integration guide

---

## Support

For questions or issues:
- **HF Documentation:** https://huggingface.co/docs
- **Genesis Team:** Slack #hf-integration
- **Model Issues:** Create issue in repo with `[HF]` prefix

---

**Last Updated:** November 4, 2025
**Next Review:** December 1, 2025 (post-deployment)
