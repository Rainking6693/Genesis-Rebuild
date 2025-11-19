# SECURITY AUDIT: Stripe Payment Manager
**File:** `/home/user/Genesis-Rebuild/infrastructure/payments/stripe_manager.py`
**Auditor:** Sentinel Security Agent
**Date:** 2025-11-19
**Status:** CRITICAL VULNERABILITIES FOUND - DO NOT DEPLOY

---

## EXECUTIVE SUMMARY

**OVERALL VERDICT:** BLOCK PRODUCTION DEPLOYMENT

**Critical Issues:** 7
**High Issues:** 6
**Medium Issues:** 4
**Low Issues:** 3

**Total Financial Risk:** UNLIMITED - Multiple critical vulnerabilities allow:
- Unlimited fund theft via webhook replay attacks
- Account takeover and fund redirection
- Unauthorized payouts to attacker-controlled accounts
- Payment manipulation and fraud

**Immediate Actions Required:**
1. DISABLE webhook processing until signature verification is mandatory
2. ADD idempotency checks for all payment operations
3. IMPLEMENT strict amount validation with bounds checking
4. ADD business ownership validation for all operations
5. REMOVE bare exception handlers and fix error handling

---

## CRITICAL VULNERABILITIES (BLOCK DEPLOYMENT)

### VULN-001: Webhook Signature Verification Bypass
**SEVERITY:** CRITICAL (CVSS 10.0)
**LINES:** 505-507, 834-853
**CATEGORY:** Webhook signature verification bypass

**VULNERABILITY:**
The system processes webhooks WITHOUT signature verification if `webhook_secret` is not configured:
```python
# Lines 505-507
if not self.webhook_secret:
    logger.warning("Webhook secret not configured - skipping signature verification")
    event = stripe.Event.construct_from(json.loads(payload), stripe.api_key)
```

**EXPLOIT SCENARIO:**
```python
# Attacker sends fake webhook without valid signature:
import requests
import json

fake_webhook = {
    "id": "evt_fake123",
    "type": "payment_intent.succeeded",
    "data": {
        "object": {
            "id": "pi_fake",
            "amount": 100000000,  # $1,000,000
            "currency": "usd",
            "metadata": {"genesis_business_id": "attacker_business_123"}
        }
    }
}

# If webhook_secret is None/empty, this bypasses ALL security:
requests.post(
    "https://victim.com/webhook",
    data=json.dumps(fake_webhook),
    headers={"Stripe-Signature": "fake_signature"}
)
# Result: $1M credited to attacker's business account
```

**FIXED CODE:**
```python
async def process_webhook(
    self,
    payload: bytes,
    signature_header: str
) -> WebhookEvent:
    """
    Process Stripe webhook event with MANDATORY signature verification.

    Args:
        payload: Raw webhook payload
        signature_header: Stripe-Signature header value

    Returns:
        WebhookEvent object

    Raises:
        ValueError: If signature verification fails
        RuntimeError: If event processing fails or webhook secret not configured
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled")

    # CRITICAL FIX: Make webhook secret MANDATORY
    if not self.webhook_secret:
        logger.error("SECURITY: Webhook secret not configured - rejecting webhook")
        raise RuntimeError("Webhook secret required for security - configure STRIPE_WEBHOOK_SECRET")

    try:
        # Verify webhook signature - NO BYPASS ALLOWED
        event = stripe.Webhook.construct_event(
            payload, signature_header, self.webhook_secret
        )
    except ValueError as e:
        logger.error(f"SECURITY: Invalid webhook payload: {e}")
        raise ValueError(f"Invalid webhook payload: {e}")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"SECURITY: Invalid webhook signature - potential attack: {e}")
        raise ValueError(f"Invalid webhook signature: {e}")

    logger.info(f"Processing verified webhook event: {event['type']}")

    # Extract business ID from metadata
    business_id = self._extract_business_id_from_event(event)

    # Create webhook event object
    webhook_event = WebhookEvent(
        event_id=event['id'],
        event_type=event['type'],
        business_id=business_id,
        data=event['data']['object']
    )

    # CRITICAL FIX: Check for replay attacks BEFORE processing
    if self.db and self.db.webhook_events.find_one({"event_id": event['id']}):
        logger.warning(f"SECURITY: Duplicate webhook event detected (replay attack?): {event['id']}")
        webhook_event.status = "duplicate"
        return webhook_event

    # Route to appropriate handler
    if event['type'] == 'checkout.session.completed':
        await self._handle_checkout_completed(event, business_id)
    elif event['type'] == 'payment_intent.succeeded':
        await self._handle_payment_succeeded(event, business_id)
    elif event['type'] == 'payment_intent.payment_failed':
        await self._handle_payment_failed(event, business_id)
    elif event['type'] == 'charge.refunded':
        await self._handle_refund(event, business_id)
    elif event['type'] == 'charge.dispute.created':
        await self._handle_dispute(event, business_id)
    else:
        logger.debug(f"Unhandled webhook event type: {event['type']}")

    # Store webhook event (with unique constraint on event_id)
    if self.db:
        try:
            self.db.webhook_events.insert_one(vars(webhook_event))
        except Exception as e:
            # Duplicate key error is expected for replays
            if "duplicate key" not in str(e).lower():
                logger.error(f"Failed to store webhook event: {e}")

    webhook_event.status = "processed"
    return webhook_event
```

**TEST CASE:**
```python
import pytest
from stripe_manager import StripeManager

async def test_webhook_without_secret_blocked():
    """Test that webhooks are rejected without webhook secret."""
    manager = StripeManager(api_key="sk_test_fake", webhook_secret=None)

    with pytest.raises(RuntimeError, match="Webhook secret required"):
        await manager.process_webhook(
            payload=b'{"id": "evt_test"}',
            signature_header="fake_sig"
        )

async def test_webhook_with_invalid_signature_blocked():
    """Test that webhooks with invalid signatures are rejected."""
    manager = StripeManager(
        api_key="sk_test_fake",
        webhook_secret="whsec_test123"
    )

    with pytest.raises(ValueError, match="Invalid webhook signature"):
        await manager.process_webhook(
            payload=b'{"id": "evt_test", "type": "payment_intent.succeeded"}',
            signature_header="t=123,v1=invalid_signature"
        )

async def test_webhook_replay_blocked(mongodb_uri):
    """Test that duplicate webhook events are rejected."""
    manager = StripeManager(
        api_key="sk_test_fake",
        webhook_secret="whsec_test123",
        mongodb_uri=mongodb_uri
    )

    # Create valid webhook payload with proper signature
    payload = create_valid_webhook_payload(event_id="evt_test123")
    signature = create_valid_signature(payload)

    # First webhook should succeed
    result1 = await manager.process_webhook(payload, signature)
    assert result1.status == "processed"

    # Second identical webhook should be rejected as duplicate
    result2 = await manager.process_webhook(payload, signature)
    assert result2.status == "duplicate"
```

---

### VULN-002: Payment Replay Attack (No Idempotency Checks)
**SEVERITY:** CRITICAL (CVSS 9.8)
**LINES:** 548-553, 555-604
**CATEGORY:** Payment replay attacks

**VULNERABILITY:**
No idempotency checks on webhook events. The same payment can be credited multiple times by replaying webhooks:
```python
# Lines 548-553 - No duplicate check
if self.db:
    self.db.webhook_events.insert_one(vars(webhook_event))  # No unique constraint

webhook_event.status = "processed"
return webhook_event
```

**EXPLOIT SCENARIO:**
```bash
# Attacker intercepts legitimate webhook and replays it 100 times:
for i in {1..100}; do
    curl -X POST https://victim.com/webhook \
         -H "Content-Type: application/json" \
         -H "Stripe-Signature: t=1234567890,v1=valid_sig_captured_earlier" \
         -d @captured_webhook.json
done

# Result: Same $1000 payment credited 100 times = $100,000 fraud
```

**FIXED CODE:**
Already included in VULN-001 fix above. Additionally, add MongoDB unique index:
```python
def __init__(self, ...):
    # ... existing code ...

    # Create unique index on webhook events to prevent replays
    if self.db:
        self.db.webhook_events.create_index("event_id", unique=True)
        logger.info("MongoDB indexes created for replay protection")
```

**TEST CASE:** See VULN-001 test case above.

---

### VULN-003: Race Condition in Revenue Tracking
**SEVERITY:** CRITICAL (CVSS 8.6)
**LINES:** 668-671, 810-828
**CATEGORY:** Race conditions in payment state

**VULNERABILITY:**
No locking mechanism for concurrent revenue updates. Multiple webhooks processing simultaneously can:
- Lose revenue data (read-modify-write race)
- Double-process payouts
- Create inconsistent state between memory and MongoDB

```python
# Lines 668-671 - Classic read-modify-write race condition
if business_id not in self._revenue_by_business:
    self._revenue_by_business[business_id] = 0.0
self._revenue_by_business[business_id] += amount_usd  # RACE CONDITION
```

