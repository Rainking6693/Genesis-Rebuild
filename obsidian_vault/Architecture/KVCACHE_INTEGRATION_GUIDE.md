---
title: kvcached GPU Manager - Integration Guide
category: Architecture
dg-publish: true
publish: true
tags: []
source: docs/KVCACHE_INTEGRATION_GUIDE.md
exported: '2025-10-24T22:05:26.864890'
---

# kvcached GPU Manager - Integration Guide

**For:** Vanguard (Infrastructure), River (Memory Optimization), Nova (VideoGen), Cora (DeepAnalyze)
**Date:** October 24, 2025
**Status:** Day 1 Complete - Ready for Day 2 Integration

---

## Quick Start

### Installation

```python
# No additional dependencies required
# PyTorch optional (will use mock mode if not available)
from infrastructure.kvcached_gpu_manager import (
    VirtualKVCache,
    GPUMemoryAllocator,
    CachePool,
    create_vista_cache_pool,
    create_deepseek_ocr_cache_pool
)
```

---

## Use Case 1: VISTA Multimodal Model (Nova - VideoGen Agent)

### Basic Usage

```python
import asyncio
from infrastructure.kvcached_gpu_manager import create_vista_cache_pool

async def vista_video_generation():
    # Create cache pool for VISTA (2 GPUs)
    pool = await create_vista_cache_pool(
        num_gpus=2,
        cache_size_per_model_mb=512
    )

    # Request cache for video generation task
    cache = await pool.request_cache(
        model_name="VISTA",
        size_mb=512,
        priority="high",
        is_pinned=True  # Prevent eviction during generation
    )

    # Use cache (get PyTorch tensor)
    kv_tensor = cache.get_tensor()

    # ... perform video generation ...

    # Release cache when done
    await pool.release_cache(cache.cache_id)

    # Stop pool
    await pool.stop()

# Run
asyncio.run(vista_video_generation())
```

### Advanced: Batch Processing

```python
async def vista_batch_generation(video_tasks: list):
    pool = await create_vista_cache_pool(num_gpus=2)

    # Pre-allocate caches for batch
    caches = []
    for i, task in enumerate(video_tasks):
        cache = await pool.request_cache(
            model_name="VISTA",
            size_mb=512,
            cache_id=f"batch_video_{i}"
        )
        caches.append(cache)

    # Process all videos concurrently
    results = await asyncio.gather(*[
        generate_video(task, cache)
        for task, cache in zip(video_tasks, caches)
    ])

    # Cleanup
    for cache in caches:
        await pool.release_cache(cache.cache_id)
    await pool.stop()

    return results
```

---

## Use Case 2: DeepSeek-OCR Visual Memory (River - Memory Optimization)

### Basic Usage

```python
from infrastructure.kvcached_gpu_manager import create_deepseek_ocr_cache_pool
from infrastructure.visual_memory_compressor import VisualMemoryCompressor

async def compress_memory_with_gpu_cache():
    # Create cache pool for DeepSeek-OCR (1 GPU, smaller caches)
    pool = await create_deepseek_ocr_cache_pool(
        num_gpus=1,
        cache_size_per_model_mb=256
    )

    # Request cache for OCR task
    cache = await pool.request_cache(
        model_name="DeepSeek-OCR",
        size_mb=256,
        priority="normal"
    )

    # Initialize visual memory compressor with cache
    compressor = VisualMemoryCompressor()

    # Compress memory entries
    compressed = await compressor.compress_memory(
        text="Long memory content...",
        metadata={"created_at": "2025-10-20T10:00:00Z"},
        gpu_cache=cache  # Use GPU cache for acceleration
    )

    # Release cache
    await pool.release_cache(cache.cache_id)
    await pool.stop()

    return compressed
```

### Advanced: Parallel OCR Compression

```python
async def parallel_ocr_compression(memory_entries: list):
    pool = await create_deepseek_ocr_cache_pool(num_gpus=1)

    async def compress_entry(entry, idx):
        cache = await pool.request_cache(
            model_name="DeepSeek-OCR",
            size_mb=128,  # Smaller caches for parallel tasks
            cache_id=f"ocr_compress_{idx}"
        )

        compressor = VisualMemoryCompressor()
        result = await compressor.compress_memory(
            text=entry["text"],
            metadata=entry["metadata"],
            gpu_cache=cache
        )

        await pool.release_cache(cache.cache_id)
        return result

    # Process all entries in parallel
    results = await asyncio.gather(*[
        compress_entry(entry, i)
        for i, entry in enumerate(memory_entries)
    ])

    await pool.stop()
    return results
```

---

## Use Case 3: Custom Cache Pool (Vanguard - Infrastructure)

### Creating Custom Pool

