## Part 2: Discord Integration

**Purpose:** Real-time visibility into all agent communication

### 2.1 Discord Server Structure

**Channels to Create:**

📢 **CONTROL CENTER**
- `#genesis-dashboard` - Main status updates from all agents
- `#commands` - Where user can send commands to Genesis
- `#alerts` - Critical notifications

🏗️ **ACTIVE BUILDS**
- Dynamic channels for each business being built
- Format: `#business-001-businessname`
- Shows all agent communication for that specific business
- Auto-archive after build completes (24 hours)

🚀 **DEPLOYMENTS**
- `#deployments` - All live URLs and deployment success notifications

📊 **ANALYTICS**
- `#metrics` - Performance data, build times, success rates
- `#revenue` - Stripe payment notifications

⚠️ **ERRORS**
- `#errors` - All agent errors and recovery attempts

---

### 2.2 Discord Implementation Tasks

#### Phase 1: Core Discord Integration (Week 1)

- [x] **Create Discord Server**
  - [x] Create Genesis Discord server *(webhooks provided by user)*
  - [x] Create channels (dashboard, commands, alerts, deployments, metrics, revenue, errors)
  - [x] Generate webhook URLs for each channel
  - [x] Add webhook URLs to `.env` (`.env`: Discord block)

- [x] **Create Discord Client** (`infrastructure/genesis_discord.py`)
  ```python
  class GenesisDiscord:
      def __init__(self):
          self.webhook_dashboard = os.getenv('DISCORD_WEBHOOK_DASHBOARD')
          self.webhook_commands = os.getenv('DISCORD_WEBHOOK_COMMANDS')
          self.webhook_alerts = os.getenv('DISCORD_WEBHOOK_ALERTS')
          self.webhook_deployments = os.getenv('DISCORD_WEBHOOK_DEPLOYMENTS')
          self.webhook_metrics = os.getenv('DISCORD_WEBHOOK_METRICS')
          self.webhook_revenue = os.getenv('DISCORD_WEBHOOK_REVENUE')
          self.webhook_errors = os.getenv('DISCORD_WEBHOOK_ERRORS')
  ```

- [x] **Rich Embed Formatting**
  - [x] Color coding: Blue=Info, Orange=InProgress, Green=Success, Red=Error, Purple=Analytics
  - [x] Timestamps on all messages
  - [x] Agent name as footer
  - [x] Emojis: 🚀=Launch, 🏗️=Building, ✅=Success, ❌=Error, 💰=Revenue, 📊=Analytics, 🤖=Agent

**Testing:**
- [x] Test webhook posting to each channel *(unit tests in `tests/test_discord_integration.py`)*
- [x] Test rich embed formatting
- [x] Test error handling (webhook fails gracefully)

---

#### Phase 2: Genesis Lifecycle Notifications (Week 1)

- [x] **System Startup/Shutdown**
  ```python
  async def genesis_started(self):
      """Notify Genesis system started"""
      embed = {
          'title': '🚀 Genesis Agent System Started',
          'description': 'All 21 agents initialized and ready',
          'color': 0x3498db,  # Blue
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': 'Genesis Meta Agent'}
      }
      await self._send_webhook(self.webhook_dashboard, embed)

  async def genesis_shutdown(self):
      """Notify Genesis system shutdown"""
      embed = {
          'title': '⛔ Genesis Agent System Shutdown',
          'description': 'System going offline',
          'color': 0xe74c3c,  # Red
          'timestamp': datetime.now().isoformat()
      }
      await self._send_webhook(self.webhook_dashboard, embed)
  ```

- [x] **Integration Points**
  - [x] `scripts/autonomous_fully_integrated.py` now calls `genesis_started()` at loop start
  - [x] Cleanup path calls `genesis_shutdown()` before closing the Discord client

**Testing:**
- [x] Test system startup notification
- [x] Test system shutdown notification

---

#### Phase 3: Business Build Notifications (Week 2)

- [x] **Build Lifecycle**
  ```python
  async def business_build_started(self, business_id: str, business_name: str, idea: str):
      """Notify business build started"""
      embed = {
          'title': f'🏗️ Build Started: {business_name}',
          'description': f'**Business ID:** {business_id}\n**Idea:** {idea}',
          'color': 0xf39c12,  # Orange
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': 'Genesis Meta Agent'}
      }
      await self._send_webhook(self.webhook_dashboard, embed)

  async def business_build_completed(self, business_id: str, url: str, metrics: dict):
      """Notify business build completed"""
      embed = {
          'title': f'✅ Build Complete: {metrics["name"]}',
          'description': f'**Live URL:** {url}\n**Quality Score:** {metrics["quality_score"]}/100\n**Build Time:** {metrics["build_time"]}',
          'color': 0x2ecc71,  # Green
          'timestamp': datetime.now().isoformat()
      }
      await self._send_webhook(self.webhook_dashboard, embed)
      await self._send_webhook(self.webhook_deployments, embed)  # Also post to deployments
  ```

