---
name: 'step-02-analyze-issue'
description: 'Analyze issue details and identify patterns'
workflow_path: '_bmad/sre/workflows/triage-issue'
thisStepFile: './step-02-analyze-issue.md'
nextStepFile: './step-03-root-cause.md'
---

# Step 2: Issue Analysis

**Goal:** Analyze ticket content to identify issue type, severity, and patterns.

---

## AVAILABLE STATE

From previous step:
- `{ticket_id}` - JIRA ticket identifier
- `{ticket_data}` - Complete ticket content
- `{mcp_status}` - MCP connection status

---

## ANALYSIS FRAMEWORK

### 1. Issue Classification

Categorize the issue:

| Category | Indicators |
|----------|------------|
| **Availability** | Service down, 5xx errors, health check failures |
| **Latency** | Slow responses, timeouts, degraded performance |
| **Correctness** | Wrong results, data corruption, logic errors |
| **Capacity** | Resource exhaustion, scaling issues, throttling |
| **Security** | Auth failures, suspicious activity, vulnerabilities |
| **External** | Third-party API issues, dependency failures |

Set `{issue_category}` based on analysis.

---

### 2. Severity Assessment

Evaluate severity based on SRE criteria:

**P1 - Critical:**
- [ ] >50% users affected
- [ ] Complete service outage
- [ ] Data integrity at risk
- [ ] Security incident
- [ ] Revenue-impacting

**P2 - High:**
- [ ] 10-50% users affected
- [ ] Significant degradation
- [ ] Workaround difficult or impossible
- [ ] SLO breach likely

**P3 - Medium:**
- [ ] <10% users affected
- [ ] Minor degradation
- [ ] Workaround available
- [ ] Within error budget

**P4 - Low:**
- [ ] Minimal impact
- [ ] Cosmetic issues
- [ ] Enhancement requests

Set `{assessed_severity}` (P1/P2/P3/P4).

---

### 3. Pattern Recognition

Scan for known patterns:

**Error Patterns:**
```
- OOMKilled
- Connection refused
- Timeout exceeded
- Rate limit exceeded
- SSL/TLS errors
- Authentication failures
- Database deadlock
- Connection pool exhausted
```

**Timing Patterns:**
```
- Deploy correlation (issue started after deployment)
- Traffic spike correlation
- Time of day patterns (batch jobs, peak hours)
- Day of week patterns
- Monthly patterns (end-of-month processing)
```

**Component Patterns:**
```
- Single component affected
- Multiple components affected
- Cascade failure pattern
- Dependency failure propagation
```

Set `{identified_patterns}` with findings.

---

### 4. Impact Assessment

Calculate impact metrics:

| Metric | Value | Method |
|--------|-------|--------|
| **Users Affected** | {number} | From ticket or estimate |
| **Duration** | {time} | Started {timestamp} |
| **Transactions Impacted** | {number} | From metrics if available |
| **SLO Impact** | {percentage} | Error budget consumed |

Set `{impact_assessment}` with values.

---

### 5. Related Issues

Check for:
- [ ] Previous similar incidents
- [ ] Linked JIRA tickets
- [ ] Known issues for affected components
- [ ] Recent changes to affected components

Set `{related_issues}` if found.

---

## OUTPUT

Display analysis summary:
```
🛡️ Issue Analysis Complete.

Category: {issue_category}
Assessed Severity: {assessed_severity}
Current Priority: {current_priority}

Patterns Identified:
- {pattern_1}
- {pattern_2}

Impact:
- Users: {affected_users}
- Duration: {duration}
- SLO Impact: {slo_impact}

Related: {related_issues or "None identified"}

Proceeding to root cause analysis.
```

---

## NEXT STEP

Read fully and follow: `step-03-root-cause.md`
