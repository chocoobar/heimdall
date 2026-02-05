---
name: 'step-01-collect-context'
description: 'Gather performance context and data'
---

# Step 1: Collect Performance Context

**Goal:** Gather context about the performance issue.

---

## DATA COLLECTION

### 1. Problem Description

```
🛡️ Performance Analysis.

Describe the performance issue:
- What is slow? (API, DB query, page load, batch job)
- When did it start?
- How is it measured? (latency, throughput, errors)
- What's the current vs expected performance?
```

**WAIT for user input.**

---

### 2. Affected Components

```
🛡️ Component identification.

Which components are affected?
[1] Database queries
[2] API endpoints
[3] Background jobs
[4] Cache layer
[5] External services
[6] Infrastructure (CPU/Memory/Network)
[7] Multiple / Unknown
```

**WAIT for user input.**

---

### 3. Metrics Collection

If Prometheus configured, suggest queries:

```promql
# Latency
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint))

# Error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# Resource usage
avg(rate(container_cpu_usage_seconds_total[5m])) by (pod)
sum(container_memory_usage_bytes) by (pod)
```

Request metrics data or sample logs:
```
🛡️ Provide available data:
- Slow query logs
- APM traces
- Prometheus queries results
- Resource utilization data

Paste data or 'NONE' if unavailable:
```

**WAIT for user input.**

---

## NEXT STEP

Read fully and follow: `step-02-bottleneck-analysis.md`
