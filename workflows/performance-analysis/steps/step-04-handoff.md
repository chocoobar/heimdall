---
name: 'step-04-handoff'
description: 'Generate report and handoff to dev agent if needed'
---

# Step 4: Report and Handoff

**Goal:** Generate performance report and coordinate with dev agent if code changes needed.

---

## GENERATE REPORT

Save report to `{sre_artifacts}/performance/analysis-{date}.md`:

```markdown
# Performance Analysis Report

**Date:** {date}
**Analyst:** Heimdall

## Summary
{performance_issue_summary}

## Bottleneck Analysis
{bottleneck_details}

## Optimizations
{optimization_list_with_code}

## Implementation Priority
| # | Optimization | Impact | Effort | Priority |
|---|--------------|--------|--------|----------|
| 1 | {opt_1} | {impact} | {effort} | P1 |

## Validation Plan
- Metric to monitor: {metric}
- Expected improvement: {percentage}
- Rollback criteria: {criteria}
```

---

## DEV AGENT HANDOFF

If code changes generated:

```
🛡️ Code optimizations ready for review.

Handoff to dev agent (Amelia)? [Y/N]
```

**WAIT for user input.**

If handoff requested, format for dev agent:

```yaml
handoff:
  from: Heimdall (SRE)
  to: Amelia (Dev)
  type: code_review
  context: "Performance optimization - {bottleneck_type}"
  files:
    - path: {file_path}
      language: {language}
      changes: |
        {generated_code}
  test_requirements:
    - {test_1}
    - {test_2}
  acceptance_criteria:
    - Latency p99 < {target}ms
    - No regression in existing tests
```

---

## FINAL OUTPUT

```
🛡️ Performance analysis complete.

Report: {report_path}
Optimizations: {count}
Priority: {p1_count} immediate, {p2_count} short-term

Next steps:
1. Review generated optimizations
2. Test in staging environment
3. Monitor metrics post-deployment

{handoff_status}
```

---

## WORKFLOW COMPLETE
