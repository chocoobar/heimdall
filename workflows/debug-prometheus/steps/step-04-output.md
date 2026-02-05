---
name: 'step-04-output'
description: 'Generate output and test if endpoint available'
workflow_path: '_bmad/sre/workflows/debug-prometheus'
thisStepFile: './step-04-output.md'
nextStepFile: null
---

# Step 4: Output and Test

**Goal:** Provide final output and optionally test against Prometheus endpoint.

---

## TEST QUERY (Optional)

Check config for `{prometheus_endpoint}`:

**If configured:**
```
🛡️ Prometheus endpoint available.

Test query against {prometheus_endpoint}? [Y/N]
```

**WAIT for user input.**

If testing:
```bash
curl -s "{prometheus_endpoint}/api/v1/query" \
  --data-urlencode "query={optimized_query}" \
  | jq '.status, .data.resultType, .data.result | length'
```

Report result:
```
🛡️ Query test result.

Status: {success/error}
Result type: {vector/matrix/scalar}
Series returned: {count}
Execution time: {ms}ms
```

**If not configured:**
```
🛡️ No Prometheus endpoint configured.
Set prometheus_endpoint in _bmad/sre/config.yaml to enable testing.
```

---

## FINAL OUTPUT

```
🛡️ Query Debug Complete.

Original:
{original_query}

Validated: ✓
Optimized:
{optimized_query}

Summary:
- Syntax: {valid/fixed}
- Pattern: {query_pattern}
- Optimizations: {optimization_count}
- Performance: {improvement_estimate}

Recommendations:
{recommendations}
```

Save analysis to `{sre_artifacts}/prometheus/query-analysis-{date}.md` if requested.

---

## WORKFLOW COMPLETE

```
Continue with:
[1] Debug another query
[2] Return to Menu
```

**WAIT for user input.**
