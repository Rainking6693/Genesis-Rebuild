# API Signatures Reference - Agents 5-9

## Agent 5: APIDesignAgent

**File:** `/home/genesis/genesis-rebuild/agents/api_design_agent.py`

### Constructor
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
):
```

### Main Method
```python
async def design_api(
    self,
    config: APIConfig,
    user_id: Optional[str] = None
) -> APIResult:
    """Design API with learned patterns."""
```

### Required Dataclass
```python
@dataclass
class APIConfig:
    api_name: str
    api_type: str  # rest, graphql, grpc
    endpoints: List[Dict[str, Any]]
    authentication: Optional[str] = None
    rate_limiting: Optional[Dict[str, Any]] = None
    versioning: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
```

### Factory Function
```python
async def get_api_design_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> APIDesignAgent:
```

---

## Agent 6: ContentCreationAgent

**File:** `/home/genesis/genesis-rebuild/agents/content_creation_agent.py`

### Constructor
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
):
```

### Main Method
```python
async def generate_content(
    self,
    user_id: str,
    content_type: ContentType,
    topic: str,
    requirements: Dict[str, Any]
) -> GeneratedContent:
    """Generate content with learned patterns."""
```

### Required Enum
```python
class ContentType(Enum):
    BLOG_POST = "blog_post"
    DOCUMENTATION = "documentation"
    SOCIAL_MEDIA = "social_media"
    EMAIL = "email"
    HERO_IMAGE = "hero_image"
    INFOGRAPHIC = "infographic"
    WHITEPAPER = "whitepaper"
    CASE_STUDY = "case_study"
```

### Return Type
```python
@dataclass
class GeneratedContent:
    content_id: str
    content_type: ContentType
    title: str
    body: str
    metadata: Dict[str, Any]
    quality_score: float
    seo_score: Optional[float]
    images: List[str]
    created_at: datetime
    template_used: Optional[str]
```

---

## Agent 7: SEOOptimizationAgent

**File:** `/home/genesis/genesis-rebuild/agents/seo_optimization_agent.py`

### Constructor
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
):
```

### Main Method
```python
async def optimize_content(
    self,
    user_id: str,
    content: str,
    title: str,
    target_keywords: List[str]
) -> OptimizedContent:
    """Optimize content for search engines."""
```

### Return Type
```python
@dataclass
class OptimizedContent:
    content_id: str
    original_content: str
    optimized_content: str
    seo_score: float
    title: str
    meta_description: str
    keywords: List[str]
    headers: List[str]
    images_alt_text: List[str]
    internal_links: List[str]
    optimization_notes: List[str]
    created_at: datetime
    pattern_applied: Optional[str]
```

---

## Agent 8: EmailMarketingAgent

**File:** `/home/genesis/genesis-rebuild/agents/email_marketing_agent.py`

### Constructor
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
):
```

### Key Methods
```python
async def store_campaign(
    self,
    user_id: str,
    campaign: EmailCampaign,
    open_rate: float,
    click_rate: float
) -> str:
    """Store a successful email campaign."""

async def send_campaign(
    self,
    user_id: str,
    campaign: EmailCampaign,
    subscribers: List[Subscriber]
) -> Dict[str, Any]:
    """Send email campaign with learned optimizations."""
```

### Required Dataclasses
```python
@dataclass
class EmailCampaign:
    campaign_id: str
    campaign_name: str
    subject_line: str
    preview_text: str
    body_html: str
    sender_name: str
    sender_email: str
    status: CampaignStatus
    template_used: Optional[str]
    target_segments: List[str]
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]
    recipients_count: int
    opens: int
    clicks: int
    unsubscribes: int
    created_at: datetime
    updated_at: datetime

class CampaignStatus(Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENT = "sent"
    PAUSED = "paused"
    ARCHIVED = "archived"
```

---

## Agent 9: MarketingAgentMultimodal

**File:** `/home/genesis/genesis-rebuild/agents/marketing_agent_multimodal.py`

### Constructor
```python
def __init__(self, enable_memory: bool = True):
```

### Key Methods
```python
async def store_campaign(
    self,
    campaign: MarketingCampaign,
    success: bool,
    performance_metrics: Dict[str, float] = None,
    scope: str = "app"
) -> None:
    """Store campaign pattern in memory"""

async def recall_campaigns(
    self,
    campaign_type: str,
    min_success_rate: float = 0.7,
    scope: str = "app"
) -> List[Dict[str, Any]]:
    """Recall successful campaign patterns from memory"""

async def process_marketing_image(
    self,
    image_path: str,
    content_type: str = "hero",
    brand_guidelines: Optional[Dict[str, Any]] = None
) -> VisualContent:
    """Process marketing image using Gemini Vision API"""
```

### Required Dataclasses
```python
@dataclass
class MarketingCampaign:
    campaign_id: str
    campaign_name: str
    campaign_type: str
    brand_guidelines: Dict[str, Any]
    visual_assets: List[VisualContent]
    brand_patterns: List[str]
    user_preferences: Dict[str, Any]
    created_at: datetime

@dataclass
class VisualContent:
    image_path: str
    content_type: str
    brand_alignment: float
    visual_description: str
    detected_elements: List[str]
    color_palette: List[str]
    confidence: float
```

---

## Common Patterns Across All Agents

### Async Methods
All main operations are async and require `await`:
```python
result = await agent.method(...)
```

### User ID Parameter
Most methods require `user_id` for tracking and personalization:
```python
await agent.method(user_id="identifier", ...)
```

### Memory Support
All agents support persistent memory:
```python
agent = Agent(enable_memory=True)
```

### Statistics/Logging
All agents provide stats methods:
```python
stats = agent.get_statistics()  # or get_stats() or get_agent_stats()
```

---

## Key Differences from Wrong API Calls

| Agent | Wrong | Right |
|-------|-------|-------|
| 5 | `design_api(api_type="REST", resources=[...])` | `design_api(config=APIConfig(...))` |
| 6 | `generate_content(content_type="blog_post", ...)` | `generate_content(content_type=ContentType.BLOG_POST, ...)` |
| 7 | `optimize_content(content=..., target_keywords=[...])` | `optimize_content(user_id=..., content=..., title=..., ...)` |
| 8 | `create_campaign(...)` | `store_campaign(campaign=EmailCampaign(...), ...)` |
| 9 | `create_campaign(...)` | `store_campaign(campaign=MarketingCampaign(...), ...)` |

---

## Import Guide

```python
# Agent 5
from agents.api_design_agent import get_api_design_agent, APIConfig

# Agent 6
from agents.content_creation_agent import ContentCreationAgent, ContentType

# Agent 7
from agents.seo_optimization_agent import SEOOptimizationAgent

# Agent 8
from agents.email_marketing_agent import (
    EmailMarketingAgent,
    EmailCampaign,
    CampaignStatus
)

# Agent 9
from agents.marketing_agent_multimodal import (
    MarketingAgentMultimodal,
    MarketingCampaign,
    VisualContent
)
```