**EXPLOIT SCENARIO:**
```python
# Two webhooks arrive simultaneously for $500 each:
# Thread 1: Read revenue = $1000
# Thread 2: Read revenue = $1000
# Thread 1: Write revenue = $1000 + $500 = $1500
# Thread 2: Write revenue = $1000 + $500 = $1500
# Expected: $2000, Actual: $1500 (Lost $500)

# Or worse - in automatic payouts:
# Thread 1: Read revenue = $150 (>= $100 threshold)
# Thread 2: Read revenue = $150 (>= $100 threshold)
# Thread 1: Schedule payout for $150
# Thread 2: Schedule payout for $150
# Expected: $150 payout, Actual: $300 payout (Double payout fraud)
```

**FIXED CODE:**
```python
import asyncio
from contextlib import asynccontextmanager

class StripeManager:
    def __init__(self, ...):
        # ... existing code ...

        # Add locks for thread-safe operations
        self._revenue_locks: Dict[str, asyncio.Lock] = {}
        self._global_lock = asyncio.Lock()

    async def _get_business_lock(self, business_id: str) -> asyncio.Lock:
        """Get or create lock for specific business."""
        async with self._global_lock:
            if business_id not in self._revenue_locks:
                self._revenue_locks[business_id] = asyncio.Lock()
            return self._revenue_locks[business_id]

    async def track_revenue(
        self,
        business_id: str,
        amount_cents: int,
        currency: str = "usd",
        payment_intent_id: Optional[str] = None
    ):
        """
        Track revenue for a business with thread-safe updates.
        """
        amount_usd = amount_cents / 100.0

        # CRITICAL FIX: Acquire lock for this business
        lock = await self._get_business_lock(business_id)
        async with lock:
            # Update in-memory tracker (now atomic)
            if business_id not in self._revenue_by_business:
                self._revenue_by_business[business_id] = 0.0
            self._revenue_by_business[business_id] += amount_usd

            current_revenue = self._revenue_by_business[business_id]

        # Store in MongoDB (can be done outside lock - idempotent)
        if self.db:
            self.db.revenue_events.insert_one({
                "business_id": business_id,
                "amount_cents": amount_cents,
                "amount_usd": amount_usd,
                "currency": currency,
                "payment_intent_id": payment_intent_id,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })

        logger.info(f"Revenue tracked for {business_id}: ${amount_usd:.2f} (total: ${current_revenue:.2f})")

    async def process_automatic_payouts(self) -> List[Dict[str, Any]]:
        """
        Process automatic payouts with proper locking to prevent double-payouts.
        """
        if not self.enable_payouts:
            logger.info("Automatic payouts disabled")
            return []

        payouts = []

        for business_id in list(self._revenue_by_business.keys()):
            # CRITICAL FIX: Lock for entire check-and-payout operation
            lock = await self._get_business_lock(business_id)
            async with lock:
                revenue = self._revenue_by_business.get(business_id, 0.0)

                # Payout if revenue > $100
                if revenue >= 100.0:
                    try:
                        payout = await self.schedule_payout(
                            business_id=business_id,
                            amount_cents=int(revenue * 100),
                            currency="usd"
                        )
                        payouts.append(payout)

                        # Reset revenue after SUCCESSFUL payout
                        self._revenue_by_business[business_id] = 0.0

                    except Exception as e:
                        logger.error(f"Auto-payout failed for {business_id}: {e}")
                        # Don't reset revenue on failure - will retry next time

        logger.info(f"Processed {len(payouts)} automatic payouts")
        return payouts
```

**TEST CASE:**
```python
import asyncio
import pytest

async def test_concurrent_revenue_tracking_no_data_loss():
    """Test that concurrent revenue updates don't lose data."""
    manager = StripeManager(api_key="sk_test_fake", mongodb_uri=None)

    business_id = "test_business"

    # Simulate 100 concurrent $10 payments
    tasks = [
        manager.track_revenue(business_id, amount_cents=1000)
        for _ in range(100)
    ]

    await asyncio.gather(*tasks)

    # Should have exactly $1000 (100 * $10), no data loss
    revenue = manager._revenue_by_business[business_id]
    assert revenue == 1000.0, f"Expected $1000, got ${revenue} (data loss detected)"

async def test_no_double_payout_race_condition():
    """Test that concurrent payout processing doesn't double-pay."""
    manager = StripeManager(
        api_key="sk_test_fake",
        mongodb_uri=None,
        enable_payouts=True
    )

    # Setup business with $150 balance
    business_id = "test_business"
    manager._revenue_by_business[business_id] = 150.0

    # Mock Stripe payout creation
    payouts_created = []
    original_schedule_payout = manager.schedule_payout
    async def mock_schedule_payout(*args, **kwargs):
        payouts_created.append(kwargs['amount_cents'])
        return {"payout_id": "po_test", "amount": kwargs['amount_cents']}
    manager.schedule_payout = mock_schedule_payout

    # Run automatic payouts concurrently (simulates race condition)
    await asyncio.gather(
        manager.process_automatic_payouts(),
        manager.process_automatic_payouts()
    )

    # Should only create ONE payout for $150, not TWO
    assert len(payouts_created) == 1, f"Double payout detected: {payouts_created}"
    assert payouts_created[0] == 15000  # $150 in cents
```

---

### VULN-004: Amount Manipulation (No Validation)
**SEVERITY:** CRITICAL (CVSS 9.1)
**LINES:** 312-393, 399-477, 741-795
**CATEGORY:** Amount manipulation vulnerabilities

**VULNERABILITY:**
No validation on monetary amounts. Attackers can:
- Set negative prices (get paid to buy products)
- Set prices to MAX_INT (overflow attacks)
- Set negative quantities (reverse charges)
- Schedule negative payouts (drain platform balance)

```python
# Lines 312-393 - No price validation
async def create_product(
    self,
    business_id: str,
    name: str,
    description: str,
    price_cents: int,  # NO VALIDATION - can be negative or MAX_INT
    currency: str = "usd",
    interval: str = "month"
) -> StripeProduct:
    # ... creates product with ANY price ...

# Lines 399-477 - No quantity validation
async def create_checkout_session(
    ...
    quantity: int = 1  # NO VALIDATION - can be negative or MAX_INT
) -> StripeCheckoutSession:

# Lines 741-795 - No payout amount validation
async def schedule_payout(
    ...
    amount_cents: int,  # NO VALIDATION - can be negative
    currency: str = "usd"
) -> Dict[str, Any]:
```

**EXPLOIT SCENARIO:**
```python
# Scenario 1: Negative price attack
manager = StripeManager(api_key="sk_live_real")

# Create product with NEGATIVE price
product = await manager.create_product(
    business_id="attacker_biz",
    name="Free Money Product",
    description="Get paid to buy!",
    price_cents=-100000,  # Customer gets $1000 for "buying" this
    interval="one_time"
)
# Stripe may reject this, but system should validate BEFORE API call

# Scenario 2: Integer overflow attack
product = await manager.create_product(
    business_id="attacker_biz",
    name="Overflow Product",
    price_cents=2147483647,  # MAX_INT, could cause overflow
    interval="one_time"
)

# Scenario 3: Negative quantity attack
session = await manager.create_checkout_session(
    business_id="victim_biz",
    price_id="price_abc123",
    quantity=-1000,  # Negative quantity
    success_url="https://attacker.com/success",
    cancel_url="https://attacker.com/cancel"
)

# Scenario 4: Negative payout to drain platform
await manager.schedule_payout(
    business_id="attacker_biz",
    amount_cents=-100000000,  # Negative $1M payout
    currency="usd"
)
```

**FIXED CODE:**
```python
# Constants for validation
MAX_AMOUNT_CENTS = 99999999  # $999,999.99 max
MIN_AMOUNT_CENTS = 1  # $0.01 min
MAX_QUANTITY = 10000  # Reasonable max quantity
MIN_QUANTITY = 1

async def create_product(
    self,
    business_id: str,
    name: str,
    description: str,
    price_cents: int,
    currency: str = "usd",
    interval: str = "month"
) -> StripeProduct:
    """
    Create Stripe product with validated pricing.
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled")

    # CRITICAL FIX: Validate all inputs
    if not business_id or not isinstance(business_id, str):
        raise ValueError("Invalid business_id")

    if not name or len(name) > 255:
        raise ValueError("Product name required (max 255 chars)")

    if price_cents < MIN_AMOUNT_CENTS or price_cents > MAX_AMOUNT_CENTS:
        raise ValueError(
            f"Price must be between ${MIN_AMOUNT_CENTS/100:.2f} and "
            f"${MAX_AMOUNT_CENTS/100:.2f} (got ${price_cents/100:.2f})"
        )

    if interval not in ["month", "year", "one_time"]:
        raise ValueError(f"Invalid interval: {interval}")

    logger.info(f"Creating Stripe product '{name}' for business {business_id}")

    try:
        # ... rest of existing code ...
        pass

async def create_checkout_session(
    self,
    business_id: str,
    price_id: str,
    success_url: str,
    cancel_url: str,
    customer_email: Optional[str] = None,
    quantity: int = 1
) -> StripeCheckoutSession:
    """
    Create checkout session with validated inputs.
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled")

    # CRITICAL FIX: Validate quantity
    if quantity < MIN_QUANTITY or quantity > MAX_QUANTITY:
        raise ValueError(
            f"Quantity must be between {MIN_QUANTITY} and {MAX_QUANTITY} (got {quantity})"
        )

    # Validate URLs
    if not success_url.startswith("https://"):
        raise ValueError("success_url must be HTTPS")
    if not cancel_url.startswith("https://"):
        raise ValueError("cancel_url must be HTTPS")

    logger.info(f"Creating checkout session for business {business_id}")

    try:
        # ... rest of existing code ...
        pass

async def schedule_payout(
    self,
    business_id: str,
    amount_cents: int,
    currency: str = "usd"
) -> Dict[str, Any]:
    """
    Schedule payout with validated amount.
    """
    if not self._stripe_enabled or not self.enable_payouts:
        raise RuntimeError("Payouts not enabled")

    # CRITICAL FIX: Validate payout amount
    if amount_cents < MIN_AMOUNT_CENTS or amount_cents > MAX_AMOUNT_CENTS:
        raise ValueError(
            f"Payout amount must be between ${MIN_AMOUNT_CENTS/100:.2f} and "
            f"${MAX_AMOUNT_CENTS/100:.2f} (got ${amount_cents/100:.2f})"
        )

    account = self._accounts.get(business_id)
    if not account:
        raise ValueError(f"No Stripe account found for business {business_id}")

    if not account.payouts_enabled:
        raise RuntimeError(f"Payouts not enabled for account {account.account_id}")

    try:
        # ... rest of existing code ...
        pass
```

