# test_genesis_agents.py
import os, gc, sys, torch

# Keep RAM/thread use tiny
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_THREADING_LAYER"] = "SEQUENTIAL"
os.environ["MALLOC_ARENA_MAX"] = "2"

from transformers import AutoTokenizer, AutoModelForCausalLM

CKPT = os.path.expanduser("~/genesis-rebuild/checkpoints/epoch_30.pt")

def load_state():
    print(f"Loading checkpoint: {CKPT}", flush=True)
    # weights_only=True reduces overhead in newer PyTorch
    try:
        state = torch.load(CKPT, map_location="cpu", weights_only=True)
    except TypeError:
        # PyTorch < 2.5 fallback
        state = torch.load(CKPT, map_location="cpu")
    if not isinstance(state, dict) or "conv" not in state or "feed" not in state:
        print("❌ Checkpoint format unexpected. Expected keys: 'conv' and 'feed'.", flush=True)
        sys.exit(1)
    return state

def load_tokenizer():
    tok = AutoTokenizer.from_pretrained("distilgpt2", use_fast=False)
    if tok.pad_token is None:
        tok.pad_token = tok.eos_token
    return tok

def test_role(role_key, tok, state):
    print(f"\n=== Testing role: {role_key} ===", flush=True)
    model = AutoModelForCausalLM.from_pretrained("distilgpt2", low_cpu_mem_usage=True)
    missing, unexpected = model.load_state_dict(state[role_key], strict=False)
    if missing:
        print(f"[warn] Missing keys for {role_key}: {len(missing)}")
    if unexpected:
        print(f"[warn] Unexpected keys for {role_key}: {len(unexpected)}")
    model.eval()

    # Cheap forward (loss) first
    text = "User: How do I back up my website safely?\nAssistant:"
    inp = tok(text, return_tensors="pt")
    _ = model(**inp, labels=inp["input_ids"]).loss
    print("✅ Forward pass ok.", flush=True)

    # Tiny deterministic generate (short to avoid RAM spikes)
    with torch.inference_mode():
        out = model.generate(
            **inp,
            max_new_tokens=24,
            do_sample=False,
            use_cache=True
        )
    print("🗣️  Output:", tok.decode(out[0], skip_special_tokens=True))

    # Free memory for next role
    del model, inp, out
    gc.collect()

def main():
    state = load_state()
    tok = load_tokenizer()
    test_role("conv", tok, state)
    test_role("feed", tok, state)
    print("\n✅ Both roles tested.")

if __name__ == "__main__":
    main()
