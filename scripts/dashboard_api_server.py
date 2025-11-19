"""
Simple FastAPI server to expose payment metrics for Genesis dashboards.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from infrastructure.business_monitor import get_monitor
from infrastructure.payments.wallet_manager import WalletManager

app = FastAPI(
    title="Genesis Dashboard API",
    version="1.0.0",
    description="Provides payment metrics and wallet balances for the Genesis dashboard."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)


@app.get("/api/payments/metrics", summary="payment metrics")
async def get_payment_metrics():
    """Return aggregated payment statistics that power the dashboard widgets."""
    monitor = get_monitor()
    return monitor.get_payment_metrics()


@app.get("/api/x402/wallets", summary="wallet balances")
async def get_x402_wallets():
    """Return the latest balances for all payment-equipped wallets."""
    manager = WalletManager()
    return {"wallets": manager.get_all_balances()}


@app.get("/health", summary="Health check")
async def health():
    monitor = get_monitor()
    return {
        "status": "healthy",
        "registered_businesses": len(monitor.businesses),
        "payment_records": len(monitor.payment_records)
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("scripts.dashboard_api_server:app", host="0.0.0.0", port=5001, reload=True)
