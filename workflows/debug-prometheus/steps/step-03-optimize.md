---
name: 'step-03-optimize'
description: 'Suggest query optimizations'
workflow_path: '_bmad/sre/workflows/debug-prometheus'
thisStepFile: './step-03-optimize.md'
nextStepFile: './step-04-output.md'
---

# Step 3: Optimize Query

**Goal:** Generate optimized version of query with explanations.

---

## OPTIMIZATION RULES

### 1. Cardinality Reduction

**Before:**
```promql
sum by (path, method, status, instance, pod) (rate(http_requests_total[5m]))
```

**After:**
```promql
sum by (path, method) (rate(http_requests_total[5m]))
```

**Explanation:** Remove unnecessary labels from aggregation.

---

### 2. Regex Optimization

**Before:**
```promql
{name=~".*api.*"}
```

**After:**
```promql
{name=~"api.*"} # If prefix match works
# Or use label filter
{component="api"}
```

**Explanation:** Avoid leading wildcards in regex.

---

### 3. Recording Rule Candidates

If query is used frequently, suggest recording rule:

```yaml
groups:
  - name: optimizations
    rules:
      - record: {suggested_name}
        expr: {optimized_query}
```

---

### 4. Rate Window Adjustment

For volatile metrics:
```promql
# Too short (noisy)
rate(metric[30s])

# Better
rate(metric[2m])
```

For trending:
```promql
# More stable
rate(metric[5m])
```

---

## GENERATE OPTIMIZED QUERY

Apply applicable optimizations:

```
🛡️ Optimizations Applied.

Original:
{original_query}

Optimized:
{optimized_query}

Changes:
1. {change_1}: {explanation}
2. {change_2}: {explanation}

Expected improvement: {performance_gain}
```

Set `{optimized_query}` with result.

---

## NEXT STEP

Read fully and follow: `step-04-output.md`
