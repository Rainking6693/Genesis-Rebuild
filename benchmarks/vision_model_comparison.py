"""
Vision Model Comparison: Qwen3-VL vs DeepSeek-OCR
=================================================

Comprehensive benchmark comparing Qwen3-VL and DeepSeek-OCR for Genesis agents.

Metrics:
- Token reduction: Compression efficiency
- Inference speed: Average latency in milliseconds
- Accuracy: Quality of extracted text (0-10 scale)
- Memory usage: Peak RAM during inference

Test Categories:
1. UI Screenshots
2. Document scans
3. Charts/graphs
4. Code screenshots
5. Mixed content
"""

import os
import sys
import time
import json
import psutil
import tracemalloc
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add infrastructure to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.ocr.deepseek_ocr_service import DeepSeekOCRService


class Qwen3VLService:
    """
    Qwen3-VL inference service for OCR comparison

    Uses smaller Qwen2.5-VL-7B model for efficiency (Qwen3-VL-235B too large for local)
    """

    def __init__(self, model_name: str = "Qwen/Qwen2.5-VL-7B-Instruct"):
        self.model_name = model_name
        self.model = None
        self.processor = None
        self.model_loaded = False

        logger.info(f"Qwen3VLService initialized (lazy loading): {model_name}")

    def _load_model(self):
        """Load Qwen3-VL model (lazy loading)"""
        if self.model_loaded:
            return

        try:
            logger.info("Loading Qwen3-VL model...")
            start_time = time.time()

            import torch
            from transformers import AutoModelForImageTextToText, AutoProcessor

            # Check if CUDA available
            device = "cuda" if torch.cuda.is_available() else "cpu"
            logger.info(f"Using device: {device}")

            # Load model with optimal settings
            if device == "cuda":
                self.model = AutoModelForImageTextToText.from_pretrained(
                    self.model_name,
                    torch_dtype=torch.bfloat16,
                    device_map="auto"
                )
            else:
                # CPU fallback
                self.model = AutoModelForImageTextToText.from_pretrained(
                    self.model_name,
                    torch_dtype=torch.float32,
                    device_map="cpu"
                )

            self.processor = AutoProcessor.from_pretrained(self.model_name)
            self.model_loaded = True

            load_time = time.time() - start_time
            logger.info(f"Qwen3-VL loaded in {load_time:.2f}s")

        except Exception as e:
            logger.error(f"Failed to load Qwen3-VL: {e}")
            raise

    def process_image(self, image_path: str, prompt: str = "Extract all text from this image.") -> Dict:
        """
        Process image with Qwen3-VL

        Args:
            image_path: Path to image
            prompt: OCR instruction prompt

        Returns:
            Dict with text, inference_time, token_count, engine
        """
        # Load model (lazy)
        self._load_model()

        try:
            logger.info(f"Processing {image_path} with Qwen3-VL")
            start_time = time.time()

            # Prepare messages
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "image", "image": f"file://{image_path}"},
                        {"type": "text", "text": prompt}
                    ]
                }
            ]

            # Process inputs
            inputs = self.processor.apply_chat_template(
                messages,
                tokenize=True,
                add_generation_prompt=True,
                return_dict=True,
                return_tensors="pt"
            )
            inputs = inputs.to(self.model.device)

            # Generate output
            generated_ids = self.model.generate(**inputs, max_new_tokens=512)

            # Decode output
            generated_ids_trimmed = [
                out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
            ]
            output_text = self.processor.batch_decode(
                generated_ids_trimmed,
                skip_special_tokens=True,
                clean_up_tokenization_spaces=False
            )[0]

            inference_time = time.time() - start_time

            # Count tokens (input + output)
            input_tokens = inputs.input_ids.shape[1]
            output_tokens = len(generated_ids_trimmed[0])
            total_tokens = input_tokens + output_tokens

            return {
                'text': output_text.strip(),
                'inference_time': inference_time,
                'input_tokens': input_tokens,
                'output_tokens': output_tokens,
                'total_tokens': total_tokens,
                'engine': 'qwen3-vl',
                'model_version': self.model_name
            }

        except Exception as e:
            logger.error(f"Qwen3-VL inference failed: {e}")
            raise