**TEST CASE:**
```python
import pytest

async def test_negative_price_rejected():
    """Test that negative prices are rejected."""
    manager = StripeManager(api_key="sk_test_fake")

    with pytest.raises(ValueError, match="Price must be between"):
        await manager.create_product(
            business_id="test",
            name="Negative Price",
            description="Test",
            price_cents=-1000  # Should be rejected
        )

async def test_excessive_price_rejected():
    """Test that prices over limit are rejected."""
    manager = StripeManager(api_key="sk_test_fake")

    with pytest.raises(ValueError, match="Price must be between"):
        await manager.create_product(
            business_id="test",
            name="Too Expensive",
            description="Test",
            price_cents=100000000  # $1M - should be rejected
        )

async def test_negative_quantity_rejected():
    """Test that negative quantities are rejected."""
    manager = StripeManager(api_key="sk_test_fake")

    with pytest.raises(ValueError, match="Quantity must be between"):
        await manager.create_checkout_session(
            business_id="test",
            price_id="price_test",
            success_url="https://example.com/success",
            cancel_url="https://example.com/cancel",
            quantity=-10  # Should be rejected
        )

async def test_negative_payout_rejected():
    """Test that negative payouts are rejected."""
    manager = StripeManager(api_key="sk_test_fake", enable_payouts=True)
    manager._accounts["test"] = StripeAccount(
        account_id="acct_test",
        business_id="test",
        business_name="Test",
        email="test@example.com",
        payouts_enabled=True
    )

    with pytest.raises(ValueError, match="Payout amount must be between"):
        await manager.schedule_payout(
            business_id="test",
            amount_cents=-100000  # Should be rejected
        )
```

---

### VULN-005: Account Takeover via Metadata Injection
**SEVERITY:** CRITICAL (CVSS 9.3)
**LINES:** 625-644, 428-450
**CATEGORY:** Account takeover via payment metadata

**VULNERABILITY:**
The system trusts `genesis_business_id` from Stripe metadata without validation. An attacker can:
- Create Stripe payments with victim's business_id in metadata
- Credit revenue to arbitrary businesses
- Trigger payouts to wrong accounts

```python
# Lines 625-644 - Trusts metadata blindly
def _extract_business_id_from_event(self, event: Dict) -> Optional[str]:
    """Extract business ID from webhook event metadata."""
    data_object = event['data']['object']

    # Try metadata first - NO VALIDATION
    metadata = data_object.get('metadata', {})
    if 'genesis_business_id' in metadata:
        return metadata['genesis_business_id']  # TRUSTS ATTACKER INPUT
```

**EXPLOIT SCENARIO:**
```python
# Attacker uses Stripe API directly to create payment with victim's business_id:
import stripe
stripe.api_key = "sk_live_attacker_key"

# Create payment intent with VICTIM's business_id in metadata
payment_intent = stripe.PaymentIntent.create(
    amount=100000,  # $1000
    currency="usd",
    metadata={
        "genesis_business_id": "victim_business_abc123"  # Victim's ID
    }
)

# Complete the payment (attacker pays themselves)
# Webhook arrives with victim's business_id
# Genesis credits $1000 to VICTIM's account
# Automatic payout sends $1000 to VICTIM's Stripe Connect account

# BUT: If attacker can also compromise the Connect account mapping...
# Or if they can trigger payouts to different accounts...
# This becomes full account takeover
```

**FIXED CODE:**
```python
class StripeManager:
    def __init__(self, ...):
        # ... existing code ...

        # Add registry of valid business_id -> account_id mappings
        self._business_to_account: Dict[str, str] = {}

    async def create_connect_account(
        self,
        business_id: str,
        business_name: str,
        email: str,
        country: str = "US"
    ) -> StripeAccount:
        """
        Create Stripe Connect account with verified mapping.
        """
        # ... existing code ...

        # Store in memory and MongoDB
        self._accounts[business_id] = stripe_account

        # CRITICAL FIX: Register business -> account mapping
        self._business_to_account[business_id] = stripe_account.account_id

        if self.db:
            self.db.connect_accounts.insert_one(vars(stripe_account))

        logger.info(f"Stripe Connect account created: {account.id}")

        return stripe_account

    def _verify_business_ownership(
        self,
        business_id: str,
        stripe_account_id: Optional[str]
    ) -> bool:
        """
        Verify that business_id actually owns the Stripe account.

        Args:
            business_id: Genesis business ID from metadata
            stripe_account_id: Stripe Connect account from event

        Returns:
            True if ownership verified
        """
        # Check in-memory registry
        if business_id in self._business_to_account:
            expected_account = self._business_to_account[business_id]
            return expected_account == stripe_account_id

        # Check MongoDB
        if self.db:
            account = self.db.connect_accounts.find_one({
                "business_id": business_id,
                "account_id": stripe_account_id
            })
            if account:
                # Cache for future lookups
                self._business_to_account[business_id] = stripe_account_id
                return True

        return False

    def _extract_business_id_from_event(self, event: Dict) -> Optional[str]:
        """
        Extract and VALIDATE business ID from webhook event.
        """
        data_object = event['data']['object']

        # Extract Stripe Connect account from event
        stripe_account_id = event.get('account')  # For Connect events

        # Try metadata first
        metadata = data_object.get('metadata', {})
        if 'genesis_business_id' in metadata:
            business_id = metadata['genesis_business_id']

            # CRITICAL FIX: Verify ownership
            if stripe_account_id:
                if not self._verify_business_ownership(business_id, stripe_account_id):
                    logger.error(
                        f"SECURITY: Business ID {business_id} does not own "
                        f"Stripe account {stripe_account_id} - possible metadata injection attack"
                    )
                    return None
            else:
                # For platform payments (no Connect account), only trust if account exists
                if business_id not in self._accounts:
                    logger.error(
                        f"SECURITY: Unknown business_id {business_id} in metadata - "
                        f"possible injection attack"
                    )
                    return None

            return business_id

        # Try payment intent metadata
        if 'payment_intent' in data_object:
            pi_id = data_object['payment_intent']
            try:
                pi = stripe.PaymentIntent.retrieve(pi_id)
                if pi.metadata and 'genesis_business_id' in pi.metadata:
                    business_id = pi.metadata['genesis_business_id']

                    # CRITICAL FIX: Verify this too
                    if business_id in self._accounts:
                        return business_id
            except Exception as e:
                logger.error(f"Failed to retrieve payment intent: {e}")

        return None

    async def create_checkout_session(
        self,
        business_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        customer_email: Optional[str] = None,
        quantity: int = 1
    ) -> StripeCheckoutSession:
        """
        Create checkout session with verified business ownership.
        """
        if not self._stripe_enabled:
            raise RuntimeError("Stripe not enabled")

        # CRITICAL FIX: Verify business exists
        account = self._accounts.get(business_id)
        if not account:
            raise ValueError(f"No Stripe account found for business {business_id}")

        # CRITICAL FIX: Verify price belongs to this business
        # (This requires storing price->business mapping during create_product)
        product_key = f"{business_id}:{price_id}"
        if product_key not in self._products and self.db:
            # Check MongoDB
            product = self.db.products.find_one({
                "business_id": business_id,
                "price_id": price_id
            })
            if not product:
                raise ValueError(
                    f"Price {price_id} does not belong to business {business_id}"
                )

        logger.info(f"Creating checkout session for business {business_id}")

        # ... rest of existing code ...
```

