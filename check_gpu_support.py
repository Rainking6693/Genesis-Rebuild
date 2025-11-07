#!/usr/bin/env python3
"""
Check if your system has NVIDIA GPU support for FP16 training
Run this to determine if you should enable ENABLE_FP16_TRAINING=true
"""

import subprocess
import sys
import os

def check_nvidia_gpu():
    """Check if NVIDIA GPU is available"""
    print("🔍 Checking for NVIDIA GPU...")

    try:
        # Try to run nvidia-smi
        result = subprocess.run(
            ['nvidia-smi'],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode == 0:
            print("✅ NVIDIA GPU detected!")
            print("\n" + "="*60)
            print("GPU Information:")
            print("="*60)

            # Parse nvidia-smi output
            lines = result.stdout.split('\n')
            for line in lines:
                if 'NVIDIA' in line or 'GeForce' or 'RTX' in line or 'GTX' in line:
                    print(line)

            print("="*60)
            return True
        else:
            print("❌ NVIDIA GPU not detected")
            return False

    except FileNotFoundError:
        print("❌ nvidia-smi not found - NVIDIA drivers not installed")
        return False
    except Exception as e:
        print(f"❌ Error checking GPU: {e}")
        return False

def check_cuda():
    """Check if CUDA is available in PyTorch"""
    print("\n🔍 Checking CUDA support in PyTorch...")

    try:
        import torch

        if torch.cuda.is_available():
            print(f"✅ CUDA is available in PyTorch!")
            print(f"   CUDA Version: {torch.version.cuda}")
            print(f"   GPU Count: {torch.cuda.device_count()}")

            for i in range(torch.cuda.device_count()):
                gpu_name = torch.cuda.get_device_name(i)
                gpu_memory = torch.cuda.get_device_properties(i).total_memory / 1024**3
                print(f"   GPU {i}: {gpu_name} ({gpu_memory:.1f} GB)")

            return True
        else:
            print("❌ CUDA not available in PyTorch")
            print("   PyTorch is installed but CUDA support is missing")
            return False

    except ImportError:
        print("⚠️  PyTorch not installed")
        print("   Install with: pip install torch")
        return False
    except Exception as e:
        print(f"❌ Error checking CUDA: {e}")
        return False

def check_fp16_support():
    """Check if GPU supports FP16 (half precision)"""
    print("\n🔍 Checking FP16 (half precision) support...")

    try:
        import torch

        if not torch.cuda.is_available():
            print("❌ CUDA not available - FP16 requires CUDA")
            return False

        # Check if GPU supports FP16
        device = torch.device("cuda:0")

        # Try to create a half-precision tensor
        try:
            tensor = torch.randn(10, 10, device=device, dtype=torch.float16)
            result = tensor @ tensor  # Matrix multiplication

            print("✅ FP16 (half precision) is supported!")
            print("   Your GPU can use ENABLE_FP16_TRAINING=true")
            return True

        except Exception as e:
            print(f"❌ FP16 not supported: {e}")
            return False

    except ImportError:
        print("⚠️  PyTorch not installed")
        return False
    except Exception as e:
        print(f"❌ Error testing FP16: {e}")
        return False

def check_transformers():
    """Check if transformers library is installed"""
    print("\n🔍 Checking transformers library...")

    try:
        import transformers
        print(f"✅ Transformers installed: v{transformers.__version__}")
        return True
    except ImportError:
        print("❌ Transformers not installed")
        print("   Install with: pip install transformers")
        return False

def get_recommendation():
    """Provide recommendation based on checks"""
    print("\n" + "="*60)
    print("📋 CONFIGURATION RECOMMENDATION")
    print("="*60)

    has_gpu = check_nvidia_gpu()
    has_cuda = check_cuda() if has_gpu else False
    has_fp16 = check_fp16_support() if has_cuda else False
    has_transformers = check_transformers()

    print("\n" + "="*60)
    print("🎯 Your .env Configuration:")
    print("="*60)

    if has_fp16:
        print("\n✅ ENABLE FP16 TRAINING")
        print("   Add to your .env:")
        print("   ENABLE_FP16_TRAINING=true")
        print("   PERFORMANCE_OPTIMIZATIONS_ENABLED=true")
        print("\n   Benefits:")
        print("   - 2-3x faster training")
        print("   - 50% less GPU memory")
        print("   - Can train larger models")

    elif has_cuda:
        print("\n⚠️  GPU detected but FP16 test failed")
        print("   Your GPU might not support FP16 efficiently")
        print("   Add to your .env:")
        print("   ENABLE_FP16_TRAINING=false")
        print("   PERFORMANCE_OPTIMIZATIONS_ENABLED=true")

    elif has_gpu:
        print("\n⚠️  NVIDIA GPU detected but CUDA not available")
        print("   Install CUDA toolkit and PyTorch with CUDA:")
        print("   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118")
        print("\n   For now, add to your .env:")
        print("   ENABLE_FP16_TRAINING=false")

    else:
        print("\n❌ NO GPU DETECTED")
        print("   Running on CPU only")
        print("   Add to your .env:")
        print("   ENABLE_FP16_TRAINING=false")
        print("   PERFORMANCE_OPTIMIZATIONS_ENABLED=false")
        print("\n   Note: CPU-only mode will be slower for training")
        print("   Consider using cloud GPU for fine-tuning")

    # Other recommendations
    print("\n" + "="*60)
    print("🚀 Other Production Features:")
    print("="*60)
    print("\n✅ ALWAYS ENABLE (regardless of GPU):")
    print("   ENABLE_WALTZRL=true              # Safety wrapper")
    print("   ENABLE_VERTEX_AI=true            # Fine-tuned models")
    print("   ENABLE_MULTI_AGENT_EVOLVE=true   # Quality improvement")
    print("   COMPUTER_USE_BACKEND=gemini      # Browser automation")
    print("   A2A_API_KEY=your_key              # Agent authentication")
    print("   PIPELEX_INFERENCE_API_KEY=your_key  # Cost optimization")

    print("\n✅ MONITORING (recommended for production):")
    print("   OTEL_ENABLED=true")
    print("   METRICS_ENABLED=true")
    print("   HEALTH_CHECK_ENABLED=true")

    print("\n" + "="*60)

    return has_fp16

def main():
    print("="*60)
    print("🖥️  GPU & FP16 Support Checker")
    print("="*60)
    print("This will check if your system supports FP16 training")
    print("for optimal performance with Genesis-Rebuild")
    print("="*60)

    recommendation = get_recommendation()

    print("\n" + "="*60)
    print("📝 Next Steps:")
    print("="*60)

    if recommendation:
        print("\n1. Edit your .env file:")
        print("   notepad .env")
        print("\n2. Set these values:")
        print("   ENABLE_FP16_TRAINING=true")
        print("   PERFORMANCE_OPTIMIZATIONS_ENABLED=true")
        print("\n3. You're ready for high-performance training! 🚀")
    else:
        print("\n1. Edit your .env file:")
        print("   notepad .env")
        print("\n2. Set these values:")
        print("   ENABLE_FP16_TRAINING=false")
        print("\n3. Consider using cloud GPU for training:")
        print("   - Vast.ai: $0.15-0.40/hour")
        print("   - RunPod: $0.20-0.50/hour")
        print("   - DigitalOcean GPU: ~$1/hour")

    print("\n4. See PRODUCTION_FEATURES_GUIDE.md for complete setup")
    print("="*60)

    return 0

if __name__ == '__main__':
    sys.exit(main())
