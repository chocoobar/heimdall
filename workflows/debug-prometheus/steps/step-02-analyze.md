---
name: 'step-02-analyze'
description: 'Analyze query patterns and performance'
workflow_path: '_bmad/sre/workflows/debug-prometheus'
thisStepFile: './step-02-analyze.md'
nextStepFile: './step-03-optimize.md'
---

# Step 2: Analyze Query

**Goal:** Analyze query for patterns, potential issues, and performance concerns.

---

## ANALYSIS

### 1. Pattern Recognition

Identify query pattern:

| Pattern | Indicators |
|---------|------------|
| **Rate calculation** | `rate()`, `irate()`, `increase()` |
| **Aggregation** | `sum()`, `avg()`, `max()`, `min()` |
| **Histogram quantile** | `histogram_quantile()` |
| **Error rate** | Division with status filter |
| **Resource saturation** | CPU, memory, disk metrics |
| **SLO calculation** | Good/total ratio |

Set `{query_pattern}` based on detection.

---

### 2. Performance Analysis

Check for performance concerns:

| Concern | Check | Impact |
|---------|-------|--------|
| **High cardinality** | Many label combinations | Slow query, high memory |
| **Wide time range** | `[30d]` or larger | Slow query |
| **No aggregation** | Returns many series | High memory |
| **Expensive regex** | `=~".*"` patterns | Full scan |
| **Subquery** | `[5m:]` syntax | Expensive |

Set `{performance_concerns}` with findings.

---

### 3. Best Practice Check

Verify against PromQL best practices:

- [ ] Uses `rate()` on counters (not raw counter)
- [ ] Appropriate time window for rate (`[1m]` to `[5m]` typical)
- [ ] Aggregation reduces cardinality
- [ ] Labels in `by()` are necessary
- [ ] No redundant operations

Set `{best_practice_issues}` with findings.

---

### 4. Context Understanding

Based on query structure, infer purpose:

```
🛡️ Query Analysis.

Detected Pattern: {query_pattern}
Purpose: {inferred_purpose}

Example: "This query calculates the p99 latency 
across all API endpoints, grouped by service."
```

---

## OUTPUT

```
🛡️ Analysis complete.

Pattern: {query_pattern}
Performance: {concerns_count} concerns
Best Practices: {issues_count} issues

{concern_list}

Proceeding to optimization.
```

---

## NEXT STEP

Read fully and follow: `step-03-optimize.md`
