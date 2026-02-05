# Prometheus Query Patterns

## Overview

This knowledge fragment contains common PromQL patterns, optimization tips, and debugging techniques for Prometheus queries. Use these patterns to build effective monitoring and alerting.

---

## 1. Core PromQL Concepts

### Metric Types

| Type | Description | Example |
|------|-------------|---------|
| **Counter** | Only increases (resets on restart) | `http_requests_total` |
| **Gauge** | Can increase or decrease | `node_memory_available_bytes` |
| **Histogram** | Buckets of observations | `http_request_duration_seconds_bucket` |
| **Summary** | Pre-calculated quantiles | `http_request_duration_seconds{quantile="0.99"}` |

### Time Range Selectors

```promql
# Instant vector (current value)
http_requests_total

# Range vector (values over time)
http_requests_total[5m]

# Offset (values from the past)
http_requests_total offset 1h

# @ modifier (value at specific time)
http_requests_total @ 1609459200
```

---

## 2. Request Rate Patterns (RED Method)

### Request Rate

```promql
# Basic rate (per-second over 5m window)
rate(http_requests_total[5m])

# By endpoint
rate(http_requests_total{handler=~"/api/.*"}[5m])

# Sum across all instances
sum(rate(http_requests_total[5m]))

# By service and method
sum by (service, method) (rate(http_requests_total[5m]))
```

### Error Rate

```promql
# 5xx error rate
sum(rate(http_requests_total{status=~"5.."}[5m]))
   /
sum(rate(http_requests_total[5m]))

# Error rate by endpoint
sum by (handler) (rate(http_requests_total{status=~"5.."}[5m]))
   /
sum by (handler) (rate(http_requests_total[5m]))

# Exclude specific error codes
sum(rate(http_requests_total{status=~"5..", status!="503"}[5m]))
```

### Duration (Latency)

```promql
# Average latency
rate(http_request_duration_seconds_sum[5m])
   /
rate(http_request_duration_seconds_count[5m])

# p50 (median) from histogram
histogram_quantile(0.5, 
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# p95 latency
histogram_quantile(0.95, 
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# p99 latency by service
histogram_quantile(0.99, 
  sum by (service, le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

---

## 3. Resource Saturation Patterns (USE Method)

### CPU

```promql
# CPU utilization percentage
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# CPU by mode
avg by (mode) (irate(node_cpu_seconds_total[5m])) * 100

# Container CPU usage
sum by (pod) (rate(container_cpu_usage_seconds_total[5m]))

# Container CPU limit usage (%)
sum by (pod) (rate(container_cpu_usage_seconds_total[5m]))
   /
sum by (pod) (container_spec_cpu_quota / container_spec_cpu_period) * 100
```

### Memory

```promql
# Available memory
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100

# Used memory
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) 
   / 
node_memory_MemTotal_bytes * 100

# Container memory usage
sum by (pod) (container_memory_usage_bytes{container!=""})

# Container memory limit usage (%)
sum by (pod) (container_memory_usage_bytes{container!=""})
   /
sum by (pod) (container_spec_memory_limit_bytes{container!=""}) * 100
```

### Disk

```promql
# Disk usage percentage
100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes)

# Disk I/O utilization
rate(node_disk_io_time_seconds_total[5m]) * 100

# Disk read/write throughput
rate(node_disk_read_bytes_total[5m])
rate(node_disk_written_bytes_total[5m])
```

### Network

```promql
# Network receive rate
rate(node_network_receive_bytes_total{device!="lo"}[5m])

# Network transmit rate
rate(node_network_transmit_bytes_total{device!="lo"}[5m])

# Network errors
rate(node_network_receive_errs_total[5m]) + rate(node_network_transmit_errs_total[5m])
```

---

## 4. SLO/SLI Patterns

### Availability SLI

```promql
# Availability (successful requests / total requests)
sum(rate(http_requests_total{status!~"5.."}[5m]))
   /
sum(rate(http_requests_total[5m]))

# Rolling 7-day availability
avg_over_time(
  (sum(rate(http_requests_total{status!~"5.."}[5m]))
     /
   sum(rate(http_requests_total[5m]))
  )[7d:5m]
)

# Availability excluding specific errors (e.g., 429 rate limits)
sum(rate(http_requests_total{status!~"5..", status!="429"}[5m]))
   /
sum(rate(http_requests_total{status!="429"}[5m]))
```

### Latency SLI

```promql
# Requests under threshold (e.g., <500ms)
sum(rate(http_request_duration_seconds_bucket{le="0.5"}[5m]))
   /
sum(rate(http_request_duration_seconds_count[5m]))

# Apdex score (satisfied < 0.5s, tolerating < 2s)
(
  sum(rate(http_request_duration_seconds_bucket{le="0.5"}[5m])) + 
  sum(rate(http_request_duration_seconds_bucket{le="2"}[5m])) / 2
)
   /
sum(rate(http_request_duration_seconds_count[5m]))
```

### Error Budget

```promql
# Target: 99.9% availability = 0.1% error budget

# Error budget remaining (30 days)
1 - (
  (1 - sum_over_time(
    (sum(rate(http_requests_total{status!~"5.."}[5m]))
       /
     sum(rate(http_requests_total[5m]))
    )[30d:5m]
  )) / 0.001
)