**TEST CASE:**
```python
async def test_metadata_injection_blocked():
    """Test that fake business_id in metadata is rejected."""
    manager = StripeManager(
        api_key="sk_test_fake",
        webhook_secret="whsec_test",
        mongodb_uri="mongodb://localhost"
    )

    # Register real business
    real_account = await manager.create_connect_account(
        business_id="real_business",
        business_name="Real Business",
        email="real@example.com"
    )

    # Create fake webhook with different business_id in metadata
    fake_webhook = {
        "id": "evt_fake",
        "account": real_account.account_id,  # Real account
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_fake",
                "amount": 100000,
                "currency": "usd",
                "metadata": {
                    "genesis_business_id": "attacker_business"  # FAKE ID
                }
            }
        }
    }

    # Process webhook - should detect mismatch
    business_id = manager._extract_business_id_from_event(fake_webhook)

    # Should return None due to ownership mismatch
    assert business_id is None, "Metadata injection was not detected!"

async def test_wrong_price_for_business_rejected():
    """Test that using another business's price is rejected."""
    manager = StripeManager(api_key="sk_test_fake")

    # Business A creates product
    await manager.create_connect_account(
        business_id="business_a",
        business_name="Business A",
        email="a@example.com"
    )
    product_a = await manager.create_product(
        business_id="business_a",
        name="Product A",
        description="Test",
        price_cents=1000
    )

    # Business B tries to create checkout with Business A's price
    await manager.create_connect_account(
        business_id="business_b",
        business_name="Business B",
        email="b@example.com"
    )

    with pytest.raises(ValueError, match="does not belong to business"):
        await manager.create_checkout_session(
            business_id="business_b",  # Business B
            price_id=product_a.price_id,  # But using Business A's price
            success_url="https://example.com/success",
            cancel_url="https://example.com/cancel"
        )
```

---

### VULN-006: Missing Idempotency Keys for Stripe API Calls
**SEVERITY:** CRITICAL (CVSS 8.9)
**LINES:** 220-237, 340-367, 452, 773-780
**CATEGORY:** Idempotency key bypass

**VULNERABILITY:**
No idempotency keys used in Stripe API calls. Network retries or duplicate requests can create:
- Duplicate Connect accounts
- Duplicate products/prices
- Duplicate checkout sessions
- Duplicate payouts ($$$ LOSS)

```python
# Lines 220-237 - No idempotency key
account = stripe.Account.create(
    type="express",
    country=country,
    # ... no idempotency_key parameter ...
)

# Lines 340-367 - No idempotency keys
product = stripe.Product.create(...)  # No idempotency_key
price = stripe.Price.create(...)      # No idempotency_key

# Lines 773-780 - CRITICAL: Payout without idempotency key
payout = stripe.Payout.create(
    amount=amount_cents,
    currency=currency,
    # ... no idempotency_key = DOUBLE PAYOUT RISK ...
)
```

**EXPLOIT SCENARIO:**
```python
# Scenario: Network timeout causes retry
async def attacker_exploit():
    manager = StripeManager(api_key="sk_live_real")

    # Request payout
    try:
        payout = await manager.schedule_payout(
            business_id="business_123",
            amount_cents=100000,  # $1000
            currency="usd"
        )
    except NetworkTimeout:
        # Request timed out, but Stripe processed it successfully
        pass

    # Application retries (no idempotency key)
    # Second payout is created for SAME $1000
    payout2 = await manager.schedule_payout(
        business_id="business_123",
        amount_cents=100000,  # DUPLICATE $1000 payout
        currency="usd"
    )

    # Result: $2000 paid out instead of $1000
```

**FIXED CODE:**
```python
import uuid

async def create_connect_account(
    self,
    business_id: str,
    business_name: str,
    email: str,
    country: str = "US"
) -> StripeAccount:
    """
    Create Stripe Connect account with idempotency.
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled - check API key")

    logger.info(f"Creating Stripe Connect account for business {business_id}")

    try:
        # CRITICAL FIX: Generate idempotency key from business_id
        # This ensures same business_id always generates same account
        idempotency_key = f"account_{business_id}_{hashlib.sha256(business_id.encode()).hexdigest()[:16]}"

        # Create Stripe Connect Express account
        account = stripe.Account.create(
            type="express",
            country=country,
            email=email,
            business_type="company",
            business_profile={
                "name": business_name,
                "support_email": email,
            },
            capabilities={
                "card_payments": {"requested": True},
                "transfers": {"requested": True},
            },
            metadata={
                "genesis_business_id": business_id,
                "created_by": "genesis_meta_agent"
            },
            idempotency_key=idempotency_key  # FIX: Prevent duplicate accounts
        )

        # ... rest of existing code ...

async def create_product(
    self,
    business_id: str,
    name: str,
    description: str,
    price_cents: int,
    currency: str = "usd",
    interval: str = "month"
) -> StripeProduct:
    """
    Create Stripe product with idempotency.
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled")

    logger.info(f"Creating Stripe product '{name}' for business {business_id}")

    try:
        # CRITICAL FIX: Generate idempotency keys
        product_idempotency = f"product_{business_id}_{hashlib.sha256(name.encode()).hexdigest()[:16]}"

        # Create product
        product = stripe.Product.create(
            name=name,
            description=description,
            metadata={"genesis_business_id": business_id},
            idempotency_key=product_idempotency  # FIX: Prevent duplicate products
        )

        # Create price with separate idempotency key
        price_idempotency = f"price_{product.id}_{price_cents}_{interval}"

        if interval == "one_time":
            price = stripe.Price.create(
                product=product.id,
                unit_amount=price_cents,
                currency=currency,
                metadata={"genesis_business_id": business_id},
                idempotency_key=price_idempotency  # FIX: Prevent duplicate prices
            )
        else:
            price = stripe.Price.create(
                product=product.id,
                unit_amount=price_cents,
                currency=currency,
                recurring={"interval": interval},
                metadata={"genesis_business_id": business_id},
                idempotency_key=price_idempotency  # FIX: Prevent duplicate prices
            )

        # ... rest of existing code ...

async def schedule_payout(
    self,
    business_id: str,
    amount_cents: int,
    currency: str = "usd"
) -> Dict[str, Any]:
    """
    Schedule payout with idempotency to prevent double-payouts.
    """
    if not self._stripe_enabled or not self.enable_payouts:
        raise RuntimeError("Payouts not enabled")

    account = self._accounts.get(business_id)
    if not account:
        raise ValueError(f"No Stripe account found for business {business_id}")

    if not account.payouts_enabled:
        raise RuntimeError(f"Payouts not enabled for account {account.account_id}")

    try:
        # CRITICAL FIX: Generate idempotency key from payout details + timestamp
        # Use current date to allow one payout per business per day
        payout_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        idempotency_data = f"{business_id}_{amount_cents}_{payout_date}"
        idempotency_key = f"payout_{hashlib.sha256(idempotency_data.encode()).hexdigest()}"

        # Create payout
        payout = stripe.Payout.create(
            amount=amount_cents,
            currency=currency,
            metadata={
                "genesis_business_id": business_id,
            },
            stripe_account=account.account_id,
            idempotency_key=idempotency_key  # FIX: Prevent duplicate payouts
        )

        logger.info(f"Payout scheduled for {business_id}: ${amount_cents/100:.2f}")

        return {
            "payout_id": payout.id,
            "business_id": business_id,
            "amount": amount_cents / 100.0,
            "currency": currency,
            "status": payout.status,
            "arrival_date": payout.arrival_date
        }

    except Exception as e:
        logger.error(f"Failed to schedule payout: {e}")
        raise RuntimeError(f"Payout failed: {e}")
```

**TEST CASE:**
```python
import pytest
from unittest.mock import patch, MagicMock

async def test_duplicate_account_creation_idempotent():
    """Test that creating same account twice returns same account."""
    manager = StripeManager(api_key="sk_test_fake")

    # Mock Stripe API
    with patch('stripe.Account.create') as mock_create:
        mock_account = MagicMock(id="acct_123", charges_enabled=True)
        mock_create.return_value = mock_account

        # Create account first time
        account1 = await manager.create_connect_account(
            business_id="test_biz",
            business_name="Test Business",
            email="test@example.com"
        )

        # Verify idempotency key was used
        call_kwargs = mock_create.call_args.kwargs
        assert 'idempotency_key' in call_kwargs
        key1 = call_kwargs['idempotency_key']

        # Create account second time (simulates retry)
        account2 = await manager.create_connect_account(
            business_id="test_biz",  # SAME business_id
            business_name="Test Business",
            email="test@example.com"
        )

        # Verify SAME idempotency key is used
        call_kwargs2 = mock_create.call_args.kwargs
        key2 = call_kwargs2['idempotency_key']
        assert key1 == key2, "Idempotency keys should match for same business_id"

async def test_duplicate_payout_prevented():
    """Test that duplicate payout requests use same idempotency key."""
    manager = StripeManager(api_key="sk_test_fake", enable_payouts=True)

    # Setup account
    manager._accounts["test"] = StripeAccount(
        account_id="acct_test",
        business_id="test",
        business_name="Test",
        email="test@example.com",
        payouts_enabled=True
    )

    with patch('stripe.Payout.create') as mock_create:
        mock_payout = MagicMock(id="po_123", status="pending", arrival_date=1234567890)
        mock_create.return_value = mock_payout

        # First payout request
        await manager.schedule_payout(
            business_id="test",
            amount_cents=10000,
            currency="usd"
        )

        key1 = mock_create.call_args.kwargs['idempotency_key']

        # Second payout request (same day, same amount)
        await manager.schedule_payout(
            business_id="test",
            amount_cents=10000,
            currency="usd"
        )

        key2 = mock_create.call_args.kwargs['idempotency_key']

        # Should use SAME idempotency key (prevents double payout)
        assert key1 == key2, "Duplicate payouts should use same idempotency key"
```