```python
from infrastructure.kvcached_gpu_manager import (
    CachePool,
    CacheEvictionPolicy
)

async def custom_cache_pool():
    # Create pool with custom configuration
    pool = CachePool(
        device_ids=[0, 1, 2, 3],  # 4 GPUs
        capacity_per_device_gb=16.0,  # 16 GB per GPU
        eviction_policy=CacheEvictionPolicy.ADAPTIVE,
        gc_threshold=0.75,  # More aggressive GC
    )

    await pool.start()

    # Request large cache
    cache = await pool.request_cache(
        model_name="CustomModel",
        size_mb=2048,  # 2 GB
        priority="high",
        is_pinned=True
    )

    # Monitor pool statistics
    stats = pool.get_pool_statistics()
    print(f"Total capacity: {stats['total_capacity_gb']:.2f} GB")
    print(f"Total allocated: {stats['total_allocated_gb']:.2f} GB")
    print(f"Utilization: {stats['total_utilization_pct']:.1f}%")
    print(f"Fragmentation: {stats['avg_fragmentation_pct']:.1f}%")

    await pool.stop()
```

---

## Use Case 4: Manual Memory Management (Advanced)

### Fine-Grained Control

```python
from infrastructure.kvcached_gpu_manager import (
    VirtualKVCache,
    GPUMemoryAllocator
)

async def manual_cache_management():
    # Create allocator directly
    allocator = GPUMemoryAllocator(
        device_id=0,
        total_capacity_bytes=8 * 1024 * 1024 * 1024,  # 8 GB
        gc_threshold=0.8,
        enable_defragmentation=True
    )

    # Allocate caches manually
    cache1 = await allocator.allocate_cache(
        cache_id="manual_cache_1",
        model_name="Model1",
        size_bytes=1024 * 1024 * 1024,  # 1 GB
        is_pinned=False
    )

    cache2 = await allocator.allocate_cache(
        cache_id="manual_cache_2",
        model_name="Model2",
        size_bytes=512 * 1024 * 1024,  # 512 MB
        is_pinned=True
    )

    # Check fragmentation
    stats = allocator.get_statistics()
    if stats.fragmentation_ratio > 0.2:
        # Defragment if >20% fragmentation
        result = await allocator.defragment()
        print(f"Defragmented {result['compacted_caches']} caches")
        print(f"Fragmentation: {result['fragmentation_before']:.2%} → {result['fragmentation_after']:.2%}")

    # Deallocate
    await allocator.deallocate_cache("manual_cache_1")
    await allocator.deallocate_cache("manual_cache_2")
```

---

## Monitoring & Observability

### Pool Statistics

```python
stats = pool.get_pool_statistics()

# Available metrics:
{
    "total_capacity_gb": 32.0,          # Total GPU memory capacity
    "total_allocated_gb": 28.5,         # Currently allocated memory
    "total_utilization_pct": 89.1,      # Utilization percentage
    "avg_fragmentation_pct": 4.2,       # Fragmentation across all GPUs
    "total_active_caches": 24,          # Number of active caches
    "total_allocation_count": 156,      # Total allocations since start
    "total_eviction_count": 8,          # Total evictions since start
    "num_devices": 4,                   # Number of GPUs
    "device_stats": {                   # Per-device breakdown
        "device_0": {
            "capacity_gb": 8.0,
            "allocated_gb": 7.1,
            "utilization_pct": 88.8,
            "fragmentation_pct": 3.5,
            "active_caches": 6
        },
        # ... (device_1, device_2, device_3)
    }
}
```

### OTEL Tracing

All operations are automatically traced with OpenTelemetry:

```python
# Spans created automatically:
- "kvcache.allocate" (VirtualKVCache allocation)
- "kvcache.release" (VirtualKVCache release)
- "allocator.allocate_cache" (GPUMemoryAllocator allocation)
- "allocator.deallocate_cache" (GPUMemoryAllocator deallocation)
- "allocator.defragment" (Defragmentation operation)
- "cache_pool.request_cache" (Pool cache request)

# Metrics recorded:
- kvcache.allocation_time_ms (Allocation latency)
- kvcache.allocated_bytes (Allocated memory)
- kvcache.released_bytes (Released memory)
- allocator.active_caches (Active cache count)
- allocator.fragmentation_ratio (Fragmentation ratio)
- cache_pool.active_caches (Pool-wide active caches)
```

---

## Error Handling

### Graceful Fallback

```python
try:
    pool = await create_vista_cache_pool(num_gpus=2)
    cache = await pool.request_cache(model_name="VISTA", size_mb=512)

    # Use cache...

except Exception as e:
    logger.error(f"GPU cache allocation failed: {e}")
    # Fallback to CPU-based processing
    cache = None  # Process without GPU cache
finally:
    if cache:
        await pool.release_cache(cache.cache_id)
    await pool.stop()
```

### Out-of-Memory Handling

```python
cache = await pool.request_cache(model_name="LargeModel", size_mb=4096)

if cache is None:
    # OOM - try smaller cache
    cache = await pool.request_cache(model_name="LargeModel", size_mb=2048)

    if cache is None:
        # Still OOM - trigger manual eviction
        # Option 1: Wait for automatic eviction
        await asyncio.sleep(1)
        cache = await pool.request_cache(model_name="LargeModel", size_mb=2048)

        # Option 2: Release unpinned caches manually
        for cache_id in list(pool.cache_registry.keys()):
            cached = pool.get_cache(cache_id)
            if cached and cached.is_evictable():
                await pool.release_cache(cache_id)
                break
```