# Error budget burn rate
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
     /
  sum(rate(http_requests_total[1h]))
) / 0.001
```

---

## 5. Alerting Patterns

### Multi-Window Burn Rate Alerts

```promql
# Short window (5m) - catches fast burn
sum(rate(http_requests_total{status=~"5.."}[5m]))
   /
sum(rate(http_requests_total[5m])) > 14.4 * 0.001

AND

# Long window (1h) - confirms sustained burn
sum(rate(http_requests_total{status=~"5.."}[1h]))
   /
sum(rate(http_requests_total[1h])) > 14.4 * 0.001
```

### Absent Metric Detection

```promql
# Alert when metric is missing
absent(up{job="my-service"}) == 1

# Alert when metric stops being reported
absent_over_time(http_requests_total[5m])
```

### Predict Saturation

```promql
# Disk will fill in 4 hours
predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0

# Memory will exhaust in 2 hours
predict_linear(node_memory_MemAvailable_bytes[1h], 2*3600) < 0
```

---

## 6. Optimization Tips

### Common Performance Issues

| Issue | Bad Pattern | Better Pattern |
|-------|-------------|----------------|
| High cardinality | `{path=~".*"}` | `{path=~"/api/v1/users.*"}` |
| Expensive regex | `{name=~".*foo.*"}` | `{name=~"foo.*"}` or label filter |
| Too many labels | `by (a, b, c, d, e)` | Only aggregate needed labels |
| Wide range | `rate(m[30d])` | `avg_over_time(rate(m[5m])[30d:5m])` |
| No rate() | `http_requests_total` | `rate(http_requests_total[5m])` |

### Optimization Techniques

```promql
# BEFORE: High cardinality
sum by (path, method, status, instance, pod) (rate(http_requests_total[5m]))

# AFTER: Only needed dimensions
sum by (path, method) (rate(http_requests_total[5m]))

# BEFORE: Expensive subquery
max_over_time(rate(http_requests_total[5m])[1h:])

# AFTER: Recording rule
# Record: job:http_requests:rate5m = rate(http_requests_total[5m])
# Then query: max_over_time(job:http_requests:rate5m[1h])

# BEFORE: Repeated expensive calculation
(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]))
  + 
(rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])) * 2

# AFTER: Use recording rule or simplify
# Record: job:http_request_duration:avg5m = rate(...sum[5m]) / rate(...count[5m])
```

### Recording Rules Examples

```yaml
groups:
  - name: sli-recording-rules
    interval: 30s
    rules:
      # Request rate
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))
      
      # Error rate
      - record: job:http_errors:ratio5m
        expr: |
          sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
            /
          sum by (job) (rate(http_requests_total[5m]))
      
      # p99 latency
      - record: job:http_request_duration:p99_5m
        expr: |
          histogram_quantile(0.99,
            sum by (job, le) (rate(http_request_duration_seconds_bucket[5m]))
          )
```

---

## 7. Debugging Techniques

### Query Debugging Steps

1. **Start simple**: Query the raw metric first
   ```promql
   http_requests_total
   ```

2. **Add filters**: Narrow down to relevant labels
   ```promql
   http_requests_total{job="api-server", status=~"5.."}
   ```

3. **Add functions**: Apply aggregation
   ```promql
   sum(rate(http_requests_total{job="api-server", status=~"5.."}[5m]))
   ```

4. **Check cardinality**: Understand dimensions
   ```promql
   count(http_requests_total) by (job)
   ```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `no data` | Wrong label selector | Check available labels with `{__name__=~".*"}` |
| `vector cannot contain metrics with the same labelset` | Duplicate series | Add disambiguating label to `by()` |
| `many-to-many matching not allowed` | Mismatched vectors | Use `on()` and `group_left/group_right` |
| `comparisons between floats and strings` | Type mismatch | Check label vs value comparison |

### Cardinality Analysis

```promql
# Count total series
count({__name__=~".+"})

# Count series by metric name
count by (__name__) ({__name__=~".+"})

# Find high-cardinality metrics
topk(10, count by (__name__) ({__name__=~".+"}))

# Cardinality by label
count(http_requests_total) by (handler)
```

---

## 8. Quick Reference

### Function Cheat Sheet

| Function | Use Case | Example |
|----------|----------|---------|
| `rate()` | Per-second rate of counter | `rate(requests_total[5m])` |
| `irate()` | Instantaneous rate (volatile) | `irate(requests_total[5m])` |
| `increase()` | Total increase over time | `increase(requests_total[1h])` |
| `sum()` | Aggregate values | `sum by (job) (rate(requests[5m]))` |
| `avg()` | Average value | `avg(cpu_usage)` |
| `histogram_quantile()` | Percentiles from histogram | `histogram_quantile(0.99, ...)` |
| `predict_linear()` | Linear projection | `predict_linear(disk_free[1h], 4*3600)` |
| `delta()` | Difference over range | `delta(gauge_metric[1h])` |
| `deriv()` | Per-second derivative | `deriv(gauge_metric[5m])` |
| `absent()` | Missing metric alert | `absent(up{job="x"})` |
| `label_replace()` | Modify labels | `label_replace(m, "dst", "$1", "src", "(.*)")` |
| `clamp_max/min()` | Limit values | `clamp_max(metric, 100)` |
| `topk()/bottomk()` | Top/bottom N | `topk(5, sum by (pod) (cpu))` |

---

*Last updated: 2026-02-04*
*PromQL version: Prometheus 2.x compatible*