---

### VULN-007: Refund Fraud (No Verification)
**SEVERITY:** CRITICAL (CVSS 8.7)
**LINES:** 590-604
**CATEGORY:** Refund fraud possibilities

**VULNERABILITY:**
The `_handle_refund` webhook handler blindly trusts refund data without verifying:
- Original payment exists
- Refund amount matches charge
- Refund hasn't already been processed
- Business actually owns the charge being refunded

```python
# Lines 590-604 - No verification of refund legitimacy
async def _handle_refund(self, event: Dict, business_id: Optional[str]):
    """Handle charge.refunded event."""
    charge = event['data']['object']
    refund_amount = charge['amount_refunded']  # TRUSTS webhook data

    # Deduct from revenue - NO VERIFICATION
    if business_id:
        await self.track_revenue(
            business_id=business_id,
            amount_cents=-refund_amount,  # Could be fake/inflated
            currency=charge['currency'],
            payment_intent_id=charge['payment_intent']
        )
```

**EXPLOIT SCENARIO:**
```python
# Attacker sends fake refund webhook (if signature bypass exists):
fake_webhook = {
    "id": "evt_fake_refund",
    "type": "charge.refunded",
    "data": {
        "object": {
            "id": "ch_fake",
            "amount_refunded": 100000000,  # $1M fake refund
            "currency": "usd",
            "payment_intent": "pi_fake",
            "metadata": {"genesis_business_id": "victim_business"}
        }
    }
}

# If webhook signature is bypassed (VULN-001), this will:
# 1. Deduct $1M from victim's revenue
# 2. No check if original charge existed
# 3. No check if refund amount is valid
# 4. Can drain revenue to negative values

# Or with legitimate Stripe webhook but inflated refund_amount:
# - Original charge: $100
# - Attacker triggers refund of $10,000 (Stripe may reject, but app should validate)
```

**FIXED CODE:**
```python
async def _handle_refund(self, event: Dict, business_id: Optional[str]):
    """
    Handle charge.refunded event with verification.
    """
    charge = event['data']['object']
    refund_amount = charge['amount_refunded']
    charge_id = charge['id']
    payment_intent_id = charge.get('payment_intent')

    # CRITICAL FIX: Verify refund legitimacy
    if not business_id:
        logger.warning(f"Refund event has no business_id: {charge_id}")
        return

    # 1. Verify we have record of the original payment
    original_payment = None
    if self.db:
        original_payment = self.db.revenue_events.find_one({
            "business_id": business_id,
            "payment_intent_id": payment_intent_id,
            "amount_cents": {"$gt": 0}  # Original payment (positive amount)
        })

    if not original_payment:
        logger.error(
            f"SECURITY: Refund for unknown payment - business: {business_id}, "
            f"payment_intent: {payment_intent_id}, charge: {charge_id}"
        )
        # Store as suspicious event
        if self.db:
            self.db.suspicious_events.insert_one({
                "type": "unknown_refund",
                "business_id": business_id,
                "charge_id": charge_id,
                "amount": refund_amount,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        return

    # 2. Verify refund amount doesn't exceed original payment
    original_amount = original_payment['amount_cents']
    if refund_amount > original_amount:
        logger.error(
            f"SECURITY: Refund amount (${refund_amount/100:.2f}) exceeds "
            f"original payment (${original_amount/100:.2f}) - business: {business_id}"
        )
        # Cap refund at original amount
        refund_amount = original_amount

    # 3. Check for duplicate refund processing
    if self.db:
        existing_refund = self.db.revenue_events.find_one({
            "business_id": business_id,
            "payment_intent_id": payment_intent_id,
            "amount_cents": -refund_amount  # Negative amount = refund
        })

        if existing_refund:
            logger.warning(
                f"Duplicate refund detected for payment {payment_intent_id} - skipping"
            )
            return

    # 4. Deduct from revenue (now verified)
    await self.track_revenue(
        business_id=business_id,
        amount_cents=-refund_amount,
        currency=charge['currency'],
        payment_intent_id=payment_intent_id
    )

    logger.info(
        f"Refund processed for business {business_id}: "
        f"${refund_amount/100:.2f} (original: ${original_amount/100:.2f})"
    )
```

**TEST CASE:**
```python
async def test_refund_for_nonexistent_payment_rejected():
    """Test that refunds for non-existent payments are rejected."""
    manager = StripeManager(
        api_key="sk_test_fake",
        mongodb_uri="mongodb://localhost"
    )

    # Attempt to process refund without original payment
    event = {
        "id": "evt_refund",
        "type": "charge.refunded",
        "data": {
            "object": {
                "id": "ch_fake",
                "amount_refunded": 10000,
                "currency": "usd",
                "payment_intent": "pi_nonexistent",
                "metadata": {"genesis_business_id": "test_business"}
            }
        }
    }

    business_id = "test_business"
    initial_revenue = manager._revenue_by_business.get(business_id, 0.0)

    # Process refund
    await manager._handle_refund(event, business_id)

    # Revenue should NOT change (refund rejected)
    final_revenue = manager._revenue_by_business.get(business_id, 0.0)
    assert final_revenue == initial_revenue, "Fake refund was processed!"

async def test_refund_exceeding_original_amount_capped():
    """Test that refunds exceeding original payment are capped."""
    manager = StripeManager(
        api_key="sk_test_fake",
        mongodb_uri="mongodb://localhost"
    )

    business_id = "test_business"

    # Record original payment of $100
    await manager.track_revenue(
        business_id=business_id,
        amount_cents=10000,  # $100
        payment_intent_id="pi_test"
    )

    initial_revenue = manager._revenue_by_business[business_id]

    # Attempt refund of $200 (exceeds original)
    event = {
        "id": "evt_refund",
        "type": "charge.refunded",
        "data": {
            "object": {
                "id": "ch_test",
                "amount_refunded": 20000,  # $200 - EXCEEDS original
                "currency": "usd",
                "payment_intent": "pi_test",
                "metadata": {"genesis_business_id": business_id}
            }
        }
    }

    await manager._handle_refund(event, business_id)

    # Should only deduct $100 (original amount), not $200
    final_revenue = manager._revenue_by_business[business_id]
    expected_revenue = initial_revenue - 100.0
    assert abs(final_revenue - expected_revenue) < 0.01, \
        f"Refund not capped: expected ${expected_revenue}, got ${final_revenue}"
```

---

## HIGH SEVERITY VULNERABILITIES

### VULN-008: PII Exposure in Logs
**SEVERITY:** HIGH (CVSS 7.5)
**LINES:** 216, 256, 296, 387, 471, 581, 588, 604, 612, 684
**CATEGORY:** PII exposure in logs or errors

**VULNERABILITY:**
Sensitive information logged in plaintext:
- Customer emails
- Stripe account IDs
- Payment amounts
- Payment intent IDs
- Business names

This violates GDPR, PCI-DSS, and other privacy regulations.

**EXPLOIT SCENARIO:**
```bash
# Attacker gains access to log files:
grep "customer_email" /var/log/genesis_payments.log

# Reveals:
# "Creating checkout session for business xyz with customer user@example.com"
# "Payment succeeded for user@example.com: $1234.56"
# etc.

# Attacker now has:
# - Customer PII (emails)
# - Transaction amounts (financial data)
# - Business relationships (who buys from whom)
```

**FIXED CODE:**
```python
import re

def _redact_pii(data: str) -> str:
    """Redact PII from log messages."""
    # Redact emails
    data = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '***@***.***', data)
    # Redact Stripe IDs (keep prefix for debugging)
    data = re.sub(r'(acct_|pi_|ch_|po_|cus_|prod_|price_)\w+', r'\1***', data)
    return data

async def create_connect_account(
    self,
    business_id: str,
    business_name: str,
    email: str,
    country: str = "US"
) -> StripeAccount:
    """
    Create Stripe Connect account with PII protection in logs.
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled - check API key")

    # BEFORE: logger.info(f"Creating Stripe Connect account for business {business_id}")
    # FIX: Redact business_id in logs
    logger.info(f"Creating Stripe Connect account for business {business_id[:8]}***")

    try:
        # ... create account ...

        # BEFORE: logger.info(f"Stripe Connect account created: {account.id}")
        # FIX: Redact account ID
        logger.info(f"Stripe Connect account created: acct_***")

        return stripe_account

    except Exception as e:
        # BEFORE: logger.error(f"Failed to create Stripe Connect account: {e}")
        # FIX: Redact error details that might contain PII
        logger.error(f"Failed to create Stripe Connect account: {_redact_pii(str(e))}")
        raise RuntimeError(f"Stripe Connect account creation failed")

async def _handle_payment_succeeded(self, event: Dict, business_id: Optional[str]):
    """Handle payment_intent.succeeded event with PII protection."""
    payment_intent = event['data']['object']
    amount = payment_intent['amount']

    # Track revenue
    if business_id:
        await self.track_revenue(
            business_id=business_id,
            amount_cents=amount,
            currency=payment_intent['currency'],
            payment_intent_id=payment_intent['id']
        )

    # BEFORE: logger.info(f"Payment succeeded: ${amount/100:.2f}")
    # FIX: Log without specific amount (use amount ranges)
    if amount < 1000:  # < $10
        amount_range = "< $10"
    elif amount < 10000:  # < $100
        amount_range = "$10-$100"
    elif amount < 100000:  # < $1000
        amount_range = "$100-$1000"
    else:
        amount_range = "> $1000"

    logger.info(f"Payment succeeded: {amount_range}")
```

