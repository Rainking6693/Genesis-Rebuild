"""
Genesis Revenue Tracking System
Tracks revenue, costs, and profit for Genesis-generated businesses.

Add this file to: genesis-dashboard/backend/revenue_tracker.py
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
import json
import logging

logger = logging.getLogger(__name__)

# API Router
router = APIRouter(prefix="/api/revenue", tags=["revenue"])


# Pydantic Models
class BusinessMetrics(BaseModel):
    """Metrics for a single business."""
    business_id: str
    name: str
    type: str = "saas"
    created_at: str
    status: str = Field(..., pattern="^(active|paused|shutdown)$")
    revenue_monthly: float = 0.0
    costs_monthly: float = 10.0
    profit_monthly: float = -10.0
    quality_score: float = Field(0.0, ge=0.0, le=100.0)
    deployment_url: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    last_revenue_update: Optional[str] = None
    metrics: Dict = Field(default_factory=lambda: {
        "total_requests": 0,
        "active_users": 0,
        "conversion_rate": 0.0
    })


class SystemMetrics(BaseModel):
    """System-wide revenue metrics."""
    total_revenue: float
    total_costs: float
    total_profit: float
    profit_margin: float
    active_businesses: int
    total_businesses: int
    success_rate: float
    avg_quality_score: float
    businesses: List[BusinessMetrics]
    last_updated: str


class RevenueUpdate(BaseModel):
    """Revenue update request."""
    revenue: float = Field(..., ge=0.0)
    source: str = Field(default="manual", pattern="^(manual|stripe|analytics)$")


class BusinessRegistration(BaseModel):
    """Business registration request."""
    business_id: str
    name: str
    type: str = "saas"
    quality_score: float = Field(0.0, ge=0.0, le=100.0)
    deployment_url: Optional[str] = None
    estimated_costs: float = 10.0


class RevenueTracker:
    """Tracks revenue for all Genesis businesses."""

    def __init__(self, data_path: Path):
        """Initialize revenue tracker.

        Args:
            data_path: Path to data directory
        """
        self.data_path = data_path / "revenue"
        self.data_path.mkdir(parents=True, exist_ok=True)
        self.db_file = self.data_path / "revenue_tracking.json"
        self.data = self._load_data()

    def _load_data(self) -> Dict:
        """Load revenue database from JSON file."""
        if self.db_file.exists():
            try:
                with open(self.db_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load revenue data: {e}")
                return self._create_empty_db()
        return self._create_empty_db()

    def _create_empty_db(self) -> Dict:
        """Create empty database structure."""
        return {
            "businesses": {},
            "last_updated": datetime.utcnow().isoformat(),
            "version": "1.0"
        }

    def _save_data(self):
        """Save revenue database to JSON file."""
        try:
            self.data["last_updated"] = datetime.utcnow().isoformat()
            with open(self.db_file, 'w') as f:
                json.dump(self.data, f, indent=2)
            logger.info("Revenue data saved successfully")
        except Exception as e:
            logger.error(f"Failed to save revenue data: {e}")
            raise HTTPException(status_code=500, detail="Failed to save revenue data")

    def register_business(self, registration: BusinessRegistration) -> BusinessMetrics:
        """Register a new business for tracking."""
        if registration.business_id in self.data["businesses"]:
            raise HTTPException(
                status_code=400,
                detail=f"Business {registration.business_id} already registered"
            )

        business = BusinessMetrics(
            business_id=registration.business_id,
            name=registration.name,
            type=registration.type,
            created_at=datetime.utcnow().isoformat(),
            status="active",
            revenue_monthly=0.0,
            costs_monthly=registration.estimated_costs,
            profit_monthly=-registration.estimated_costs,
            quality_score=registration.quality_score,
            deployment_url=registration.deployment_url
        )

        self.data["businesses"][registration.business_id] = business.dict()
        self._save_data()

        logger.info(f"Registered new business: {registration.business_id}")
        return business

    def update_revenue(
        self,
        business_id: str,
        update: RevenueUpdate
    ) -> BusinessMetrics:
        """Update business revenue."""
        if business_id not in self.data["businesses"]:
            raise HTTPException(
                status_code=404,
                detail=f"Business {business_id} not found"
            )

        business = self.data["businesses"][business_id]
        business["revenue_monthly"] = update.revenue
        business["profit_monthly"] = update.revenue - business["costs_monthly"]
        business["last_revenue_update"] = datetime.utcnow().isoformat()

        self._save_data()

        logger.info(
            f"Updated revenue for {business_id}: "
            f"${update.revenue:.2f} from {update.source}"
        )

        return BusinessMetrics(**business)

    def update_status(self, business_id: str, status: str) -> BusinessMetrics:
        """Update business status."""
        if business_id not in self.data["businesses"]:
            raise HTTPException(
                status_code=404,
                detail=f"Business {business_id} not found"
            )

        if status not in ["active", "paused", "shutdown"]:
            raise HTTPException(
                status_code=400,
                detail="Status must be 'active', 'paused', or 'shutdown'"
            )

        business = self.data["businesses"][business_id]
        business["status"] = status
        self._save_data()

        logger.info(f"Updated status for {business_id}: {status}")
        return BusinessMetrics(**business)

    def get_business(self, business_id: str) -> BusinessMetrics:
        """Get metrics for a specific business."""
        if business_id not in self.data["businesses"]:
            raise HTTPException(
                status_code=404,
                detail=f"Business {business_id} not found"
            )

        return BusinessMetrics(**self.data["businesses"][business_id])

    def get_system_metrics(self) -> SystemMetrics:
        """Get system-wide revenue metrics."""
        businesses = list(self.data["businesses"].values())
        active = [b for b in businesses if b["status"] == "active"]

        # Calculate totals
        total_revenue = sum(b["revenue_monthly"] for b in active)
        total_costs = sum(b["costs_monthly"] for b in active)
        total_profit = total_revenue - total_costs

        # Calculate rates
        profit_margin = (
            (total_profit / total_revenue * 100)
            if total_revenue > 0 else 0.0
        )

        profitable_count = sum(1 for b in active if b["profit_monthly"] > 0)
        success_rate = (profitable_count / len(active) * 100) if active else 0.0

        avg_quality = (
            sum(b["quality_score"] for b in active) / len(active)
            if active else 0.0
        )

        return SystemMetrics(
            total_revenue=total_revenue,
            total_costs=total_costs,
            total_profit=total_profit,
            profit_margin=profit_margin,
            active_businesses=len(active),
            total_businesses=len(businesses),
            success_rate=success_rate,
            avg_quality_score=avg_quality,
            businesses=[BusinessMetrics(**b) for b in active],
            last_updated=datetime.utcnow().isoformat()
        )

    def get_revenue_history(
        self,
        business_id: Optional[str] = None,
        days: int = 30
    ) -> List[Dict]:
        """Get revenue history (placeholder for future time-series data)."""
        # This would integrate with time-series database in production
        return []


# Initialize tracker
tracker = RevenueTracker(Path("/app/data"))


# API Endpoints
@router.get("/metrics", response_model=SystemMetrics)
async def get_revenue_metrics():
    """Get system-wide revenue metrics.

    Returns comprehensive revenue, profit, and business metrics for the entire
    Genesis system.
    """
    return tracker.get_system_metrics()


@router.get("/business/{business_id}", response_model=BusinessMetrics)
async def get_business_metrics(business_id: str):
    """Get metrics for a specific business.

    Args:
        business_id: Unique identifier for the business

    Returns:
        Business metrics including revenue, costs, profit, and status
    """
    return tracker.get_business(business_id)


@router.post("/business/register", response_model=BusinessMetrics)
async def register_business(registration: BusinessRegistration):
    """Register a new business for revenue tracking.

    Args:
        registration: Business registration data

    Returns:
        Newly registered business metrics
    """
    return tracker.register_business(registration)


@router.post("/business/{business_id}/revenue", response_model=BusinessMetrics)
async def update_business_revenue(
    business_id: str,
    update: RevenueUpdate
):
    """Update revenue for a specific business.

    Args:
        business_id: Unique identifier for the business
        update: Revenue update data (amount and source)

    Returns:
        Updated business metrics
    """
    return tracker.update_revenue(business_id, update)


@router.post("/business/{business_id}/status", response_model=BusinessMetrics)
async def update_business_status(business_id: str, status: str):
    """Update status for a specific business.

    Args:
        business_id: Unique identifier for the business
        status: New status (active, paused, shutdown)

    Returns:
        Updated business metrics
    """
    return tracker.update_status(business_id, status)


@router.delete("/business/{business_id}")
async def delete_business(business_id: str):
    """Delete a business from tracking (soft delete - sets status to shutdown).

    Args:
        business_id: Unique identifier for the business

    Returns:
        Success message
    """
    tracker.update_status(business_id, "shutdown")
    return {"status": "success", "message": f"Business {business_id} shut down"}


@router.get("/health")
async def health_check():
    """Health check endpoint for revenue tracker."""
    return {
        "status": "healthy",
        "service": "revenue-tracker",
        "timestamp": datetime.utcnow().isoformat(),
        "total_businesses": len(tracker.data["businesses"])
    }
