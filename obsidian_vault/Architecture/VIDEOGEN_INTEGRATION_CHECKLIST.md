---
title: VIDEOGEN AGENT INTEGRATION CHECKLIST - PHASE 6 DAYS 2-6
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/VIDEOGEN_INTEGRATION_CHECKLIST.md
exported: '2025-10-24T22:05:26.932019'
---

# VIDEOGEN AGENT INTEGRATION CHECKLIST - PHASE 6 DAYS 2-6

**Document Status:** Day 1 Foundation Complete
**Created:** October 24, 2025
**Owner:** Nova (Vertex AI/Multimodal Expert)
**Purpose:** Track integration points and dependencies for VideoGen Agent implementation

---

## INTEGRATION POINTS OVERVIEW

VideoGen Agent requires integration with **4 core systems** across Phase 6:

1. **Marketing Agent** (primary consumer, A2A protocol)
2. **kvcached GPU Manager** (resource pooling, 10X throughput)
3. **Planned Diffusion Decoder** (temporal consistency)
4. **SAIL-VL2 Backend** (cost-optimized fallback)

---

## DAY 2-3: VISTA API + PLANNED DIFFUSION INTEGRATION

### Integration A: Planned Diffusion Decoder
**Owner:** Nova (VideoGen) + Cora (Planned Diffusion implementation)
**Timeline:** Days 2-3
**Status:** ⏳ Pending

#### Required Interface:
```python
# infrastructure/planned_diffusion_decoder.py (Cora implementing)
from infrastructure.planned_diffusion_decoder import PlannedDiffusionDecoder

class VideoGenAgent:
    def __init__(self):
        self.diffusion_decoder = PlannedDiffusionDecoder(
            frame_count=30,
            latent_dim=512,
            planning_steps=10
        )

    async def _generate_frames_planned_diffusion(
        self, prompt: str, frame_count: int, model: str
    ) -> List[np.ndarray]:
        # 1. Generate latent plan (keyframe positions in latent space)
        latent_plan = self.diffusion_decoder.plan_latent_trajectory(
            prompt=prompt,
            num_keyframes=frame_count // 5  # 6 keyframes for 30 frames
        )

        # 2. Decode latents to frames (diffusion process)
        frames = await self.diffusion_decoder.decode_frames(
            latent_plan=latent_plan,
            num_frames=frame_count,
            model_backend=model  # "VISTA" or "SAIL-VL2"
        )

        return frames  # List[np.ndarray] shape (H, W, 3)
```

#### Deliverables (Cora):
- [ ] `infrastructure/planned_diffusion_decoder.py` (~300 lines)
- [ ] `plan_latent_trajectory()` method (latent space planning)
- [ ] `decode_frames()` method (diffusion decoding)
- [ ] 8+ unit tests (latent planning, frame decoding, temporal consistency)

#### Integration Tasks (Nova):
- [ ] Import PlannedDiffusionDecoder in `videogen_agent.py`
- [ ] Replace `_generate_frames_planned_diffusion()` stub with real implementation
- [ ] Add error handling for decoder failures (fallback to sequential generation)
- [ ] Validate 30% speed improvement vs. baseline

#### Success Criteria:
- [ ] 30-frame video generation in <7s (30% faster than <10s target)
- [ ] Frame coherence >0.90 (15% improvement over baseline 0.85)
- [ ] Zero memory leaks during decode process

---

### Integration B: VISTA API Client
**Owner:** Nova (VideoGen)
**Timeline:** Days 2-3
**Status:** ⏳ Pending

#### Required Implementation:
```python
# agents/videogen_agent.py
import vertexai
from vertexai.generative_models import GenerativeModel, Part

class VideoGenAgent:
    def __init__(self):
        vertexai.init(project="genesis-rebuild", location="us-central1")
        self.vista_model = GenerativeModel("vista-v1.2")

    async def _call_vista_api(
        self, prompt: str, frame_count: int, config: dict
    ) -> List[str]:
        """
        Call VISTA API and return base64-encoded frames.

        Args:
            prompt: VISTA-optimized prompt
            frame_count: Number of frames to generate
            config: Generation config (guidance_scale, seed, etc.)

        Returns:
            List of base64-encoded frame images
        """
        response = await self.vista_model.generate_content(
            contents=[
                Part.from_text(text=prompt),
                {
                    "config": {
                        "frame_count": frame_count,
                        "resolution": "1920x1080",
                        "guidance_scale": config.get("guidance_scale", 7.5),
                        "seed": config.get("seed", 42),
                        "negative_prompt": "blurry, low quality, distorted"
                    }
                }
            ]
        )

        # Extract frames from response
        frames_base64 = [
            frame["image_base64"]
            for frame in response.predictions[0]["frames"]
        ]

        return frames_base64
```