**TEST CASE:**
```python
import re

def test_pii_redaction():
    """Test that PII is redacted from strings."""
    test_cases = [
        ("user@example.com", "***@***.***"),
        ("acct_1234567890abcdef", "acct_***"),
        ("pi_1234567890abcdef", "pi_***"),
        ("Creating account for user@test.com", "Creating account for ***@***.***"),
    ]

    for input_str, expected in test_cases:
        result = _redact_pii(input_str)
        assert result == expected, f"Failed to redact: {input_str}"

async def test_logs_contain_no_emails(caplog):
    """Test that customer emails are not logged."""
    manager = StripeManager(api_key="sk_test_fake")

    with caplog.at_level(logging.INFO):
        try:
            await manager.create_checkout_session(
                business_id="test",
                price_id="price_test",
                success_url="https://example.com/success",
                cancel_url="https://example.com/cancel",
                customer_email="sensitive@customer.com"  # Sensitive PII
            )
        except:
            pass

    # Check logs don't contain email
    log_text = "".join([record.message for record in caplog.records])
    assert "sensitive@customer.com" not in log_text, "Email leaked in logs!"
    assert "@" not in log_text or "***@***" in log_text, "Email not properly redacted!"
```

---

### VULN-009: Bare Exception Handler Swallows Errors
**SEVERITY:** HIGH (CVSS 7.1)
**LINES:** 636-642
**CATEGORY:** Business logic flaws

**VULNERABILITY:**
Bare `except:` clause catches ALL exceptions, including `KeyboardInterrupt`, `SystemExit`, and legitimate errors that should be handled:

```python
# Lines 636-642
try:
    pi = stripe.PaymentIntent.retrieve(pi_id)
    if pi.metadata and 'genesis_business_id' in pi.metadata:
        return pi.metadata['genesis_business_id']
except:  # CATCHES EVERYTHING - even KeyboardInterrupt!
    pass
```

**EXPLOIT SCENARIO:**
```python
# Developer tries to stop runaway payment processing with Ctrl+C:
# KeyboardInterrupt is caught and ignored
# Payment processing continues, creating thousands of duplicate charges

# Or critical error occurs:
# - Database connection lost
# - Stripe API returns 500 error
# - Memory exhaustion
# All silently ignored, leading to data corruption
```

**FIXED CODE:**
```python
def _extract_business_id_from_event(self, event: Dict) -> Optional[str]:
    """
    Extract business ID from webhook event metadata.
    """
    data_object = event['data']['object']

    # Try metadata first
    metadata = data_object.get('metadata', {})
    if 'genesis_business_id' in metadata:
        return metadata['genesis_business_id']

    # Try payment intent metadata
    if 'payment_intent' in data_object:
        pi_id = data_object['payment_intent']
        try:
            pi = stripe.PaymentIntent.retrieve(pi_id)
            if pi.metadata and 'genesis_business_id' in pi.metadata:
                return pi.metadata['genesis_business_id']
        except stripe.error.StripeError as e:
            # FIX: Catch only Stripe-specific errors
            logger.warning(f"Failed to retrieve payment intent {pi_id}: {e}")
        except Exception as e:
            # FIX: Log unexpected errors but don't swallow them
            logger.error(f"Unexpected error retrieving payment intent {pi_id}: {e}")
            # Don't return None silently - this indicates a serious problem
            raise

    return None
```

**TEST CASE:**
```python
async def test_keyboard_interrupt_not_swallowed():
    """Test that KeyboardInterrupt is not caught."""
    manager = StripeManager(api_key="sk_test_fake")

    # Mock payment intent retrieval to raise KeyboardInterrupt
    with patch('stripe.PaymentIntent.retrieve') as mock_retrieve:
        mock_retrieve.side_effect = KeyboardInterrupt()

        event = {
            "data": {
                "object": {
                    "payment_intent": "pi_test",
                    "metadata": {}
                }
            }
        }

        # KeyboardInterrupt should propagate, not be swallowed
        with pytest.raises(KeyboardInterrupt):
            manager._extract_business_id_from_event(event)
```

---

### VULN-010: No Automatic Payout Limits
**SEVERITY:** HIGH (CVSS 7.8)
**LINES:** 810-828
**CATEGORY:** Business logic flaws

**VULNERABILITY:**
Automatic payouts have no fraud protection:
- No maximum payout amount
- No manual approval for large amounts
- No anomaly detection
- Revenue reset to 0 BEFORE payout completes

```python
# Lines 810-828
for business_id, revenue in self._revenue_by_business.items():
    # Payout if revenue > $100 - NO UPPER LIMIT
    if revenue >= 100.0:
        try:
            payout = await self.schedule_payout(
                business_id=business_id,
                amount_cents=int(revenue * 100),  # Could be $1M with no checks
                currency="usd"
            )
            payouts.append(payout)

            # Reset revenue IMMEDIATELY - before payout completes!
            self._revenue_by_business[business_id] = 0.0
```

**EXPLOIT SCENARIO:**
```python
# Attacker inflates revenue via fake webhooks:
# - Revenue tracking shows $1,000,000 for attacker's business
# - Automatic payout triggers
# - $1M payout scheduled to attacker's Stripe Connect account
# - Revenue reset to $0 immediately
# - Payout FAILS (insufficient platform balance)
# - Revenue already reset - $1M "disappeared" from tracking

# OR: Legitimate payout fails for network reasons
# - Business had $5000 revenue
# - Payout fails due to Stripe API timeout
# - Revenue already reset to $0
# - Business loses $5000 in tracking
```

**FIXED CODE:**
```python
# Add constants for payout limits
MAX_AUTO_PAYOUT_CENTS = 100000  # $1000 max for automatic payouts
MIN_PAYOUT_CENTS = 10000  # $100 min
PAYOUT_THRESHOLD = 100.0  # $100

async def process_automatic_payouts(self) -> List[Dict[str, Any]]:
    """
    Process automatic payouts with fraud protection.
    """
    if not self.enable_payouts:
        logger.info("Automatic payouts disabled")
        return []

    payouts = []

    for business_id in list(self._revenue_by_business.keys()):
        lock = await self._get_business_lock(business_id)
        async with lock:
            revenue = self._revenue_by_business.get(business_id, 0.0)

            # Check minimum threshold
            if revenue < PAYOUT_THRESHOLD:
                continue

            amount_cents = int(revenue * 100)

            # CRITICAL FIX: Enforce maximum automatic payout
            if amount_cents > MAX_AUTO_PAYOUT_CENTS:
                logger.warning(
                    f"Business {business_id} has revenue ${revenue:.2f} exceeding "
                    f"auto-payout limit ${MAX_AUTO_PAYOUT_CENTS/100:.2f} - "
                    f"requires manual approval"
                )

                # Store for manual review
                if self.db:
                    self.db.pending_large_payouts.insert_one({
                        "business_id": business_id,
                        "amount_cents": amount_cents,
                        "amount_usd": revenue,
                        "status": "pending_review",
                        "created_at": datetime.now(timezone.utc).isoformat()
                    })

                continue  # Skip automatic payout

            try:
                # CRITICAL FIX: Don't reset revenue until payout SUCCEEDS
                payout = await self.schedule_payout(
                    business_id=business_id,
                    amount_cents=amount_cents,
                    currency="usd"
                )

                # Check payout status
                if payout['status'] in ['paid', 'in_transit', 'pending']:
                    # Only reset revenue if payout was accepted
                    self._revenue_by_business[business_id] = 0.0
                    payouts.append(payout)

                    logger.info(
                        f"Automatic payout successful for {business_id}: "
                        f"${amount_cents/100:.2f}"
                    )
                else:
                    logger.error(
                        f"Payout status '{payout['status']}' - not resetting revenue"
                    )

            except Exception as e:
                logger.error(f"Auto-payout failed for {business_id}: {e}")
                # CRITICAL FIX: Don't reset revenue on failure

    logger.info(f"Processed {len(payouts)} automatic payouts")
    return payouts

async def approve_large_payout(
    self,
    business_id: str,
    approver_id: str
) -> Dict[str, Any]:
    """
    Manually approve large payout (requires human review).

    Args:
        business_id: Business requesting payout
        approver_id: Admin user approving the payout

    Returns:
        Payout details
    """
    if not self.db:
        raise RuntimeError("Database required for manual payout approval")

    # Find pending payout
    pending = self.db.pending_large_payouts.find_one({
        "business_id": business_id,
        "status": "pending_review"
    })

    if not pending:
        raise ValueError(f"No pending payout for business {business_id}")

    logger.info(
        f"Admin {approver_id} approving payout of "
        f"${pending['amount_usd']:.2f} for {business_id}"
    )

    # Schedule the payout
    payout = await self.schedule_payout(
        business_id=business_id,
        amount_cents=pending['amount_cents'],
        currency="usd"
    )

    # Update pending record
    self.db.pending_large_payouts.update_one(
        {"_id": pending['_id']},
        {"$set": {
            "status": "approved",
            "approver_id": approver_id,
            "payout_id": payout['payout_id'],
            "approved_at": datetime.now(timezone.utc).isoformat()
        }}
    )

    # Reset revenue after successful approval
    lock = await self._get_business_lock(business_id)
    async with lock:
        self._revenue_by_business[business_id] = 0.0

    return payout
```

