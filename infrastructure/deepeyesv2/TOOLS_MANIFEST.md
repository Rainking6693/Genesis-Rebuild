# DeepEyesV2 Phase 1 - Tools Measurement Manifest

## Tools Defined for Baseline Measurement (20 Total)

### Category: API (1 tool)

#### 1. anthropic_api
- **Description**: Anthropic Claude API calls
- **Category**: api
- **Test Parameters**: 
  - model: claude-3-5-haiku-20241022
  - max_tokens: 100
- **Integration**: MarketingAgent, ContentAgent, CodeReviewAgent
- **Typical Latency**: 50-200ms
- **Failure Modes**: Rate limiting, auth failures, context window exceeded

---

### Category: Database (3 tools)

#### 2. database_query
- **Description**: Genesis database operations
- **Category**: database
- **Test Parameters**:
  - operation: select
  - timeout_seconds: 5
- **Integration**: All agents
- **Typical Latency**: 10-100ms
- **Failure Modes**: Connection timeouts, query syntax errors, deadlocks

#### 3. mongodb_insert
- **Description**: MongoDB document insertion
- **Category**: database
- **Test Parameters**:
  - collection: agents
  - document_size_kb: 10
- **Integration**: ContentAgent, DatabaseDesignAgent
- **Typical Latency**: 20-150ms
- **Failure Modes**: Duplicate key errors, permission denied, storage quota exceeded

#### 4. mongodb_query
- **Description**: MongoDB query execution
- **Category**: database
- **Test Parameters**:
  - collection: agents
  - limit: 100
- **Integration**: AnalyticsAgent, BusinessGenerationAgent
- **Typical Latency**: 15-100ms
- **Failure Modes**: Slow queries, index misses, connection pool exhaustion

---

### Category: Cache (2 tools)

#### 5. cache_get
- **Description**: Distributed cache retrieval
- **Category**: cache
- **Test Parameters**:
  - key_prefix: genesis_
  - ttl_seconds: 3600
- **Integration**: AnalyticsAgent, CodeReviewAgent
- **Typical Latency**: 1-50ms
- **Failure Modes**: Cache miss, serialization errors, network timeouts

#### 6. cache_set
- **Description**: Distributed cache write
- **Category**: cache
- **Test Parameters**:
  - ttl_seconds: 3600
  - value_size_kb: 100
- **Integration**: ContentAgent, MarketingAgent
- **Typical Latency**: 5-100ms
- **Failure Modes**: Memory limit exceeded, write conflicts, eviction storms

---

### Category: External API (4 tools)

#### 7. stripe_payment
- **Description**: Stripe payment processing
- **Category**: external_api
- **Test Parameters**:
  - action: create_charge
  - amount_cents: 100
- **Integration**: BillingAgent, StripeIntegrationAgent
- **Typical Latency**: 200-1000ms
- **Failure Modes**: Declined cards, API quota, network failures, webhook timeouts

#### 8. email_send
- **Description**: Email service integration
- **Category**: external_api
- **Test Parameters**:
  - recipients: 1
  - priority: normal
- **Integration**: SupportAgent, MarketingAgent
- **Typical Latency**: 500-2000ms
- **Failure Modes**: Invalid email, spam filter, rate limits, provider down

#### 9. web_scraping
- **Description**: Web content retrieval
- **Category**: external_api
- **Test Parameters**:
  - timeout_seconds: 10
  - retry_count: 2
- **Integration**: ContentAgent, AnalyticsAgent
- **Typical Latency**: 1000-5000ms
- **Failure Modes**: Timeout, 404, robot.txt blocked, SSL errors

#### 10. webhook_delivery
- **Description**: Webhook event delivery
- **Category**: external_api
- **Test Parameters**:
  - retry_count: 3
  - timeout_seconds: 5
- **Integration**: DeployAgent, AnalyticsAgent
- **Typical Latency**: 100-1000ms
- **Failure Modes**: Endpoint down, timeout, invalid signature, rate limit

---

### Category: ML (1 tool)