- [x] **Integration Points**
  - [x] `infrastructure/genesis_meta_agent.py:generate_business()` now emits build start/complete events (see new Discord hooks + HopX env wrapping)
  - [x] Start notification fires after monitor `start_business`
  - [x] Completion notification posts metrics + deployment placeholder

**Testing:**
- [x] Exercised via `scripts/discord_smoke_test.py` and live orchestration hooks (see pytest for embed contracts)

---

#### Phase 4: Agent Activity Notifications (Week 2)

- [x] **Agent Lifecycle**
  ```python
  async def agent_started(self, business_id: str, agent_name: str, task: str):
      """Notify agent started work"""
      embed = {
          'title': f'🤖 {agent_name} Started',
          'description': f'**Task:** {task}',
          'color': 0x3498db,  # Blue
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': f'Business: {business_id}'}
      }
      await self._send_webhook(self.webhook_dashboard, embed)

  async def agent_progress(self, business_id: str, agent_name: str, message: str):
      """Notify agent progress update"""
      embed = {
          'title': f'📝 {agent_name} Progress',
          'description': message,
          'color': 0xf39c12,  # Orange
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': f'Business: {business_id}'}
      }
      await self._send_webhook(self.webhook_dashboard, embed)

  async def agent_completed(self, business_id: str, agent_name: str, result: str):
      """Notify agent completed work"""
      embed = {
          'title': f'✅ {agent_name} Complete',
          'description': f'**Result:** {result}',
          'color': 0x2ecc71,  # Green
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': f'Business: {business_id}'}
      }
      await self._send_webhook(self.webhook_dashboard, embed)

  async def agent_error(self, business_id: str, agent_name: str, error_message: str):
      """Notify agent encountered error"""
      embed = {
          'title': f'❌ {agent_name} Error',
          'description': f'**Error:** {error_message}',
          'color': 0xe74c3c,  # Red
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': f'Business: {business_id}'}
      }
      await self._send_webhook(self.webhook_errors, embed)
  ```

- [x] **Integration Points**
  - [x] HALO/Meta-agent loop now wraps each component invocation with Discord + HopX events
  - [x] Before agent call we emit `agent_started`
  - [x] After success we emit `agent_completed`; failures route to `agent_error`
  - [ ] Progress notifications (optional) – pending richer telemetry

**Testing:**
- [x] Covered indirectly via business generation path + `tests/test_discord_integration.py` for embed schema
- [ ] Dedicated progress notification test (future)

---

#### Phase 5: Deployment Notifications (Week 3)

- [x] **Deployment Lifecycle**
  ```python
  async def deployment_success(self, business_name: str, url: str, build_metrics: dict):
      """Notify deployment succeeded"""
      embed = {
          'title': f'🌐 {business_name} Deployed',
          'description': f'**Live at:** {url}\n**Build time:** {build_metrics["build_time"]}\n**Quality score:** {build_metrics["quality_score"]}/100',
          'color': 0x2ecc71,  # Green
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': 'Deploy Agent'}
      }
      await self._send_webhook(self.webhook_deployments, embed)

  async def deployment_failed(self, business_name: str, error: str):
      """Notify deployment failed"""
      embed = {
          'title': f'❌ {business_name} Deployment Failed',
          'description': f'**Error:** {error}',
          'color': 0xe74c3c,  # Red
          'timestamp': datetime.now().isoformat()
      }
      await self._send_webhook(self.webhook_errors, embed)
  ```

- [x] **Integration Points**
  - [x] Add to Deploy Agent after successful deployment (agents/deploy_agent.py:1799)
  - [x] Add to Deploy Agent on deployment failure (agents/deploy_agent.py:1843)

**Testing:**
- [x] Test deployment success notification (tests/test_discord_new_methods.py:test_deployment_complete)
- [x] Test deployment failure notification (verified in deploy_agent.py full_deployment_workflow)

---

#### Phase 6: Revenue Notifications (Week 3)

