---
name: 'step-03-root-cause'
description: 'Identify potential root causes based on analysis'
workflow_path: '_bmad/sre/workflows/triage-issue'
thisStepFile: './step-03-root-cause.md'
nextStepFile: './step-04-generate-report.md'
---

# Step 3: Root Cause Identification

**Goal:** Identify potential root causes and investigation paths.

---

## AVAILABLE STATE

From previous steps:
- `{ticket_id}` - JIRA ticket identifier
- `{ticket_data}` - Complete ticket content
- `{issue_category}` - Issue classification
- `{assessed_severity}` - Severity level
- `{identified_patterns}` - Recognized patterns
- `{impact_assessment}` - Impact metrics

---

## ROOT CAUSE ANALYSIS

### 1. Apply 5 Whys Method

Based on the issue description and patterns, generate 5 Whys analysis:

```
Why 1: Why did the incident occur?
→ {immediate_cause}

Why 2: Why did {immediate_cause} happen?
→ {contributing_cause_1}

Why 3: Why did {contributing_cause_1} happen?
→ {contributing_cause_2}

Why 4: Why did {contributing_cause_2} happen?
→ {underlying_cause}

Why 5: Why did {underlying_cause} happen?
→ {root_cause_hypothesis}
```

Set `{root_cause_hypothesis}` based on analysis.

---

### 2. Category-Specific Root Cause Trees

#### Availability Issues
```
Service Down
├── Deployment failure
│   ├── Bad code change
│   ├── Configuration error
│   └── Rollback failure
├── Resource exhaustion
│   ├── Memory leak
│   ├── CPU saturation
│   └── Disk full
├── Dependency failure
│   ├── Database down
│   ├── Cache unavailable
│   └── External API failure
└── Infrastructure failure
    ├── Node failure
    ├── Network partition
    └── DNS issues
```

#### Latency Issues
```
Slow Responses
├── Database queries
│   ├── Missing indexes
│   ├── Lock contention
│   └── Connection pool exhaustion
├── Resource contention
│   ├── CPU throttling
│   ├── Memory pressure
│   └── Network saturation
├── External dependencies
│   ├── Slow API responses
│   ├── DNS resolution delays
│   └── TLS handshake overhead
└── Application issues
    ├── N+1 queries
    ├── Synchronous blocking
    └── Memory garbage collection
```

#### Capacity Issues
```
Resource Exhaustion
├── Traffic spike
│   ├── Legitimate growth
│   ├── Campaign/event traffic
│   └── Attack (DDoS)
├── Memory leak
│   ├── Application bug
│   ├── Cache unbounded growth
│   └── Connection leak
├── Connection exhaustion
│   ├── Pool too small
│   ├── Slow queries holding connections
│   └── Connection leak
└── Storage issues
    ├── Log rotation failure
    ├── Temp file accumulation
    └── Data growth exceeds capacity
```

Select applicable branches based on `{issue_category}` and `{identified_patterns}`.

---

### 3. Evidence Mapping

Map evidence from ticket to root cause hypotheses:

| Evidence | Supports Hypothesis |
|----------|---------------------|
| {evidence_1} | {hypothesis_1} |
| {evidence_2} | {hypothesis_1}, {hypothesis_2} |
| {evidence_3} | {hypothesis_2} |

Calculate confidence for each hypothesis:
- **High**: Multiple pieces of evidence directly support
- **Medium**: Some evidence, needs verification
- **Low**: Plausible but lacks direct evidence

Set `{root_cause_confidence}` (high/medium/low).

---

### 4. Investigation Recommendations

Based on hypotheses, recommend investigation steps:

**Immediate Checks:**
```bash
# Check recent deployments
kubectl rollout history deployment/{service}

# Check resource usage
kubectl top pods -n {namespace}

# Check logs for errors
kubectl logs deployment/{service} --since=1h | grep -i error

# Check database connectivity
psql -h {host} -c "SELECT 1"
```

**Metrics to Review:**
- Error rate: {prometheus_query_1}
- Latency: {prometheus_query_2}
- Saturation: {prometheus_query_3}

**Logs to Search:**
- Pattern: `{error_pattern}`
- Timeframe: {start_time} to {end_time}
- Components: {affected_components}

Set `{investigation_recommendations}` with specific steps.

---

### 5. Similar Incidents Reference

If knowledge base contains similar incidents:

| Incident | Similarity | Resolution |
|----------|------------|------------|
| {incident_1} | {similarity_%} | {how_resolved} |
| {incident_2} | {similarity_%} | {how_resolved} |

Set `{similar_incidents}` for reference.

---

## OUTPUT

Display root cause analysis:
```
🛡️ Root Cause Analysis.

Primary Hypothesis: {root_cause_hypothesis}
Confidence: {root_cause_confidence}

Evidence:
- {evidence_1}
- {evidence_2}

Investigation Path:
1. {investigation_step_1}
2. {investigation_step_2}
3. {investigation_step_3}

Similar Incidents: {similar_incidents or "None found"}

Generating report.
```

---

## NEXT STEP

Read fully and follow: `step-04-generate-report.md`
