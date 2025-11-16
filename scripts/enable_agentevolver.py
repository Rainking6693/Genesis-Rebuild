#!/usr/bin/env python3
"""
Enable AgentEvolver features in production agents.
Run this script to activate experience reuse and self-attribution.
"""

import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents.marketing_agent import MarketingAgent
from agents.content_agent import ContentAgent
from agents.seo_agent import SEOAgent

def enable_agentevolver_features():
    """Enable AgentEvolver features for pilot agents."""
    
    print("=" * 80)
    print("AgentEvolver Production Enablement")
    print("=" * 80)
    
    # Configuration
    config = {
        'enable_experience_reuse': True,
        'enable_attribution': True,
        'ap2_budget': 50.0,
        'experience_buffer_size': 10000,
        'quality_threshold': 90.0,
        'exploit_ratio': 0.8
    }
    
    print("\nConfiguration:")
    for key, value in config.items():
        print(f"  {key}: {value}")
    
    # Initialize agents with AgentEvolver features
    print("\n" + "=" * 80)
    print("Initializing Agents with AgentEvolver Features")
    print("=" * 80)
    
    try:
        # Marketing Agent
        print("\n1. Marketing Agent")
        marketing = MarketingAgent(
            enable_experience_reuse=config['enable_experience_reuse'],
            enable_attribution=config['enable_attribution']
        )
        print("   ✓ Marketing Agent initialized with AgentEvolver")
        print(f"   - Experience Buffer: {marketing.experience_buffer.max_size} capacity")
        print(f"   - Policy: {marketing.hybrid_policy.exploit_ratio*100}% exploit")
        
        # Content Agent
        print("\n2. Content Agent")
        content = ContentAgent(
            enable_experience_reuse=config['enable_experience_reuse'],
            enable_attribution=config['enable_attribution']
        )
        print("   ✓ Content Agent initialized with AgentEvolver")
        print(f"   - Experience Buffer: {content.experience_buffer.max_size} capacity")
        print(f"   - Policy: {content.hybrid_policy.exploit_ratio*100}% exploit")
        
        # SEO Agent
        print("\n3. SEO Agent")
        seo = SEOAgent(
            enable_experience_reuse=config['enable_experience_reuse'],
            enable_attribution=config['enable_attribution']
        )
        print("   ✓ SEO Agent initialized with AgentEvolver")
        print(f"   - Experience Buffer: {seo.experience_buffer.max_size} capacity")
        print(f"   - Policy: {seo.hybrid_policy.exploit_ratio*100}% exploit")
        
        print("\n" + "=" * 80)
        print("SUCCESS: All agents enabled with AgentEvolver features")
        print("=" * 80)
        
        print("\nNext Steps:")
        print("  1. Monitor experience buffer hit rates")
        print("  2. Track cost savings in AP2 logs")
        print("  3. Validate quality improvements")
        print("  4. Expand to remaining agents after 24 hours")
        
        return True
        
    except Exception as e:
        print(f"\n✗ ERROR: {str(e)}")
        print("\nRollback: Set enable_experience_reuse=False in agent initialization")
        return False

if __name__ == "__main__":
    success = enable_agentevolver_features()
    sys.exit(0 if success else 1)