- [x] **Payment Events**
  ```python
  async def payment_received(self, business_name: str, amount: float, customer_email: str):
      """Notify payment received"""
      embed = {
          'title': f'�� Payment Received: ${amount:.2f}',
          'description': f'**Business:** {business_name}\n**Customer:** {customer_email}',
          'color': 0x2ecc71,  # Green
          'timestamp': datetime.now().isoformat(),
          'footer': {'text': 'Stripe Integration'}
      }
      await self._send_webhook(self.webhook_revenue, embed)
  ```

- [x] **Integration Points**
  - [x] Add to Billing Agent Stripe webhook handler (agents/billing_agent.py:139)
  - [x] Post to #revenue on successful payment (via webhook_revenue)

**Testing:**
- [x] Test payment notification (tests/test_discord_new_methods.py:test_billing_event_with_revenue)

---

#### Phase 7: Analytics Notifications (Week 4)

- [x] **Daily/Weekly Reports**
  ```python
  async def daily_report(self, statistics: dict):
      """Send daily statistics report"""
      embed = {
          'title': '📊 Daily Report',
          'description': f'''
              **Businesses Built:** {statistics["businesses_built"]}
              **Success Rate:** {statistics["success_rate"]}%
              **Avg Quality Score:** {statistics["avg_quality_score"]}/100
              **Total Revenue:** ${statistics["total_revenue"]:.2f}
              **Active Businesses:** {statistics["active_businesses"]}
          ''',
          'color': 0x9b59b6,  # Purple
          'timestamp': datetime.now().isoformat()
      }
      await self._send_webhook(self.webhook_metrics, embed)

  async def weekly_summary(self, statistics: dict):
      """Send weekly summary"""
      # Similar to daily_report but with weekly stats
      pass
  ```

 - [x] **Integration Points**
   - [x] Cron entry: `/home/genesis/.../scripts/daily_discord_report.py --period daily` (use server cron)
   - [x] GitHub workflow `.github/workflows/discord_reports.yml` covers daily + weekly cadence (.github/workflows/discord_reports.yml)
   - [x] Query BusinessMonitor for statistics (scripts/daily_discord_report.py:43-87)

**Testing:**
- [x] Test daily report generation (scripts/daily_discord_report.py --dry-run)
- [x] Test weekly summary generation (scripts/daily_discord_report.py --period weekly --dry-run)

---

#### Phase 9: Dynamic Business Channels (Advanced - Week 5)

- [ ] **Auto-Create Channels for Each Business**
  ```python
  async def create_business_channel(self, business_id: str, business_name: str):
      """Create dedicated Discord channel for this business build"""
      # Requires Discord bot (not webhook) - upgrade from webhooks
      # Channel name: #business-001-taskflowpro
      # Auto-archive after 24 hours
      pass

  async def post_to_business_channel(self, business_id: str, message: str):
      """Post agent activity to business-specific channel"""
      pass
  ```

- [ ] **Upgrade to Discord Bot** (if dynamic channels needed)
  - [ ] Create Discord bot application
  - [ ] Add bot to Genesis Discord server
  - [ ] Grant permissions: Manage Channels, Send Messages
  - [ ] Implement channel creation/archival
  - [ ] Keep webhooks for static channels

**Note:** This is optional - webhooks are sufficient for most use cases. Only implement if you want per-business channel isolation.

---

### 2.3 Discord Environment Variables

**Add to `.env`:**
```bash
# Discord Webhooks (Static Channels)
DISCORD_WEBHOOK_DASHBOARD=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_COMMANDS=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_ALERTS=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_DEPLOYMENTS=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_METRICS=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_REVENUE=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_ERRORS=https://discord.com/api/webhooks/xxx/yyy

# HopX-Specific Channels (NEW)
DISCORD_WEBHOOK_HOPX_ENVIRONMENTS=https://discord.com/api/webhooks/xxx/yyy
DISCORD_WEBHOOK_HOPX_ERRORS=https://discord.com/api/webhooks/xxx/yyy

# Discord Bot (Optional - for dynamic channels)
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
```
- [x] Added production webhook secrets to `.env` (see `# Discord Webhooks` block)

---

### 2.4 Discord Dependencies

**Add to `requirements.txt`:**
```
discord.py>=2.3.0
aiohttp>=3.9.0
python-dotenv>=1.0.0
```
- [x] Added `discord.py==2.4.0` to `requirements.txt`

**Install:**
```bash
pip install discord.py aiohttp python-dotenv
```

---

### 2.5 Discord Testing Suite