#### 11. vector_embedding
- **Description**: Vector embedding generation
- **Category**: ml
- **Test Parameters**:
  - dimension: 1536
  - model: text-embedding-004
- **Integration**: ContentAgent, AnalyticsAgent
- **Typical Latency**: 50-500ms
- **Failure Modes**: Model overload, dimension mismatch, invalid text encoding

---

### Category: Storage (2 tools)

#### 12. file_storage_upload
- **Description**: Cloud file storage upload
- **Category**: storage
- **Test Parameters**:
  - file_size_mb: 1
  - timeout_seconds: 30
- **Integration**: SupportAgent, DeployAgent
- **Typical Latency**: 500-5000ms
- **Failure Modes**: Network error, quota exceeded, permission denied, corrupted file

#### 13. file_storage_download
- **Description**: Cloud file storage download
- **Category**: storage
- **Test Parameters**:
  - file_size_mb: 1
  - timeout_seconds: 30
- **Integration**: AnalyticsAgent, ContentAgent
- **Typical Latency**: 500-3000ms
- **Failure Modes**: File not found, access denied, network timeout, corruption

---

### Category: Queue (1 tool)

#### 14. async_job_queue
- **Description**: Asynchronous job queue submission
- **Category**: queue
- **Test Parameters**:
  - priority: normal
  - timeout_seconds: 10
- **Integration**: DeployAgent, BusinessGenerationAgent
- **Typical Latency**: 10-100ms
- **Failure Modes**: Queue full, invalid priority, worker crash, deserialization error

---

### Category: Auth (1 tool)

#### 15. auth_validation
- **Description**: Authentication token validation
- **Category**: auth
- **Test Parameters**:
  - algorithm: HS256
  - ttl_seconds: 3600
- **Integration**: All agents
- **Typical Latency**: 5-50ms
- **Failure Modes**: Invalid signature, expired token, revoked key, parsing error

---

### Category: Middleware (1 tool)

#### 16. rate_limiter
- **Description**: Rate limiting check
- **Category**: middleware
- **Test Parameters**:
  - requests_per_second: 100
  - bucket_size: 1000
- **Integration**: All agents
- **Typical Latency**: 1-20ms
- **Failure Modes**: Rate limit exceeded, state corruption, clock skew, storage failure

---

### Category: Logging (1 tool)

#### 17. logging_service
- **Description**: Structured logging to central service
- **Category**: logging
- **Test Parameters**:
  - log_level: info
  - batch_size: 100
- **Integration**: All agents
- **Typical Latency**: 10-100ms
- **Failure Modes**: Logging service down, invalid format, buffer overflow, loss of messages

---

### Category: Monitoring (1 tool)

#### 18. metrics_export
- **Description**: Metrics export to monitoring service
- **Category**: monitoring
- **Test Parameters**:
  - metric_count: 50
  - export_interval_seconds: 60
- **Integration**: All agents
- **Typical Latency**: 50-500ms
- **Failure Modes**: Incompatible format, dimension limit, network error, storage quota

---

### Category: Config (1 tool)

#### 19. config_lookup
- **Description**: Configuration service lookup
- **Category**: config
- **Test Parameters**:
  - cache_enabled: true
  - ttl_seconds: 300
- **Integration**: All agents
- **Typical Latency**: 5-100ms
- **Failure Modes**: Config not found, invalid format, cache corruption, service down

---

### Category: Health (1 tool)

#### 20. health_check
- **Description**: Service health check endpoint
- **Category**: health
- **Test Parameters**:
  - timeout_seconds: 5
  - retry_count: 1
- **Integration**: DeployAgent, AnalyticsAgent
- **Typical Latency**: 100-500ms
- **Failure Modes**: Service down, slow response, invalid response, connection refused

---

## Tool Coverage Summary

