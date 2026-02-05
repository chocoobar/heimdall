---
name: 'slo-sli-tracking-steps'
description: 'Combined SLO/SLI tracking workflow steps'
---

# SLO/SLI Tracking Workflow

## Step 1: Define SLIs

```
🛡️ SLO Definition.

Service: _______

Select SLI types:
[1] Availability (successful requests / total)
[2] Latency (requests under threshold)
[3] Throughput (requests per second)
[4] Freshness (data staleness)
[5] Correctness (valid outputs)
```

**WAIT for user input.**

For each selected SLI, collect:

**Availability:**
```
Good event query: {query for successful requests}
Total event query: {query for all requests}
```

**Latency:**
```
Threshold: ___ms (e.g., 200ms)
Percentile: p50 / p95 / p99
Good event query: {requests under threshold}
```

Generate SLI definition:
```yaml
slis:
  - name: availability
    type: request_success
    good: http_requests_total{status!~"5.."}
    total: http_requests_total
    
  - name: latency
    type: latency_threshold
    good: http_request_duration_seconds_bucket{le="0.2"}
    total: http_request_duration_seconds_count
    threshold: 200ms
    percentile: p99
```

---

## Step 2: Set Objectives

```
🛡️ SLO Targets.

For each SLI, set target:

Availability: ___% (e.g., 99.9%)
Latency (p99 < 200ms): ___% of requests

Window: [7d] [28d] [30d]
```

**Calculate error budget:**

| SLO | Target | Error Budget | Per Window |
|-----|--------|--------------|------------|
| Availability | 99.9% | 0.1% | 43min/30d |
| Latency | 99% | 1% | 7.2h/30d |

---

## Step 3: Generate Artifacts

**Prometheus Recording Rules:**
```yaml
groups:
  - name: slo-{service}
    interval: 30s
    rules:
      - record: slo:{service}:availability:rate5m
        expr: |
          sum(rate(http_requests_total{status!~"5.."}[5m]))
          / sum(rate(http_requests_total[5m]))
          
      - record: slo:{service}:error_budget_remaining
        expr: |
          1 - ((1 - slo:{service}:availability:rate5m) / 0.001)
```

**Alerting Rules:**
```yaml
groups:
  - name: slo-alerts-{service}
    rules:
      - alert: SLOBurnRateCritical
        expr: slo:{service}:burn_rate_1h > 14.4
        for: 2m
        labels:
          severity: page
```

**Dashboard Config (Grafana JSON):**
Generate panels for:
- Error budget remaining (gauge)
- Burn rate (time series)
- SLI over time (time series)

```
🛡️ SLO artifacts generated.

Service: {service}
SLIs defined: {count}
SLO targets set: {count}

Outputs:
- SLO document: {path}
- Recording rules: {path}
- Alert rules: {path}
- Dashboard: {path}

Next: Deploy rules to Prometheus.
```