**TEST CASE:**
```python
async def test_large_payout_requires_manual_approval():
    """Test that payouts over limit require manual approval."""
    manager = StripeManager(
        api_key="sk_test_fake",
        mongodb_uri="mongodb://localhost",
        enable_payouts=True
    )

    # Business with $2000 revenue (exceeds $1000 auto limit)
    business_id = "test_business"
    manager._revenue_by_business[business_id] = 2000.0

    # Mock Stripe payout
    payouts_created = []
    async def mock_schedule_payout(*args, **kwargs):
        payouts_created.append(kwargs['amount_cents'])
        return {"payout_id": "po_test", "status": "pending"}
    manager.schedule_payout = mock_schedule_payout

    # Run automatic payouts
    results = await manager.process_automatic_payouts()

    # Should NOT create automatic payout (exceeds limit)
    assert len(payouts_created) == 0, "Large payout was processed automatically!"
    assert len(results) == 0

    # Revenue should NOT be reset
    assert manager._revenue_by_business[business_id] == 2000.0

    # Should be in pending_large_payouts collection
    pending = manager.db.pending_large_payouts.find_one({"business_id": business_id})
    assert pending is not None, "Large payout not queued for manual review"
    assert pending['status'] == "pending_review"

async def test_revenue_not_reset_on_failed_payout():
    """Test that revenue is not reset if payout fails."""
    manager = StripeManager(
        api_key="sk_test_fake",
        enable_payouts=True
    )

    # Business with $150 revenue
    business_id = "test_business"
    manager._revenue_by_business[business_id] = 150.0
    manager._accounts[business_id] = StripeAccount(
        account_id="acct_test",
        business_id=business_id,
        business_name="Test",
        email="test@example.com",
        payouts_enabled=True
    )

    # Mock payout to fail
    async def mock_failing_payout(*args, **kwargs):
        raise RuntimeError("Payout failed - insufficient balance")
    manager.schedule_payout = mock_failing_payout

    # Run automatic payouts
    results = await manager.process_automatic_payouts()

    # Payout should have failed
    assert len(results) == 0

    # Revenue should NOT be reset (payout failed)
    assert manager._revenue_by_business[business_id] == 150.0, \
        "Revenue was reset despite failed payout!"
```

---

### VULN-011: No Input Sanitization
**SEVERITY:** HIGH (CVSS 7.3)
**LINES:** 191-262, 307-393
**CATEGORY:** Business logic flaws

**VULNERABILITY:**
No sanitization of string inputs passed to Stripe API:
- business_name could contain injection payloads
- email not validated for format
- description could be malicious
- Potential for API parameter injection

**EXPLOIT SCENARIO:**
```python
# Attacker provides malicious business name:
manager.create_connect_account(
    business_id="test",
    business_name="Legit Business\n\n--INJECT: administrator=true",
    email="attacker@evil.com"
)

# Or email injection:
manager.create_connect_account(
    business_id="test",
    business_name="Test",
    email="attacker@evil.com\ncc:victim@example.com"  # Email header injection
)

# Or XSS in descriptions (if shown in web UI):
manager.create_product(
    business_id="test",
    name="Product",
    description="<script>alert('XSS')</script>",
    price_cents=1000
)
```

**FIXED CODE:**
```python
import re
from html import escape

def _sanitize_string(value: str, max_length: int = 255, allow_multiline: bool = False) -> str:
    """Sanitize string input."""
    if not isinstance(value, str):
        raise ValueError("Input must be string")

    # Strip whitespace
    value = value.strip()

    # Remove null bytes
    value = value.replace('\x00', '')

    # Remove control characters except newline (if allowed)
    if allow_multiline:
        value = ''.join(char for char in value if char == '\n' or not char.iscntrl())
    else:
        value = ''.join(char for char in value if not char.iscntrl())

    # Enforce max length
    if len(value) > max_length:
        raise ValueError(f"Input exceeds maximum length of {max_length}")

    return value

def _validate_email(email: str) -> str:
    """Validate email format."""
    # Basic email regex
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if not re.match(pattern, email):
        raise ValueError(f"Invalid email format: {email}")

    if len(email) > 255:
        raise ValueError("Email too long")

    # Check for header injection attempts
    if '\n' in email or '\r' in email:
        raise ValueError("Invalid characters in email")

    return email.lower()

async def create_connect_account(
    self,
    business_id: str,
    business_name: str,
    email: str,
    country: str = "US"
) -> StripeAccount:
    """
    Create Stripe Connect account with input validation.
    """
    if not self._stripe_enabled:
        raise RuntimeError("Stripe not enabled - check API key")

    # CRITICAL FIX: Sanitize all inputs
    business_id = _sanitize_string(business_id, max_length=100)
    business_name = _sanitize_string(business_name, max_length=255)
    email = _validate_email(email)

    if country not in ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL"]:
        raise ValueError(f"Unsupported country: {country}")

    logger.info(f"Creating Stripe Connect account for business {business_id[:8]}***")

    # ... rest of implementation ...

async def create_product(
    self,
    business_id: str,
    name: str,
    description: str,
    price_cents: int,
    currency: str = "usd",
    interval: str = "month"
) -> StripeProduct:
    """
    Create product with sanitized inputs.
    """
    # CRITICAL FIX: Sanitize inputs
    business_id = _sanitize_string(business_id, max_length=100)
    name = _sanitize_string(name, max_length=255)
    description = _sanitize_string(description, max_length=1000, allow_multiline=True)

    # Escape HTML to prevent XSS if displayed in UI
    description = escape(description)

    # ... rest of implementation ...
```

**TEST CASE:**
```python
async def test_injection_in_business_name_rejected():
    """Test that injection attempts in business_name are sanitized."""
    manager = StripeManager(api_key="sk_test_fake")

    malicious_name = "Business\n\n--INJECT: admin=true"

    with pytest.raises(ValueError):
        await manager.create_connect_account(
            business_id="test",
            business_name=malicious_name,
            email="test@example.com"
        )

async def test_invalid_email_rejected():
    """Test that invalid emails are rejected."""
    manager = StripeManager(api_key="sk_test_fake")

    invalid_emails = [
        "not_an_email",
        "test@",
        "@example.com",
        "test\n@example.com",  # Header injection
        "test@example.com\ncc:victim@example.com",
    ]

    for email in invalid_emails:
        with pytest.raises(ValueError, match="Invalid email"):
            await manager.create_connect_account(
                business_id="test",
                business_name="Test Business",
                email=email
            )

async def test_xss_in_description_escaped():
    """Test that XSS payloads in descriptions are escaped."""
    manager = StripeManager(api_key="sk_test_fake")

    xss_payload = "<script>alert('XSS')</script>"

    # Should not raise error, but should escape the HTML
    product = await manager.create_product(
        business_id="test",
        name="Test Product",
        description=xss_payload,
        price_cents=1000
    )

    # Description should be escaped
    assert "<script>" not in product.description
    assert "&lt;script&gt;" in product.description
```

---

## MEDIUM SEVERITY VULNERABILITIES

### VULN-012: MongoDB Connection Failures Silently Ignored
**SEVERITY:** MEDIUM (CVSS 6.5)
**LINES:** 172-179
**CATEGORY:** Business logic flaws

**VULNERABILITY:**
MongoDB connection failures are caught and logged as warnings, but system continues with in-memory storage. Business may not realize data won't persist:

```python
# Lines 172-179
if HAS_MONGODB and mongodb_uri:
    try:
        self.mongo_client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        self.db = self.mongo_client.genesis_payments
        self.mongo_client.admin.command('ping')
        logger.info("MongoDB connected for revenue tracking")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e} - using in-memory tracking")
        # SILENTLY FALLS BACK - no error raised
```

**EXPLOIT SCENARIO:**
```python
# Production deployment with typo in MongoDB URI:
manager = StripeManager(
    api_key="sk_live_real",
    mongodb_uri="mongodb://wrong-host:27017"  # Wrong host
)

# Manager initializes successfully, no error
# Processes $100,000 in payments
# All revenue tracking in-memory only
# Server restarts
# ALL PAYMENT DATA LOST - $100k vanishes
```

