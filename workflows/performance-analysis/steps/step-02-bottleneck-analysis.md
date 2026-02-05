---
name: 'step-02-bottleneck-analysis'
description: 'Identify performance bottlenecks'
---

# Step 2: Bottleneck Analysis

**Goal:** Identify root cause of performance issues.

---

## ANALYSIS FRAMEWORK

### 1. Database Analysis

If DB-related, check for:

| Issue | Indicators | Investigation |
|-------|------------|---------------|
| **N+1 Queries** | Many similar queries | Check ORM eager loading |
| **Missing Index** | Seq scan on large table | EXPLAIN ANALYZE |
| **Lock Contention** | Blocked queries | Check pg_locks |
| **Connection Exhaustion** | Connection timeouts | Check pool size |
| **Slow Queries** | High execution time | Slow query log |

Generate diagnostic queries:
```sql
-- Slow queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Missing indexes
SELECT * FROM pg_stat_user_tables
WHERE seq_scan > idx_scan AND n_live_tup > 10000;
```

---

### 2. Application Analysis

If application-related:

| Issue | Indicators | Investigation |
|-------|------------|---------------|
| **Memory Leak** | Growing memory usage | Heap profiling |
| **CPU Bound** | High CPU, low I/O wait | Profiling |
| **Blocking I/O** | Threads waiting | Thread dump |
| **GC Pressure** | GC pauses | GC logs |

---

### 3. Infrastructure Analysis

If infrastructure-related:

| Resource | Check | Command |
|----------|-------|---------|
| CPU | Utilization % | `kubectl top pods` |
| Memory | Usage vs limits | `kubectl describe pod` |
| Network | Latency, errors | Network metrics |
| Disk | I/O, space | `df -h`, iostat |

---

## OUTPUT

```
🛡️ Bottleneck identified.

Primary: {bottleneck_type}
Evidence: {evidence}
Impact: {latency_impact}

Secondary issues:
- {issue_1}
- {issue_2}

Proceeding to optimization.
```

---

## NEXT STEP

Read fully and follow: `step-03-generate-optimizations.md`