---

## Configuration Best Practices

### GPU Memory Sizing

| Model Type | Recommended Cache Size | Eviction Policy | GC Threshold |
|------------|------------------------|-----------------|--------------|
| VISTA (Multimodal) | 512 MB - 1 GB | SIZE_AWARE_LRU | 0.8 |
| DeepSeek-OCR | 256 MB - 512 MB | LRU | 0.7 |
| LLM (Text) | 1 GB - 4 GB | ADAPTIVE | 0.75 |
| Image Generation | 2 GB - 8 GB | SIZE_AWARE_LRU | 0.8 |

### Multi-GPU Load Balancing

```python
# Optimal GPU distribution for mixed workloads
pool = CachePool(
    device_ids=[0, 1, 2, 3],
    capacity_per_device_gb=16.0,
    eviction_policy=CacheEvictionPolicy.ADAPTIVE
)

# GPU 0-1: VISTA (video generation)
# GPU 2-3: DeepSeek-OCR (image compression)
```

### Pinning Strategy

**When to pin caches:**
- Long-running inference tasks (video generation)
- Real-time applications (low-latency requirements)
- Critical caches (frequently accessed)

**When NOT to pin:**
- Batch processing (allow eviction between batches)
- Infrequent access (better to evict and reload)
- Non-critical tasks

---

## Performance Tuning

### Allocation Latency

```python
# Target: <10ms allocation latency

# Optimization 1: Pre-allocate caches
caches = []
for i in range(10):
    cache = await pool.request_cache(model_name="Model", size_mb=256)
    caches.append(cache)

# Now allocations are instant (reuse pre-allocated caches)

# Optimization 2: Enable defragmentation
allocator = GPUMemoryAllocator(
    device_id=0,
    enable_defragmentation=True,  # Auto-defrag on allocation failure
    gc_threshold=0.8
)
```

### Memory Utilization

```python
# Target: >95% utilization, <5% fragmentation

# Monitor continuously
while True:
    stats = pool.get_pool_statistics()

    if stats["avg_fragmentation_pct"] > 10:
        # Trigger manual defragmentation
        for device_id, allocator in pool.allocators.items():
            result = await allocator.defragment()
            logger.info(f"Defragmented GPU {device_id}: {result['improvement_pct']:.1f}% improvement")

    await asyncio.sleep(60)  # Check every minute
```

---

## Integration Checklist

### For Vanguard (Infrastructure Team)
- [ ] Review CachePool API (stable)
- [ ] Test multi-GPU load balancing (round-robin)
- [ ] Validate OTEL tracing integration
- [ ] Monitor fragmentation ratios in production

### For River (Memory Optimization Team)
- [ ] Integrate `create_deepseek_ocr_cache_pool()` with VisualMemoryCompressor
- [ ] Test parallel OCR compression (10+ concurrent tasks)
- [ ] Benchmark memory compression speedup (target: 2-5X)
- [ ] Validate 71% memory cost reduction with GPU caching

### For Nova (VideoGen Agent)
- [ ] Integrate `create_vista_cache_pool()` with VISTA model
- [ ] Test batch video generation (5+ videos)
- [ ] Measure throughput improvement (target: 10X)
- [ ] Validate cache pinning prevents eviction during generation

### For Cora (DeepAnalyze Agent)
- [ ] Evaluate CachePool for custom models
- [ ] Test ADAPTIVE eviction policy
- [ ] Measure analytics query speedup
- [ ] Validate graceful fallback to CPU

---

## Troubleshooting

### Issue: "No NVIDIA driver found"
**Solution:** Code runs in mock mode automatically (no action needed)

### Issue: Cache allocation returns None
**Cause:** Out of GPU memory
**Solution:** Increase `capacity_per_device_gb` or reduce cache sizes

### Issue: High fragmentation (>20%)
**Cause:** Many small allocations
**Solution:** Enable defragmentation or use SIZE_AWARE_LRU policy

### Issue: Slow allocation (>50ms)
**Cause:** Defragmentation overhead or eviction
**Solution:** Pre-allocate caches or reduce gc_threshold

---

## Next Steps (Day 2)

1. **Fix `record_metric` calls** (15 min) - Add `unit` parameter
2. **Run full test suite** - Target 35/39 passing (90%)
3. **E2E integration tests** - VISTA + DeepSeek-OCR validation
4. **Performance benchmarks** - Real GPU measurements
5. **Hudson code review** - Get 9/10+ approval
6. **Integration with Vanguard/River** - Deploy to staging

---

## Contact & Support

- **Owner:** Thon (Python Specialist)
- **Reviewers:** Hudson (Code Review), Alex (E2E Testing)
- **Documentation:** `/docs/PHASE_6_DAY_1_KVCACHE_STATUS.md`
- **Source:** `/infrastructure/kvcached_gpu_manager.py`
- **Tests:** `/tests/test_kvcached_gpu_manager.py`

---

**Last Updated:** October 24, 2025
**Status:** Day 1 Complete - Ready for Integration (Day 2)