#### Deliverables (Nova):
- [ ] VISTA API client implementation in `videogen_agent.py`
- [ ] Prompt engineering pipeline (`_engineer_vista_prompt()`)
- [ ] Base64 → numpy array conversion
- [ ] Error handling (rate limits, API failures, retries)

#### Success Criteria:
- [ ] VISTA API calls succeed with 99.9% reliability
- [ ] Exponential backoff handles rate limits gracefully
- [ ] Generated frames match prompt (CLIP similarity >0.90)

---

### Integration C: CLIP Frame Coherence Validation
**Owner:** Nova (VideoGen)
**Timeline:** Days 2-3
**Status:** ⏳ Pending

#### Required Implementation:
```python
# agents/videogen_agent.py
import torch
from transformers import CLIPProcessor, CLIPModel

class VideoGenAgent:
    def __init__(self):
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    def _validate_temporal_coherence(
        self, frames: List[np.ndarray], threshold: float = 0.85
    ) -> dict:
        """
        Validate frame-by-frame consistency using CLIP embeddings.

        Returns:
            {
                "overall_coherence": 0.92,
                "per_frame_scores": [0.94, 0.93, 0.89, ...],
                "flagged_frames": [12, 13, 14],  # Coherence <0.85
                "validation_passed": True
            }
        """
        coherence_scores = []

        for i in range(len(frames) - 1):
            frame_i = self._frame_to_pil(frames[i])
            frame_j = self._frame_to_pil(frames[i + 1])

            # Get CLIP embeddings
            inputs_i = self.clip_processor(images=frame_i, return_tensors="pt")
            inputs_j = self.clip_processor(images=frame_j, return_tensors="pt")

            with torch.no_grad():
                emb_i = self.clip_model.get_image_features(**inputs_i)
                emb_j = self.clip_model.get_image_features(**inputs_j)

            # Cosine similarity
            similarity = torch.nn.functional.cosine_similarity(emb_i, emb_j).item()
            coherence_scores.append(similarity)

        overall = sum(coherence_scores) / len(coherence_scores)
        flagged = [i for i, score in enumerate(coherence_scores) if score < threshold]

        return {
            "overall_coherence": overall,
            "per_frame_scores": coherence_scores,
            "flagged_frames": flagged,
            "validation_passed": len(flagged) == 0
        }
```

#### Deliverables (Nova):
- [ ] CLIP model initialization
- [ ] `_validate_temporal_coherence()` full implementation
- [ ] Flagged frame regeneration logic
- [ ] 4+ unit tests (high coherence, low coherence, edge cases)

#### Success Criteria:
- [ ] Validation completes in <2s for 30 frames
- [ ] Correctly flags frames with coherence <0.85
- [ ] Regeneration improves flagged segments to >0.85

---

## DAY 1-2: KVCACHED GPU MANAGER INTEGRATION

### Integration D: kvcached GPU Manager
**Owner:** Thon (kvcached) + Nova (VideoGen integration)
**Timeline:** Days 1-2 (Thon), Day 3 (Nova integration)
**Status:** ⏳ Pending (Thon implementing Days 1-2)

#### Required Interface:
```python
# infrastructure/kvcached_gpu_manager.py (Thon implementing)
from infrastructure.kvcached_gpu_manager import KVCachedGPUManager

class VideoGenAgent:
    def __init__(self):
        self.gpu_manager = KVCachedGPUManager(
            pool_size_mb=8192,  # 8 GB shared pool
            max_contexts=100     # 100 concurrent video generations
        )

    async def _generate_with_kvcached(
        self, prompt: str, frame_count: int, model: str
    ) -> List[np.ndarray]:
        # Acquire virtual GPU context from pool
        async with self.gpu_manager.acquire_context(
            model=model,           # "VISTA" or "SAIL-VL2"
            memory_mb=2048,        # 2 GB per video
            priority="normal"
        ) as gpu_ctx:
            # Generate frames within GPU context
            frames = await self._vista_generate(prompt, frame_count, gpu_ctx)

        return frames  # GPU context auto-released
```

#### Deliverables (Thon):
- [ ] `infrastructure/kvcached_gpu_manager.py` (~400 lines)
- [ ] Virtual context pool (100 concurrent contexts)
- [ ] Memory allocation/deallocation
- [ ] 10+ unit tests (context acquisition, pool exhaustion, memory tracking)