| Category | Count | Tools |
|----------|-------|-------|
| API | 1 | anthropic_api |
| Database | 3 | database_query, mongodb_insert, mongodb_query |
| Cache | 2 | cache_get, cache_set |
| External API | 4 | stripe_payment, email_send, web_scraping, webhook_delivery |
| ML | 1 | vector_embedding |
| Storage | 2 | file_storage_upload, file_storage_download |
| Queue | 1 | async_job_queue |
| Auth | 1 | auth_validation |
| Middleware | 1 | rate_limiter |
| Logging | 1 | logging_service |
| Monitoring | 1 | metrics_export |
| Config | 1 | config_lookup |
| Health | 1 | health_check |
| **TOTAL** | **20** | |

## Tool-Agent Mapping

### By Agent

**MarketingAgent**
- anthropic_api, email_send, stripe_payment, database_query, cache_set

**ContentAgent**
- anthropic_api, vector_embedding, mongodb_insert, cache_set, cache_get

**AnalyticsAgent**
- mongodb_query, cache_get, metrics_export, config_lookup, web_scraping

**CodeReviewAgent**
- anthropic_api, database_query, cache_get, auth_validation

**DatabaseDesignAgent**
- mongodb_insert, mongodb_query, database_query, auth_validation

**SupportAgent**
- email_send, file_storage_upload, logging_service, database_query

**DeployAgent**
- webhook_delivery, async_job_queue, file_storage_download, health_check

**StripeIntegrationAgent**
- stripe_payment, database_query, auth_validation, logging_service

**BillingAgent**
- stripe_payment, database_query, cache_get, config_lookup

## Latency Profiles

### Fast (<50ms)
- auth_validation
- cache_get
- rate_limiter
- config_lookup (cached)
- async_job_queue

### Medium (50-500ms)
- anthropic_api
- vector_embedding
- database_query
- mongodb_insert
- mongodb_query
- logging_service
- cache_set
- metrics_export
- health_check

### Slow (>500ms)
- stripe_payment (200-1000ms)
- email_send (500-2000ms)
- web_scraping (1000-5000ms)
- file_storage_upload (500-5000ms)
- file_storage_download (500-3000ms)
- webhook_delivery (100-1000ms)

## Reliability Profiles

### Critical Path (Must be >95%)
- auth_validation
- database_query
- config_lookup
- rate_limiter
- cache_get

### Important Path (Must be >90%)
- anthropic_api
- mongodb_query
- mongodb_insert
- async_job_queue
- logging_service

### Degradable Path (>80% acceptable)
- stripe_payment
- email_send
- web_scraping
- webhook_delivery
- file_storage operations

## Adding New Tools

To add a new tool to the baseline measurement:

1. **Update BaselineMeasurement._define_tools_to_measure()**:
```python
'new_tool': {
    'category': 'category_name',
    'description': 'Tool description',
    'test_params': {'param1': 'value1', 'param2': 'value2'}
}
```

2. **Update TOOLS_MANIFEST.md** with tool details

3. **Run baseline measurement**:
```python
measurement = BaselineMeasurement()
results = await measurement.run_baseline_measurement()
```

4. **Verify in results**:
```python
assert 'new_tool' in results['tool_statistics']['tools']
```

## Removing Tools

To remove a tool (e.g., deprecated integration):

1. Delete entry from `_define_tools_to_measure()` dict
2. Update documentation
3. Run baseline to verify removal

## Tool Dependencies

Some tools depend on others:
- **mongodb_insert** → auth_validation (JWT token)
- **mongodb_query** → auth_validation (JWT token)
- **cache_set** → auth_validation (distributed cache auth)
- **file_storage_upload** → auth_validation (S3/GCS credentials)
- **webhook_delivery** → config_lookup (webhook URLs)

## Baseline Success Rate Targets

**Phase 1 Baseline** (Current):
- All tools: 100% (simulated)

**Phase 2 Production** (Projected):
- Critical path: 99%+
- Important path: 95%+
- Degradable path: 90%+

## References

- DeepEyesV2 Paper: arXiv:2511.05271
- Tool Implementation: infrastructure/deepeyesv2/tool_baseline.py
- Integration Guide: infrastructure/deepeyesv2/INTEGRATION_GUIDE.md
- Architecture: infrastructure/deepeyesv2/ARCHITECTURE.md
