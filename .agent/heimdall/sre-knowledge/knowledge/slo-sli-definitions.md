# SLO/SLI Definitions

## Overview

Service Level Objectives (SLOs) and Service Level Indicators (SLIs) are foundational to SRE practice. This knowledge fragment provides definitions, calculation methods, and implementation guidance.

---

## 1. Core Concepts

### Definitions

| Term | Definition | Example |
|------|------------|---------|
| **SLI** | A quantitative measure of service behavior | Request latency, error rate |
| **SLO** | A target value or range for an SLI | 99.9% of requests < 200ms |
| **SLA** | A legal contract with consequences for missing SLO | 99.9% uptime or credits |
| **Error Budget** | The difference between 100% and the SLO | 0.1% for 99.9% SLO |

### The Hierarchy

```
SLA (External Promise)
  └── SLO (Internal Target)
        └── SLI (Measured Metric)
              └── Instrumentation (Data Collection)
```

### Error Budget Philosophy

```
Error Budget = 100% - SLO

For 99.9% availability SLO:
- Error Budget = 0.1%
- Per month (30 days) = 43.2 minutes of downtime
- Per quarter = ~2.16 hours
- Per year = ~8.64 hours
```

---

## 2. Common SLI Types

### Availability SLI

**Definition:** The proportion of valid requests served successfully.

```
Availability = Successful Requests / Total Valid Requests
```

**Prometheus Implementation:**
```promql
# Request-based availability
sum(rate(http_requests_total{status!~"5.."}[5m]))
  /
sum(rate(http_requests_total[status!~"4.."}[5m]))

# Time-based availability (uptime)
avg_over_time(up{job="api-server"}[30d])
```

**Typical Targets:**
| Tier | Availability | Monthly Downtime |
|------|--------------|------------------|
| Tier 1 (Critical) | 99.99% | 4.3 minutes |
| Tier 2 (Important) | 99.9% | 43.2 minutes |
| Tier 3 (Standard) | 99.5% | 3.6 hours |
| Tier 4 (Best Effort) | 99% | 7.2 hours |

### Latency SLI

**Definition:** The proportion of valid requests served faster than a threshold.

```
Latency SLI = Requests Faster Than Threshold / Total Requests
```

**Prometheus Implementation:**
```promql
# Requests faster than 200ms
sum(rate(http_request_duration_seconds_bucket{le="0.2"}[5m]))
  /
sum(rate(http_request_duration_seconds_count[5m]))

# p99 latency (for monitoring, not SLO)
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

**Typical Targets:**
| Use Case | p50 Target | p99 Target |
|----------|------------|------------|
| API Response | < 50ms | < 200ms |
| Web Page Load | < 1s | < 3s |
| Background Job | < 5s | < 30s |
| Batch Processing | < 1min | < 5min |

### Throughput SLI

**Definition:** The rate at which the system can handle requests.

```promql
# Requests per second
sum(rate(http_requests_total[5m]))

# Minimum throughput SLO
sum(rate(http_requests_total[5m])) >= 1000
```

### Freshness SLI

**Definition:** How up-to-date data is (for data pipelines, caches).

```
Freshness = Now - Last Update Time < Threshold
```

**Prometheus Implementation:**
```promql
# Data pipeline freshness (last record processed)
time() - max(last_record_timestamp) < 300  # 5 minute threshold

# Replication lag
pg_replication_lag_seconds < 1
```

### Correctness SLI

**Definition:** The proportion of valid output produced by the system.

```
Correctness = Correct Results / Total Results
```

*Note: Often requires external validation (checksums, reconciliation).*

---

## 3. Choosing SLOs

### Step 1: Identify Critical User Journeys

```
1. User logs in
2. User views dashboard
3. User creates order
4. System sends notification
5. User receives confirmation
```

### Step 2: Define SLIs for Each Journey

| Journey | SLI Type | Measurement |
|---------|----------|-------------|
| Login | Availability | Login success rate |
| Login | Latency | Time to auth < 500ms |
| Dashboard | Availability | Data loads successfully |
| Dashboard | Freshness | Data < 1 min old |
| Create Order | Availability | Order creation success |
| Create Order | Latency | < 2s to confirm |

### Step 3: Set Realistic Targets

**Start with current performance:**
```promql
# Current p99 latency
histogram_quantile(0.99, sum(rate(http_duration_bucket[7d])) by (le))

# Current availability
avg_over_time(
  (sum(rate(http_requests_total{status!~"5.."}[5m]))
    / sum(rate(http_requests_total[5m]))
  )[7d:5m]
)
```

**Target slightly better than current:**
- If current availability is 99.85%, target 99.9%
- If current p99 latency is 180ms, target 200ms

### Step 4: Validate with Stakeholders

| Question | Consideration |
|----------|---------------|
| What's the user expectation? | Don't promise more than users need |
| What's the cost to achieve? | 99.99% costs much more than 99.9% |
| What's the business impact? | Revenue-critical needs higher SLO |
| What's achievable? | Don't set impossible targets |

---

## 4. Error Budget Policies

### Error Budget Consumption Tracking

```promql
# Error budget remaining (30-day window, 99.9% SLO)
1 - (
  (1 - avg_over_time(
    (sum(rate(http_requests_total{status!~"5.."}[5m]))
       / sum(rate(http_requests_total[5m]))
    )[30d:5m]
  )) / 0.001  # 0.001 = 100% - 99.9%
)
```

### Error Budget Burn Rate

```
Burn Rate = Actual Error Rate / Allowed Error Rate