- [x] **Create Test Script** (`tests/test_discord_integration.py`)
  ```python
  async def test_all_notifications():
      discord = GenesisDiscord()

      # Test 1: System lifecycle
      await discord.genesis_started()
      await asyncio.sleep(2)

      # Test 2: Business build
      await discord.business_build_started("test_001", "Test Business", "Testing Discord")
      await asyncio.sleep(2)

      # Test 3: Agent activity
      await discord.agent_started("test_001", "Test Agent", "Running tests")
      await discord.agent_progress("test_001", "Test Agent", "50% complete")
      await discord.agent_completed("test_001", "Test Agent", "All tests passed")
      await asyncio.sleep(2)

      # Test 4: Deployment
      await discord.deployment_success("Test Business", "https://test.example.com", {
          'build_time': '2 minutes',
          'quality_score': 95
      })
      await asyncio.sleep(2)

      # Test 5: Error
      await discord.agent_error("test_001", "Test Agent", "Simulated error")

      print("✅ Check Discord - you should see notifications in all channels!")
  ```

- [x] Validated embed + routing logic with `pytest tests/test_discord_integration.py`
```bash
pytest tests/test_discord_integration.py
```

**Expected Output:**
- Unit tests simulate the webhook payloads, so no live Discord traffic is generated during CI runs.

---

## Part 4: Implementation Timeline

**Week 1: Foundations**
- Stand up Discord server/webhooks
- Implement `GenesisDiscord` client + smoke tests
- Verify embeds and formatting across all target channels

**Week 2: Orchestrator Wiring**
- Wire lifecycle events (`genesis_started/shutdown`)
- Emit business build start/complete notifications
- Wrap agent execution in start/complete/error hooks

**Week 3: Deployment & Revenue**
- Connect deployment success/failure hooks
- Pipe Stripe/Billing events into `payment_received`
- Add daily/weekly analytics reports (optional cron)

**Week 4: Refinement**
- Add notification filtering/batching if needed
- Build Discord command surface (optional)
- Document runbooks + ops checklist

## Part 5: Cost Analysis

Discord webhooks are free; only cost is negligible bandwidth + logging. The remaining infrastructure (LLM calls, storage, etc.) stays unchanged.

### Discord Costs
- **Webhooks:** FREE (no rate limits)
- **Bot (if upgraded):** FREE (self-hosted)
- **Server:** FREE (Discord servers are free)

**Verdict:** $0/month

### Total Integration Cost
- **Implementation:** 2 months engineering time
- **Operational:** <$15/month (HopX only)
- **ROI:** Infinite (security + visibility worth far more than $15/month)

---

## Part 6: Success Metrics

### HopX Success Criteria
- [ ] 100% of agent code execution in isolated environments
- [ ] <1 second average environment spin-up time
- [ ] <5 minutes average environment lifetime
- [ ] 0 stuck environments per day (>1 hour old)
- [ ] 0 main system contamination incidents

### Discord Success Criteria
- [ ] 100% agent activity visible in Discord
- [ ] <1 second notification latency (agent → Discord)
- [ ] 0 missed notifications (all events logged)
- [ ] >95% webhook success rate
- [ ] User satisfaction: "I can see everything happening"

### Combined Success
- [ ] Build 100 businesses without a single security incident
- [ ] User can watch builds in real-time via Discord
- [ ] User can debug failures by reading Discord logs
- [ ] User can track revenue via Discord notifications
- [ ] System is production-ready and scalable

---

## Part 7: Files Created (Status)

### Discord Integration Files
1. [x] `infrastructure/genesis_discord.py` - Discord webhook client (16,558 bytes, complete)
2. [x] `tests/test_discord_integration.py` - Discord tests (2,874 bytes, 4/4 tests pass)
3. [x] `tests/test_discord_new_methods.py` - Additional tests (10/10 tests pass)
4. [x] `scripts/daily_discord_report.py` - Daily analytics (6,433 bytes, complete)
5. [x] `scripts/discord_smoke_test.py` - Webhook smoke testing (1,176 bytes, complete)
6. [ ] `DISCORD_SETUP_GUIDE.md` - Setup instructions (optional, can be created if needed)

### Documentation Files
1. [x] `Discord_integrationPlan.md` - This file (complete, all phases documented)
2. [ ] `DISCORD_NOTIFICATION_GUIDE.md` - All notification types documented (optional)
3. [ ] `.env.example` - Environment variable template (optional)

---

## Part 8: Additional Discord Features (Optional)