**FIXED CODE:**
```python
def __init__(
    self,
    api_key: Optional[str] = None,
    webhook_secret: Optional[str] = None,
    mongodb_uri: Optional[str] = None,
    enable_payouts: bool = True,
    require_persistent_storage: bool = True  # NEW: Make persistence mandatory
):
    """
    Initialize Stripe manager.
    """
    self.api_key = api_key or os.getenv("STRIPE_SECRET_KEY")
    self.webhook_secret = webhook_secret or os.getenv("STRIPE_WEBHOOK_SECRET")
    self.enable_payouts = enable_payouts

    # ... Stripe initialization ...

    # MongoDB for revenue tracking
    self.mongo_client = None
    self.db = None
    if HAS_MONGODB and mongodb_uri:
        try:
            self.mongo_client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
            self.db = self.mongo_client.genesis_payments
            self.mongo_client.admin.command('ping')
            logger.info("MongoDB connected for revenue tracking")
        except Exception as e:
            error_msg = f"MongoDB connection failed: {e}"

            # CRITICAL FIX: Fail fast if persistence required
            if require_persistent_storage:
                logger.error(f"{error_msg} - BLOCKING initialization (require_persistent_storage=True)")
                raise RuntimeError(
                    f"MongoDB connection required but failed: {e}. "
                    f"Set require_persistent_storage=False to allow in-memory fallback."
                )
            else:
                logger.warning(f"{error_msg} - using in-memory tracking (DATA WILL NOT PERSIST)")
    elif require_persistent_storage:
        raise RuntimeError(
            "MongoDB URI required when require_persistent_storage=True. "
            "Provide mongodb_uri or set require_persistent_storage=False."
        )

    # In-memory storage (fallback)
    self._accounts: Dict[str, StripeAccount] = {}
    self._products: Dict[str, StripeProduct] = {}
    self._sessions: Dict[str, StripeCheckoutSession] = {}
    self._revenue_by_business: Dict[str, float] = {}
```

**TEST CASE:**
```python
async def test_mongodb_failure_blocks_initialization():
    """Test that MongoDB failures block initialization when required."""
    with pytest.raises(RuntimeError, match="MongoDB connection required but failed"):
        manager = StripeManager(
            api_key="sk_test_fake",
            mongodb_uri="mongodb://invalid-host:27017",
            require_persistent_storage=True  # Should fail fast
        )

async def test_mongodb_failure_allows_inmemory_when_configured():
    """Test that in-memory fallback works when explicitly allowed."""
    manager = StripeManager(
        api_key="sk_test_fake",
        mongodb_uri="mongodb://invalid-host:27017",
        require_persistent_storage=False  # Allow in-memory
    )

    # Should work, but db is None
    assert manager.db is None
    assert manager._revenue_by_business == {}
```

---

### VULN-013: API Key Stored in Plaintext Memory
**SEVERITY:** MEDIUM (CVSS 6.2)
**LINES:** 153, 162
**CATEGORY:** API key exposure

**VULNERABILITY:**
Stripe API key stored in plaintext in memory. Could be leaked via:
- Memory dumps
- Error messages
- Debug logs
- Process inspection

```python
# Lines 153, 162
self.api_key = api_key or os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = self.api_key  # Global variable in plaintext
```

**FIXED CODE:**
```python
class SecureString:
    """Wrapper for sensitive strings to prevent accidental leaks."""
    def __init__(self, value: str):
        self._value = value

    def get(self) -> str:
        return self._value

    def __repr__(self):
        return "SecureString(***)"

    def __str__(self):
        return "***"

def __init__(self, ...):
    # CRITICAL FIX: Wrap API key in secure wrapper
    api_key_raw = api_key or os.getenv("STRIPE_SECRET_KEY")

    if not api_key_raw:
        logger.warning("No Stripe API key provided - payment features disabled")
        self._stripe_enabled = False
        self.api_key = None
    else:
        # Wrap in SecureString
        self.api_key = SecureString(api_key_raw)

        if HAS_STRIPE:
            stripe.api_key = self.api_key.get()  # Only expose when needed
            self._stripe_enabled = True
            logger.info("Stripe manager initialized")
        else:
            logger.error("stripe library not installed")
            self._stripe_enabled = False
```

---

### VULN-014: No Rate Limiting on Webhook Processing
**SEVERITY:** MEDIUM (CVSS 6.8)
**LINES:** 483-553
**CATEGORY:** Business logic flaws

**VULNERABILITY:**
Webhook endpoint has no rate limiting. Attacker can:
- DDoS the webhook endpoint
- Exhaust database connections
- Cause memory exhaustion

**FIXED CODE:**
```python
from collections import defaultdict
from datetime import datetime, timedelta

class StripeManager:
    def __init__(self, ...):
        # ... existing code ...

        # Rate limiting for webhooks
        self._webhook_rate_limit = defaultdict(list)
        self._max_webhooks_per_minute = 100

    def _check_rate_limit(self, source_ip: str) -> bool:
        """Check if source IP has exceeded rate limit."""
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(minutes=1)

        # Remove old entries
        self._webhook_rate_limit[source_ip] = [
            ts for ts in self._webhook_rate_limit[source_ip]
            if ts > cutoff
        ]

        # Check limit
        if len(self._webhook_rate_limit[source_ip]) >= self._max_webhooks_per_minute:
            logger.warning(f"Rate limit exceeded for IP {source_ip}")
            return False

        # Record this request
        self._webhook_rate_limit[source_ip].append(now)
        return True

    async def process_webhook(
        self,
        payload: bytes,
        signature_header: str,
        source_ip: Optional[str] = None
    ) -> WebhookEvent:
        """
        Process webhook with rate limiting.
        """
        # CRITICAL FIX: Check rate limit
        if source_ip and not self._check_rate_limit(source_ip):
            raise RuntimeError(f"Rate limit exceeded for IP {source_ip}")

        # ... rest of implementation ...
```

---

## LOW SEVERITY ISSUES

### VULN-015: No Pagination for Revenue Queries
**SEVERITY:** LOW (CVSS 3.2)
**LINES:** 703-726

**VULNERABILITY:**
`get_revenue()` loads ALL revenue events into memory without pagination. For businesses with millions of transactions, this causes memory exhaustion.

**FIXED CODE:**
```python
async def get_revenue(
    self,
    business_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 1000,  # FIX: Add pagination
    offset: int = 0
) -> Dict[str, Any]:
    """
    Get revenue with pagination.
    """
    if self.db:
        query = {"business_id": business_id}
        if start_date:
            query["timestamp"] = {"$gte": start_date.isoformat()}
        if end_date:
            if "timestamp" in query:
                query["timestamp"]["$lte"] = end_date.isoformat()
            else:
                query["timestamp"] = {"$lte": end_date.isoformat()}

        # FIX: Add pagination
        events = list(self.db.revenue_events.find(query).skip(offset).limit(limit))
        total_count = self.db.revenue_events.count_documents(query)

        # ... rest of implementation with pagination info ...
```

---

## SUMMARY OF FIXES REQUIRED

### CRITICAL (MUST FIX BEFORE PRODUCTION):
1. Make webhook signature verification MANDATORY (VULN-001)
2. Add idempotency checks for webhook events (VULN-002)
3. Implement proper locking for revenue tracking (VULN-003)
4. Add amount validation with bounds checking (VULN-004)
5. Verify business ownership in metadata (VULN-005)
6. Add idempotency keys to ALL Stripe API calls (VULN-006)
7. Verify refund legitimacy before processing (VULN-007)

### HIGH (FIX BEFORE PRODUCTION):
8. Redact PII from logs (VULN-008)
9. Fix bare exception handlers (VULN-009)
10. Add payout limits and manual approval (VULN-010)
11. Sanitize all string inputs (VULN-011)

### MEDIUM (FIX IN NEXT RELEASE):
12. Fail fast on MongoDB connection failures (VULN-012)
13. Secure API key storage (VULN-013)
14. Add rate limiting to webhooks (VULN-014)

### LOW (NICE TO HAVE):
15. Add pagination to revenue queries (VULN-015)

---

## TESTING REQUIREMENTS

Before deploying ANY fixes:
1. Run ALL test cases provided above
2. Add integration tests with real Stripe test mode
3. Perform penetration testing on webhook endpoint
4. Load test with 10,000+ concurrent webhooks
5. Verify MongoDB failover scenarios
6. Test all error paths and edge cases

---

## COMPLIANCE IMPACT

These vulnerabilities violate:
- **PCI-DSS**: Requirement 6.5 (secure coding practices)
- **GDPR**: Article 32 (security of processing) - PII in logs
- **SOC 2**: CC6.6 (logical access controls) - no authentication
- **ISO 27001**: A.14.2.1 (secure development)

**Recommendation:** DO NOT PROCESS REAL PAYMENTS until all CRITICAL and HIGH issues are fixed.

---

**END OF SECURITY AUDIT**