#### Integration Tasks (Nova - Day 3):
- [ ] Import KVCachedGPUManager in `videogen_agent.py`
- [ ] Wrap VISTA/SAIL-VL2 calls with `acquire_context()`
- [ ] Handle pool exhaustion (queue or degraded generation)
- [ ] Monitor GPU utilization metrics

#### Success Criteria:
- [ ] 100 concurrent video generations without memory errors
- [ ] GPU memory utilization >70% (efficient pooling)
- [ ] Zero memory leaks after 1000 video generations

---

## DAY 4-5: SAIL-VL2 BACKEND + TOOLS INTEGRATION

### Integration E: SAIL-VL2 Backend Toggle
**Owner:** Vanguard (backend) + Nova (VideoGen integration)
**Timeline:** Days 4-5
**Status:** ⏳ Pending

#### Required Interface:
```python
# infrastructure/multimodal_backend_manager.py (Vanguard implementing)
from infrastructure.multimodal_backend_manager import get_backend

class VideoGenAgent:
    def _select_video_model(self, priority: str, frame_count: int) -> str:
        """DAAO-style routing to VISTA or SAIL-VL2."""
        if priority == "quality":
            return "VISTA"
        elif priority == "speed":
            return "SAIL-VL2"
        elif frame_count > 45:
            return "SAIL-VL2"  # Long videos use cheaper model
        else:
            return "VISTA"

    async def _generate_frames(self, prompt: str, frame_count: int, priority: str):
        model = self._select_video_model(priority, frame_count)
        backend = get_backend(model)  # Returns VISTA or SAIL-VL2 client

        frames = await backend.generate(
            prompt=prompt,
            frame_count=frame_count,
            config={"guidance_scale": 7.5}
        )

        return frames
```

#### Deliverables (Vanguard):
- [ ] `infrastructure/multimodal_backend_manager.py` (~250 lines)
- [ ] VISTA backend wrapper
- [ ] SAIL-VL2 backend wrapper
- [ ] Dynamic model switching (cost-aware routing)

#### Integration Tasks (Nova - Days 4-5):
- [ ] Import multimodal_backend_manager
- [ ] Implement `_select_video_model()` DAAO logic
- [ ] Add cost tracking (VISTA $0.15, SAIL-VL2 $0.05 per 30 frames)
- [ ] Fallback logic (VISTA failure → SAIL-VL2)

#### Success Criteria:
- [ ] 60/40 VISTA/SAIL split (as expected)
- [ ] Average cost $0.10 per video (weighted average)
- [ ] SAIL-VL2 quality >90% of VISTA (acceptable degradation)

---

### Integration F: Tool Implementation (Captions, Enhancement, Blog-to-Video)
**Owner:** Nova (VideoGen)
**Timeline:** Days 4-5
**Status:** ⏳ Pending

#### Tool 1: `add_captions_to_video()`
```python
def add_captions_to_video(self, video_uri: str, captions: List[dict]) -> str:
    """Overlay text captions using PIL."""
    # 1. Download video from GCS
    # 2. Decode to frames (OpenCV)
    # 3. Render text overlays (PIL.ImageDraw)
    # 4. Re-encode to MP4
    # 5. Upload to GCS
    pass
```

**Dependencies:**
- Pillow (PIL) for text rendering
- OpenCV for video decode/encode
- google-cloud-storage for GCS operations

#### Tool 2: `enhance_video_quality()`
```python
def enhance_video_quality(self, video_uri: str, level: str) -> str:
    """Post-process with frame interpolation + color correction."""
    # 1. Frame interpolation (1 FPS → 2 FPS)
    # 2. Color correction (brand guideline adherence)
    # 3. Noise reduction
    # 4. Temporal smoothing
    pass
```

**Dependencies:**
- OpenCV for frame interpolation
- scikit-image for color correction

#### Tool 3: `convert_blog_to_video()`
```python
def convert_blog_to_video(self, blog_text: str, images: List[str]) -> str:
    """Transform blog post into video narrative."""
    # 1. Parse blog markdown (sections)
    # 2. Extract key points for captions
    # 3. Generate video for each section
    # 4. Assemble sections with transitions
    pass
```

**Dependencies:**
- markdown library for parsing
- VISTA/SAIL-VL2 for section video generation

#### Deliverables (Nova):
- [ ] All 3 tools fully implemented
- [ ] 6+ unit tests (2 per tool)
- [ ] Integration with existing VISTA pipeline

---

## DAY 6: MARKETING AGENT INTEGRATION + E2E TESTING

### Integration G: Marketing Agent (A2A Protocol)
**Owner:** Nova (VideoGen) + Marketing Agent (consumer)
**Timeline:** Day 6
**Status:** ⏳ Pending

