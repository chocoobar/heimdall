---
name: 'step-03-generate-optimizations'
description: 'Generate optimization recommendations and code'
---

# Step 3: Generate Optimizations

**Goal:** Generate specific optimization recommendations with code.

---

## OPTIMIZATION GENERATION

### Database Optimizations

If DB bottleneck identified:

**Index Recommendations:**
```sql
-- Recommended index for {query_pattern}
CREATE INDEX CONCURRENTLY idx_{table}_{columns}
ON {table} ({columns});

-- Expected improvement: {estimate}
```

**Query Rewrites:**
```sql
-- Before (slow)
{original_query}

-- After (optimized)
{optimized_query}

-- Improvement: {timing_before}ms → {timing_after}ms
```

---

### Application Optimizations

If application changes needed:

```
Language: {python/java/typescript/go}
Context: {what_this_fixes}
Test Requirements: {unit_tests_needed}
```

Generate code:
```{language}
# Before
{original_code}

# After (optimized)
{optimized_code}
```

---

### Infrastructure Optimizations

If infrastructure changes needed:

```yaml
# Resource adjustments
resources:
  requests:
    cpu: "{new_cpu}"
    memory: "{new_memory}"
  limits:
    cpu: "{new_cpu_limit}"
    memory: "{new_memory_limit}"
```

---

## OUTPUT

```
🛡️ Optimizations generated.

{count} optimizations identified:

1. {optimization_1}
   Impact: {expected_improvement}
   Risk: {low/medium/high}

2. {optimization_2}
   Impact: {expected_improvement}
   Risk: {low/medium/high}

Code generated for review.
```

---

## NEXT STEP

Read fully and follow: `step-04-handoff.md`