For 99.9% SLO (0.1% error budget):
- Burn rate 1.0 = consuming budget at expected rate
- Burn rate 10.0 = budget exhausted in 3 days instead of 30
```

**Multi-Window Burn Rate Alerts:**

| Severity | Short Window | Long Window | Burn Rate |
|----------|--------------|-------------|-----------|
| Page | 5m | 1h | 14.4x |
| Ticket (fast) | 30m | 6h | 6x |
| Ticket (slow) | 2h | 24h | 3x |

### Error Budget Policies

**When budget is healthy (>50% remaining):**
- Feature development continues
- Risk-tolerant changes allowed
- Experimentation encouraged

**When budget is low (20-50% remaining):**
- Increase code review rigor
- Limit risky deployments
- Focus on reliability improvements

**When budget is exhausted (<20% or negative):**
- Feature freeze
- All hands on reliability
- Postmortem required for any incident
- No risky changes without explicit approval

---

## 5. SLO Implementation

### SLO Document Template

```yaml
# slo-api-service.yaml
service: api-service
owner: platform-team
review_date: 2026-03-01

slos:
  - name: availability
    description: API requests complete successfully
    sli:
      type: availability
      good: http_requests_total{status!~"5.."}
      total: http_requests_total
      window: 30d
    objective: 99.9%
    
  - name: latency
    description: API requests complete within threshold
    sli:
      type: latency
      good: http_request_duration_seconds_bucket{le="0.2"}
      total: http_request_duration_seconds_count
      window: 30d
    objective: 99%
    percentile: p99
    threshold: 200ms

alerting:
  burn_rate_alerts:
    - severity: page
      short_window: 5m
      long_window: 1h
      burn_rate: 14.4
    - severity: ticket
      short_window: 30m
      long_window: 6h
      burn_rate: 6
```

### Prometheus Recording Rules

```yaml
groups:
  - name: slo-api-service
    interval: 30s
    rules:
      # Request count
      - record: slo:http_requests:total5m
        expr: sum(rate(http_requests_total[5m]))
        
      # Success count
      - record: slo:http_requests:success5m
        expr: sum(rate(http_requests_total{status!~"5.."}[5m]))
        
      # Availability SLI
      - record: slo:http_requests:availability5m
        expr: slo:http_requests:success5m / slo:http_requests:total5m
        
      # Error budget (30 day rolling)
      - record: slo:http_requests:error_budget_remaining
        expr: |
          1 - (
            (1 - avg_over_time(slo:http_requests:availability5m[30d]))
            / 0.001
          )
```

### Alerting Rules

```yaml
groups:
  - name: slo-alerts-api-service
    rules:
      # Page: 14.4x burn rate for 5m/1h windows
      - alert: SLOBurnRateCritical
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            / sum(rate(http_requests_total[5m]))
          ) > 14.4 * 0.001
          AND
          (
            sum(rate(http_requests_total{status=~"5.."}[1h]))
            / sum(rate(http_requests_total[1h]))
          ) > 14.4 * 0.001
        for: 2m
        labels:
          severity: page
        annotations:
          summary: "High SLO burn rate - 2% budget consumed in 1 hour"
          
      # Ticket: 6x burn rate for 30m/6h windows
      - alert: SLOBurnRateHigh
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[30m]))
            / sum(rate(http_requests_total[30m]))
          ) > 6 * 0.001
          AND
          (
            sum(rate(http_requests_total{status=~"5.."}[6h]))
            / sum(rate(http_requests_total[6h]))
          ) > 6 * 0.001
        for: 5m
        labels:
          severity: ticket
        annotations:
          summary: "Elevated SLO burn rate - 5% budget consumed in 6 hours"
```

---

## 6. Dashboard Design

### SLO Dashboard Components

1. **Error Budget Status (Hero Metric)**
   - Large number showing % remaining
   - Color-coded (green/yellow/red)

2. **Burn Rate Trend**
   - Line chart of burn rate over time
   - Reference lines at 1x, 6x, 14.4x

3. **SLI Over Time**
   - Rolling availability/latency chart
   - SLO target line

4. **Error Budget Depletion Forecast**
   - When will budget hit 0 at current rate?

5. **Incident Markers**
   - Annotations showing past incidents

### Grafana Panel Examples

```json
{
  "title": "Error Budget Remaining",
  "type": "stat",
  "targets": [{
    "expr": "slo:http_requests:error_budget_remaining * 100"
  }],
  "fieldConfig": {
    "defaults": {
      "unit": "percent",
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {"color": "red", "value": 0},
          {"color": "yellow", "value": 20},
          {"color": "green", "value": 50}
        ]
      }
    }
  }
}
```

---

## 7. SLO Review Process

### Weekly Review

- Check error budget status
- Review any budget-consuming incidents
- Assess if SLO is still appropriate

### Quarterly Review

- Evaluate if SLO targets need adjustment
- Review user feedback and expectations
- Assess cost of maintaining SLO
- Update documentation

### Review Questions

| Question | Action if Yes |
|----------|---------------|
| Are we consistently exceeding SLO? | Consider tightening SLO |
| Are we frequently missing SLO? | Improve reliability or loosen SLO |
| Has user expectation changed? | Adjust SLO accordingly |
| Is the SLI still measuring the right thing? | Update measurement |

---

## 8. Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Over-promising | SLO higher than achievable | Start conservative, tighten later |
| Under-promising | SLO lower than needed | Listen to user complaints |
| Too many SLOs | Focus fragmented | Limit to 3-5 per service |
| Wrong metric | SLI doesn't reflect user experience | Measure at the user boundary |
| No error budget policy | SLO without teeth | Define and enforce policies |
| Static SLOs | Never reviewed | Schedule regular reviews |

---

*Last updated: 2026-02-04*
*References: Google SRE Book, SLO Workshop materials*