#### A2A Request Flow:
```python
# Marketing Agent (consumer)
async def create_video_campaign(self, campaign_spec: dict) -> dict:
    # A2A request to VideoGen Agent
    video_result = await self.a2a_client.send_request(
        agent="videogen-agent",
        tool="generate_video_from_text",
        params={
            "prompt": campaign_spec['video_description'],
            "duration": 30,
            "style": "professional",
            "aspect_ratio": "16:9"
        }
    )

    # Embed video in landing page
    landing_page_html = self._generate_landing_page(
        video_url=video_result['video_url']
    )

    return {
        "video_uri": video_result['video_uri'],
        "landing_page": landing_page_html
    }
```

#### Deliverables (Nova):
- [ ] A2A protocol registration for VideoGen Agent
- [ ] Update `a2a_card.json` with VideoGen tools
- [ ] Test A2A request/response cycle
- [ ] Marketing Agent integration test

#### Success Criteria:
- [ ] Marketing Agent successfully requests video generation
- [ ] Video URL returned and embedded in landing page
- [ ] End-to-end workflow completes in <15s

---

### Integration H: E2E Testing with Alex
**Owner:** Alex (E2E testing) + Nova (VideoGen)
**Timeline:** Day 6
**Status:** ⏳ Pending

#### E2E Scenarios (5 tests):
1. **Marketing Video End-to-End**
   - Marketing Agent → VideoGen → Landing Page
   - Visual validation: Screenshot of video playing

2. **High-Concurrency Load Test**
   - 100 concurrent video requests
   - kvcached GPU pooling validation

3. **VISTA → SAIL-VL2 Fallback**
   - Mock VISTA failure
   - Validate graceful degradation

4. **Blog-to-Video Conversion**
   - Parse blog markdown
   - Generate 60s video with captions

5. **Cost Budget Enforcement**
   - Exceed monthly budget
   - Fallback to storyboard

#### Deliverables (Alex):
- [ ] 5 E2E test scenarios (all passing)
- [ ] Visual validation screenshots (video playback)
- [ ] Performance metrics report
- [ ] Zero regressions on existing agents

---

## DEPENDENCY GRAPH

```
Day 1: VideoGen Foundation (Nova) ✅ COMPLETE
  ↓
Day 1-2: kvcached GPU Manager (Thon) → Day 3: VideoGen Integration (Nova)
  ↓
Day 2-3: Planned Diffusion (Cora/Nova) → VISTA API (Nova)
  ↓
Day 4-5: SAIL-VL2 Backend (Vanguard) → VideoGen Integration (Nova)
  ↓
Day 4-5: Tools Implementation (Nova)
  ↓
Day 6: Marketing Agent Integration (Nova) + E2E Testing (Alex)
```

---

## RISK MITIGATION

### Risk 1: Planned Diffusion Decoder Delays
**Mitigation:** Fallback to sequential frame generation (no latent planning)
**Impact:** 30% slower, but still meets <10s target

### Risk 2: kvcached GPU Manager Issues
**Mitigation:** Disable pooling, use single GPU context per request
**Impact:** 10X lower throughput, but functional

### Risk 3: VISTA API Rate Limits
**Mitigation:** Exponential backoff + SAIL-VL2 fallback
**Impact:** Degraded quality (0.90 → 0.85), but still acceptable

### Risk 4: Frame Coherence Below Threshold
**Mitigation:** Regenerate flagged segments (up to 3 retries)
**Impact:** 2-3s additional latency, but acceptable

---

## SUCCESS CRITERIA (DAY 6 REVIEW)

**Cora Review Checklist:**
- [ ] All 6 tools fully implemented and tested
- [ ] 20+ unit tests passing (100%)
- [ ] VISTA + SAIL-VL2 integration operational
- [ ] kvcached GPU integration working
- [ ] Planned Diffusion integration complete
- [ ] Code quality: 8.5/10+
- [ ] Test coverage: >85%

**Alex E2E Validation:**
- [ ] All 5 E2E scenarios passing
- [ ] Visual validation screenshots
- [ ] Marketing Agent integration end-to-end
- [ ] Performance targets met (<10s generation)
- [ ] Zero regressions on Phase 1-5 systems

**Production Readiness:**
- [ ] Generation time: <10s for 30 frames ✅
- [ ] Frame coherence: >0.85 ✅
- [ ] Cost efficiency: <$0.10 per video ✅
- [ ] Throughput: 1000 videos/hour with kvcached ✅
- [ ] Documentation complete ✅

---

**Document Version:** 1.0 (Day 1 Foundation)
**Next Update:** Day 3 (after VISTA + Planned Diffusion integration)
**Owner:** Nova (Vertex AI/Multimodal Expert)
