---
name: 'step-01-parse-query'
description: 'Parse and validate PromQL syntax'
workflow_path: '_bmad/sre/workflows/debug-prometheus'
thisStepFile: './step-01-parse-query.md'
nextStepFile: './step-02-analyze.md'
---

# Step 1: Parse and Validate Query

**Goal:** Parse user's PromQL query and validate syntax.

---

## EXECUTION SEQUENCE

### 1. Get Query Input

If query not provided in workflow input:

```
🛡️ Debug Prometheus Query.

Paste your PromQL query:
```

**WAIT for user input.**

Store in `{original_query}`.

---

### 2. Syntax Validation

Validate PromQL syntax:

**Check for:**
- [ ] Balanced parentheses
- [ ] Valid metric names (alphanumeric, underscores, colons)
- [ ] Valid label matchers (`=`, `!=`, `=~`, `!~`)
- [ ] Valid function names
- [ ] Valid aggregation operators
- [ ] Proper range vector syntax `[5m]`
- [ ] Valid binary operators

**Common Syntax Errors:**

| Error | Example | Fix |
|-------|---------|-----|
| Missing closing parenthesis | `sum(rate(m[5m])` | Add `)` |
| Invalid regex | `{name=~"*foo"}` | `{name=~".*foo"}` |
| Missing rate on counter | `http_requests_total` | `rate(http_requests_total[5m])` |
| Invalid duration | `[5min]` | `[5m]` |
| Comparing vectors incorrectly | `m1 + m2 == 0` | Use proper comparison |

---

### 3. Report Syntax Status

**If valid:**
```
🛡️ Syntax: VALID

Query parsed successfully.
Metric(s): {detected_metrics}
Functions: {detected_functions}
```

**If invalid:**
```
🛡️ Syntax: ERROR

Issue: {error_description}
Location: {position}
Suggestion: {fix_suggestion}

Corrected query:
{suggested_correction}

Use corrected query? [Y/N]
```

**WAIT for user if error found.**

Set `{validated_query}` with corrected or original query.

---

## NEXT STEP

Read fully and follow: `step-02-analyze.md`