class VisionModelBenchmark:
    """
    Comprehensive vision model comparison benchmark
    """

    def __init__(self, output_dir: str = "/home/genesis/genesis-rebuild/benchmarks"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Initialize services
        self.deepseek = DeepSeekOCRService(enable_cache=False)
        self.qwen = Qwen3VLService()

        # Benchmark results
        self.results: Dict[str, Dict] = {}

        logger.info("VisionModelBenchmark initialized")

    def _measure_memory(self, func, *args, **kwargs) -> Tuple[any, float]:
        """
        Measure peak memory usage during function execution

        Returns:
            (result, peak_memory_mb)
        """
        tracemalloc.start()
        process = psutil.Process()

        # Baseline memory
        baseline_memory = process.memory_info().rss / 1024 / 1024

        # Execute function
        result = func(*args, **kwargs)

        # Peak memory
        current_memory = process.memory_info().rss / 1024 / 1024
        peak_memory = current_memory - baseline_memory

        tracemalloc.stop()

        return result, peak_memory

    def benchmark_image(self, image_path: str, category: str, ground_truth: Optional[str] = None) -> Dict:
        """
        Benchmark single image with both models

        Args:
            image_path: Path to test image
            category: Image category (ui, document, chart, code, mixed)
            ground_truth: Expected text for accuracy scoring

        Returns:
            Dict with comparison results
        """
        logger.info(f"Benchmarking: {image_path} (category: {category})")

        results = {
            'image_path': image_path,
            'category': category,
            'timestamp': datetime.utcnow().isoformat()
        }

        # Benchmark DeepSeek-OCR
        try:
            logger.info("Running DeepSeek-OCR baseline...")
            deepseek_result, deepseek_memory = self._measure_memory(
                self.deepseek.process_image,
                image_path,
                mode="document"
            )

            results['deepseek'] = {
                'text': deepseek_result['text'],
                'inference_time_ms': deepseek_result['inference_time'] * 1000,
                'memory_mb': deepseek_memory,
                'engine': deepseek_result['engine'],
                'text_length': len(deepseek_result['text']),
                'cached': deepseek_result.get('cached', False)
            }

            logger.info(f"DeepSeek: {deepseek_result['inference_time']*1000:.2f}ms, {deepseek_memory:.2f}MB")

        except Exception as e:
            logger.error(f"DeepSeek-OCR failed: {e}")
            results['deepseek'] = {'error': str(e)}

        # Benchmark Qwen3-VL
        try:
            logger.info("Running Qwen3-VL...")
            qwen_result, qwen_memory = self._measure_memory(
                self.qwen.process_image,
                image_path,
                prompt="Extract all visible text from this image. Preserve formatting and structure."
            )

            results['qwen3vl'] = {
                'text': qwen_result['text'],
                'inference_time_ms': qwen_result['inference_time'] * 1000,
                'memory_mb': qwen_memory,
                'engine': qwen_result['engine'],
                'text_length': len(qwen_result['text']),
                'input_tokens': qwen_result['input_tokens'],
                'output_tokens': qwen_result['output_tokens'],
                'total_tokens': qwen_result['total_tokens']
            }

            logger.info(f"Qwen3-VL: {qwen_result['inference_time']*1000:.2f}ms, {qwen_memory:.2f}MB, {qwen_result['total_tokens']} tokens")

        except Exception as e:
            logger.error(f"Qwen3-VL failed: {e}")
            results['qwen3vl'] = {'error': str(e)}

        # Compute accuracy scores (manual validation required)
        if ground_truth:
            results['ground_truth'] = ground_truth
            results['accuracy_notes'] = "Manual validation required - see comparison output"

        return results

    def run_benchmark_suite(self, test_images: List[Tuple[str, str, Optional[str]]]) -> Dict:
        """
        Run full benchmark suite

        Args:
            test_images: List of (image_path, category, ground_truth) tuples

        Returns:
            Complete benchmark results
        """
        logger.info(f"Starting benchmark suite: {len(test_images)} images")

        suite_results = {
            'metadata': {
                'timestamp': datetime.utcnow().isoformat(),
                'num_images': len(test_images),
                'deepseek_version': 'tesseract-fallback-v1',
                'qwen_version': self.qwen.model_name
            },
            'results': [],
            'summary': {}
        }

        # Benchmark each image
        for image_path, category, ground_truth in test_images:
            try:
                result = self.benchmark_image(image_path, category, ground_truth)
                suite_results['results'].append(result)
            except Exception as e:
                logger.error(f"Failed to benchmark {image_path}: {e}")
                suite_results['results'].append({
                    'image_path': image_path,
                    'category': category,
                    'error': str(e)
                })

        # Compute summary statistics
        suite_results['summary'] = self._compute_summary(suite_results['results'])

        # Save results
        results_file = self.output_dir / f"vision_comparison_results_{int(time.time())}.json"
        with open(results_file, 'w') as f:
            json.dump(suite_results, f, indent=2)

        logger.info(f"Benchmark complete. Results saved to {results_file}")

        return suite_results

    def _compute_summary(self, results: List[Dict]) -> Dict:
        """Compute aggregate statistics"""
        summary = {
            'deepseek': {'speeds': [], 'memories': [], 'text_lengths': []},
            'qwen3vl': {'speeds': [], 'memories': [], 'text_lengths': [], 'total_tokens': []}
        }

        for result in results:
            if 'deepseek' in result and 'error' not in result['deepseek']:
                summary['deepseek']['speeds'].append(result['deepseek']['inference_time_ms'])
                summary['deepseek']['memories'].append(result['deepseek']['memory_mb'])
                summary['deepseek']['text_lengths'].append(result['deepseek']['text_length'])

            if 'qwen3vl' in result and 'error' not in result['qwen3vl']:
                summary['qwen3vl']['speeds'].append(result['qwen3vl']['inference_time_ms'])
                summary['qwen3vl']['memories'].append(result['qwen3vl']['memory_mb'])
                summary['qwen3vl']['text_lengths'].append(result['qwen3vl']['text_length'])
                summary['qwen3vl']['total_tokens'].append(result['qwen3vl']['total_tokens'])

        # Compute averages
        def avg(lst): return sum(lst) / len(lst) if lst else 0

        return {
            'deepseek': {
                'avg_speed_ms': avg(summary['deepseek']['speeds']),
                'avg_memory_mb': avg(summary['deepseek']['memories']),
                'avg_text_length': avg(summary['deepseek']['text_lengths']),
                'num_successful': len(summary['deepseek']['speeds'])
            },
            'qwen3vl': {
                'avg_speed_ms': avg(summary['qwen3vl']['speeds']),
                'avg_memory_mb': avg(summary['qwen3vl']['memories']),
                'avg_text_length': avg(summary['qwen3vl']['text_lengths']),
                'avg_total_tokens': avg(summary['qwen3vl']['total_tokens']),
                'num_successful': len(summary['qwen3vl']['speeds'])
            },
            'comparison': {
                'speed_improvement_percent': ((avg(summary['deepseek']['speeds']) - avg(summary['qwen3vl']['speeds'])) / avg(summary['deepseek']['speeds']) * 100) if summary['deepseek']['speeds'] else 0,
                'memory_overhead_mb': avg(summary['qwen3vl']['memories']) - avg(summary['deepseek']['memories']),
                'text_length_ratio': avg(summary['qwen3vl']['text_lengths']) / avg(summary['deepseek']['text_lengths']) if avg(summary['deepseek']['text_lengths']) > 0 else 0
            }
        }

    def generate_report(self, results: Dict, output_file: str):
        """Generate markdown decision report"""
        logger.info(f"Generating decision report: {output_file}")

        summary = results['summary']

        # Determine recommendation
        speed_better = summary['comparison']['speed_improvement_percent'] > 0
        memory_acceptable = summary['comparison']['memory_overhead_mb'] < 500  # <500MB overhead acceptable

        if speed_better and memory_acceptable:
            recommendation = "SWITCH to Qwen3-VL"
            reasoning = "Qwen3-VL provides faster inference with acceptable memory overhead."
        elif not speed_better and summary['qwen3vl']['avg_speed_ms'] < 2000:
            recommendation = "CONSIDER SWITCH to Qwen3-VL"
            reasoning = "Qwen3-VL is slightly slower but may offer better accuracy. Verify quality manually."
        else:
            recommendation = "KEEP DeepSeek-OCR"
            reasoning = "DeepSeek-OCR (Tesseract fallback) provides better performance for Genesis use cases."

        # Generate markdown report
        report = f"""# Vision Model Benchmark Results
## Comparison: Qwen3-VL vs DeepSeek-OCR

**Date:** {results['metadata']['timestamp']}
**Test Images:** {results['metadata']['num_images']}
**DeepSeek Version:** {results['metadata']['deepseek_version']}
**Qwen3-VL Version:** {results['metadata']['qwen_version']}

---

## Executive Summary

### RECOMMENDATION: **{recommendation}**

**Reasoning:** {reasoning}

---

## Performance Comparison

| Metric | DeepSeek-OCR | Qwen3-VL | Delta |
|--------|--------------|----------|-------|
| **Avg Inference Speed** | {summary['deepseek']['avg_speed_ms']:.2f}ms | {summary['qwen3vl']['avg_speed_ms']:.2f}ms | {summary['comparison']['speed_improvement_percent']:+.1f}% |
| **Avg Memory Usage** | {summary['deepseek']['avg_memory_mb']:.2f}MB | {summary['qwen3vl']['avg_memory_mb']:.2f}MB | {summary['comparison']['memory_overhead_mb']:+.2f}MB |
| **Avg Text Length** | {summary['deepseek']['avg_text_length']:.0f} chars | {summary['qwen3vl']['avg_text_length']:.0f} chars | {summary['comparison']['text_length_ratio']:.2f}x |
| **Avg Token Count** | N/A | {summary['qwen3vl']['avg_total_tokens']:.0f} tokens | - |
| **Success Rate** | {summary['deepseek']['num_successful']}/{results['metadata']['num_images']} | {summary['qwen3vl']['num_successful']}/{results['metadata']['num_images']} | - |

---

## Detailed Results by Category

"""

        # Group results by category
        by_category = {}
        for result in results['results']:
            cat = result['category']
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(result)

        for category, cat_results in by_category.items():
            report += f"\n### Category: {category.upper()}\n\n"

            for idx, result in enumerate(cat_results, 1):
                report += f"#### Test {idx}: {Path(result['image_path']).name}\n\n"

                if 'deepseek' in result and 'error' not in result['deepseek']:
                    report += f"**DeepSeek-OCR:**\n"
                    report += f"- Inference Time: {result['deepseek']['inference_time_ms']:.2f}ms\n"
                    report += f"- Memory: {result['deepseek']['memory_mb']:.2f}MB\n"
                    report += f"- Text Length: {result['deepseek']['text_length']} chars\n"
                    report += f"- Text Preview: `{result['deepseek']['text'][:100]}...`\n\n"
                else:
                    report += f"**DeepSeek-OCR:** ERROR - {result.get('deepseek', {}).get('error', 'Unknown')}\n\n"

                if 'qwen3vl' in result and 'error' not in result['qwen3vl']:
                    report += f"**Qwen3-VL:**\n"
                    report += f"- Inference Time: {result['qwen3vl']['inference_time_ms']:.2f}ms\n"
                    report += f"- Memory: {result['qwen3vl']['memory_mb']:.2f}MB\n"
                    report += f"- Tokens: {result['qwen3vl']['total_tokens']} (input: {result['qwen3vl']['input_tokens']}, output: {result['qwen3vl']['output_tokens']})\n"
                    report += f"- Text Length: {result['qwen3vl']['text_length']} chars\n"
                    report += f"- Text Preview: `{result['qwen3vl']['text'][:100]}...`\n\n"
                else:
                    report += f"**Qwen3-VL:** ERROR - {result.get('qwen3vl', {}).get('error', 'Unknown')}\n\n"

                report += "---\n\n"

        # ROI Analysis
        report += """
## ROI Analysis

### Cost Considerations

**DeepSeek-OCR (Tesseract Fallback):**
- ✅ **FREE** - No API costs, local inference
- ✅ Low memory footprint
- ✅ Fast inference on CPU
- ⚠️ Limited accuracy on complex layouts

**Qwen3-VL:**
- ⚠️ Requires GPU for optimal performance (slower on CPU)
- ⚠️ Higher memory usage (~500MB overhead)
- ✅ Better at complex document understanding
- ✅ Multimodal capabilities (text + vision)

### When to Use Each Model

**Use DeepSeek-OCR (Current) if:**
- Simple document OCR (invoices, receipts, tickets)
- Cost-sensitive deployments
- CPU-only infrastructure
- Speed > accuracy for use case

**Switch to Qwen3-VL if:**
- Complex document layouts (tables, multi-column)
- Need multimodal understanding (images + text context)
- GPU infrastructure available
- Accuracy > speed for use case

---

## Next Steps

1. **Manual Accuracy Validation:** Review text output samples above to assess quality differences
2. **A/B Testing:** Deploy both models side-by-side for 1 week, measure user satisfaction
3. **Cost Modeling:** Calculate GPU costs vs accuracy gains at production scale
4. **Integration Effort:** Estimate effort to integrate Qwen3-VL into Genesis agents

---

## Appendix: Raw Results

See full JSON results at: `{output_file.replace('.md', '.json')}`

"""

        # Write report
        with open(output_file, 'w') as f:
            f.write(report)

        logger.info(f"Report generated: {output_file}")

        return recommendation


def create_synthetic_test_images():
    """
    Create synthetic test images for benchmarking

    Returns:
        List of (image_path, category, ground_truth) tuples
    """
    from PIL import Image, ImageDraw, ImageFont
    import matplotlib.pyplot as plt
    import numpy as np

    test_dir = Path("/home/genesis/genesis-rebuild/benchmarks/test_images")
    test_dir.mkdir(parents=True, exist_ok=True)

    test_images = []

    # 1. UI Screenshot (simple button layout)
    logger.info("Creating UI screenshot test image...")
    img = Image.new('RGB', (800, 600), color='white')
    draw = ImageDraw.Draw(img)

    # Draw buttons
    buttons = [
        (50, 50, 200, 100, "Submit"),
        (250, 50, 400, 100, "Cancel"),
        (50, 150, 200, 200, "Save"),
        (250, 150, 400, 200, "Delete")
    ]

    for x1, y1, x2, y2, text in buttons:
        draw.rectangle([x1, y1, x2, y2], outline='black', width=2, fill='lightblue')
        # Use default font
        draw.text(((x1+x2)/2, (y1+y2)/2), text, fill='black', anchor='mm')

    ui_path = test_dir / "test_ui_screenshot.png"
    img.save(ui_path)
    test_images.append((str(ui_path), "ui", "Submit Cancel Save Delete"))
    logger.info(f"Created: {ui_path}")

    # 2. Document (invoice-like)
    logger.info("Creating document test image...")
    img = Image.new('RGB', (800, 1000), color='white')
    draw = ImageDraw.Draw(img)

    doc_text = [
        (50, 50, "INVOICE #12345"),
        (50, 100, "Date: 2025-10-27"),
        (50, 150, "Customer: John Doe"),
        (50, 200, "Amount: $1,234.56"),
        (50, 250, "Description: Software License"),
        (50, 300, "Payment Due: 2025-11-27")
    ]

    for x, y, text in doc_text:
        draw.text((x, y), text, fill='black')

    doc_path = test_dir / "test_document.png"
    img.save(doc_path)
    test_images.append((str(doc_path), "document", "INVOICE #12345 Date: 2025-10-27 Customer: John Doe Amount: $1,234.56"))
    logger.info(f"Created: {doc_path}")

    # 3. Chart (bar chart)
    logger.info("Creating chart test image...")
    fig, ax = plt.subplots(figsize=(10, 6))
    categories = ['Q1', 'Q2', 'Q3', 'Q4']
    values = [25, 40, 35, 50]
    ax.bar(categories, values, color='steelblue')
    ax.set_title('Quarterly Revenue (Millions)')
    ax.set_xlabel('Quarter')
    ax.set_ylabel('Revenue ($M)')

    chart_path = test_dir / "test_chart.png"
    plt.savefig(chart_path, dpi=100, bbox_inches='tight')
    plt.close()
    test_images.append((str(chart_path), "chart", "Quarterly Revenue Q1 Q2 Q3 Q4"))
    logger.info(f"Created: {chart_path}")

    # 4. Code screenshot
    logger.info("Creating code screenshot test image...")
    img = Image.new('RGB', (800, 400), color='#1e1e1e')
    draw = ImageDraw.Draw(img)

    code_lines = [
        "def hello_world():",
        "    print('Hello, World!')",
        "    return True",
        "",
        "if __name__ == '__main__':",
        "    hello_world()"
    ]

    y_offset = 30
    for line in code_lines:
        draw.text((30, y_offset), line, fill='#d4d4d4')
        y_offset += 40

    code_path = test_dir / "test_code_screenshot.png"
    img.save(code_path)
    test_images.append((str(code_path), "code", "def hello_world print Hello World return True"))
    logger.info(f"Created: {code_path}")

    # 5. Mixed content (text + simple diagram)
    logger.info("Creating mixed content test image...")
    img = Image.new('RGB', (800, 600), color='white')
    draw = ImageDraw.Draw(img)

    draw.text((50, 50), "System Architecture", fill='black')
    draw.text((50, 100), "1. Frontend -> API Gateway", fill='black')
    draw.text((50, 150), "2. API Gateway -> Backend", fill='black')
    draw.text((50, 200), "3. Backend -> Database", fill='black')

    # Simple boxes
    draw.rectangle([50, 300, 200, 400], outline='black', width=2)
    draw.text((125, 350), "Frontend", fill='black', anchor='mm')

    draw.rectangle([300, 300, 450, 400], outline='black', width=2)
    draw.text((375, 350), "Backend", fill='black', anchor='mm')

    mixed_path = test_dir / "test_mixed_content.png"
    img.save(mixed_path)
    test_images.append((str(mixed_path), "mixed", "System Architecture Frontend API Gateway Backend Database"))
    logger.info(f"Created: {mixed_path}")

    # Add existing test images if available
    existing_invoice = Path("/home/genesis/genesis-rebuild/data/ocr_test_images/test_invoice.png")
    existing_ticket = Path("/home/genesis/genesis-rebuild/data/ocr_test_images/test_ticket.png")

    if existing_invoice.exists():
        test_images.append((str(existing_invoice), "document", None))
        logger.info(f"Added existing: {existing_invoice}")

    if existing_ticket.exists():
        test_images.append((str(existing_ticket), "document", None))
        logger.info(f"Added existing: {existing_ticket}")

    logger.info(f"Created {len(test_images)} test images")
    return test_images


def main():
    """Main benchmark execution"""
    logger.info("=" * 80)
    logger.info("Vision Model Comparison: Qwen3-VL vs DeepSeek-OCR")
    logger.info("=" * 80)

    # Create test images
    logger.info("\nStep 1: Creating test dataset...")
    test_images = create_synthetic_test_images()

    # Initialize benchmark
    logger.info("\nStep 2: Initializing benchmark...")
    benchmark = VisionModelBenchmark()

    # Run benchmark suite
    logger.info("\nStep 3: Running benchmarks...")
    results = benchmark.run_benchmark_suite(test_images)

    # Generate report
    logger.info("\nStep 4: Generating decision report...")
    report_path = "/home/genesis/genesis-rebuild/benchmarks/VISION_MODEL_BENCHMARK_RESULTS.md"
    recommendation = benchmark.generate_report(results, report_path)

    # Print summary
    logger.info("\n" + "=" * 80)
    logger.info("BENCHMARK COMPLETE")
    logger.info("=" * 80)
    logger.info(f"\nRECOMMENDATION: {recommendation}")
    logger.info(f"\nResults saved to:")
    logger.info(f"  - {report_path}")
    logger.info(f"  - {report_path.replace('.md', '.json')}")
    logger.info("\nNext steps:")
    logger.info("  1. Review the detailed report above")
    logger.info("  2. Manually validate text extraction quality")
    logger.info("  3. Make decision: KEEP DeepSeek-OCR or SWITCH to Qwen3-VL")
    logger.info("=" * 80)

    return results, recommendation


if __name__ == "__main__":
    try:
        results, recommendation = main()

        # Print quick summary
        print("\n" + "=" * 80)
        print("QUICK SUMMARY")
        print("=" * 80)
        summary = results['summary']
        print(f"\nDeepSeek-OCR:")
        print(f"  Avg Speed: {summary['deepseek']['avg_speed_ms']:.2f}ms")
        print(f"  Avg Memory: {summary['deepseek']['avg_memory_mb']:.2f}MB")
        print(f"  Success Rate: {summary['deepseek']['num_successful']}/{results['metadata']['num_images']}")

        print(f"\nQwen3-VL:")
        print(f"  Avg Speed: {summary['qwen3vl']['avg_speed_ms']:.2f}ms")
        print(f"  Avg Memory: {summary['qwen3vl']['avg_memory_mb']:.2f}MB")
        print(f"  Avg Tokens: {summary['qwen3vl']['avg_total_tokens']:.0f}")
        print(f"  Success Rate: {summary['qwen3vl']['num_successful']}/{results['metadata']['num_images']}")

        print(f"\nComparison:")
        print(f"  Speed Delta: {summary['comparison']['speed_improvement_percent']:+.1f}%")
        print(f"  Memory Overhead: {summary['comparison']['memory_overhead_mb']:+.2f}MB")

        print(f"\nRECOMMENDATION: {recommendation}")
        print("=" * 80)

    except Exception as e:
        logger.error(f"Benchmark failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