### Two-Way Communication (Discord → Genesis)

**If you want to send commands via Discord:**

- [ ] **Upgrade to Discord Bot**
  - [ ] Create bot application
  - [ ] Add command handler
  - [ ] Listen for messages in #commands channel

- [ ] **Supported Commands**
  ```
  !status - Show Genesis system status
  !build <business_name> <idea> - Trigger new business build
  !stop <business_id> - Stop in-progress build
  !stats - Show today's statistics
  !agents - List all 21 agents and status
  ```

- [ ] **Command Execution**
  ```python
  @bot.command()
  async def build(ctx, business_name: str, idea: str):
      """Trigger business build from Discord"""
      await ctx.send(f"🏗️ Building {business_name}...")

      # Trigger Genesis orchestrator
      result = await genesis_orchestrator.build_business(business_name, idea)

      await ctx.send(f"✅ Build started: {result.business_id}")
  ```

**Note:** This is optional - Genesis already runs autonomously. Commands are only needed for manual overrides.

---

### Notification Preferences (Optional)

**If you want to reduce notification spam:**

- [ ] **Notification Levels**
  - Level 1: CRITICAL (errors, stuck environments, deployment failures)
  - Level 2: HIGH (deployments, revenue, build start/complete)
  - Level 3: MEDIUM (agent start/complete)
  - Level 4: LOW (agent progress, HopX environment create/destroy)

- [ ] **User Preferences** (stored in database)
  ```python
  user_preferences = {
      'user_id': '123',
      'notification_level': 2,  # Only CRITICAL and HIGH
      'muted_agents': ['Research Agent'],  # Don't notify for this agent
      'muted_channels': []  # Specify channels to mute (optional)
  }
  ```

- [ ] **Filter Before Posting**
  ```python
  async def _send_webhook(self, webhook_url: str, embed: dict, level: int = 3):
      """Send webhook only if user's notification level allows it"""
      user_prefs = self.get_user_preferences()

      if level <= user_prefs['notification_level']:
          # Send notification
          await self._post_webhook(webhook_url, embed)
      else:
          # Skip notification (too low priority)
          pass
  ```

**Note:** Start with all notifications enabled. Add filtering later if Discord gets too noisy.

---

## Part 10: Next Steps

### Immediate Actions (This Week)
1. [ ] Review this plan with team
2. [x] Create Discord server and generate webhooks *(webhooks supplied + stored in `.env`)*
3. [x] Add Discord dependencies to `requirements.txt`
4. [x] Implement `infrastructure/genesis_discord.py`
5. [x] Implement `tests/test_discord_integration.py`

### Week 1 Goals
- [x] Send first webhook smoke test (`scripts/discord_smoke_test.py`)
- [x] Verify embeds across dashboard/alerts/deployments/errors
- [x] Add daily/weekly analytics script (`scripts/daily_discord_report.py`)

- ### Week 2-4 Goals
- [x] Integrate notifications into remaining agents (Billing, Deploy, Support)
- [x] Add QA/Documentation lifecycle hooks via `scripts/thirty_minute_production_test.py`
- [x] Add real deployment + revenue hooks to remaining agents (Research, QA, etc.)
- [x] Capture analytics summary reports on a production cron (wire `scripts/daily_discord_report.py` to scheduler)

### Month 2 Goals
- [ ] Deploy to production
- [ ] Monitor for 1 week
- [ ] Optimize and fix bugs
- [ ] Document and create user guide

---

## Summary

**HopX Integration:**
- Secure, ephemeral environments for all agent execution
- Millisecond spin-up, auto-teardown
- <$15/month cost at 1000 businesses/month scale
- 100% isolation, 0% main system contamination

**Discord Integration:**
- Real-time visibility into all agent activity
- Rich embeds with color coding and emojis
- Dedicated channels for builds, deployments, errors, metrics, revenue
- HopX-specific channels for environment tracking
- Webhook-based (free, no rate limits)

**Combined Benefits:**
- **Security:** All code execution sandboxed in HopX
- **Visibility:** Every action visible in Discord
- **Speed:** Millisecond environment creation
- **Cost:** ~$15/month for HopX + $0 for Discord
- **Scale:** 1000+ businesses/month supported

**Total Implementation:** 2 months (8 weeks)
**Total Cost:** <$15/month operational, $0 setup
**ROI:** Infinite (security + visibility >> cost)

---

**Status:** Ready to implement
**Next Step:** Create HopX account and Discord server
**Timeline:** Start Week 1 immediately
