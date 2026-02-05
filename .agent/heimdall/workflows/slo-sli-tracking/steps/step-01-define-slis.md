---
name: 'step-01-define-slis'
description: 'Define Service Level Indicators'
workflow_path: 'workflows/slo-sli-tracking'
thisStepFile: './step-01-define-slis.md'
nextStepFile: './step-02-set-objectives.md'
---

# Step 1: Define Service Level Indicators (SLIs)

**Goal:** Identify critical user journeys and define indicators to measure them.

---

## EXECUTION SEQUENCE

### 1. Identify Service

If `{service_name}` not provided:

```
🛡️ SLO Definition.

Service Name: {service_name or input}
```

**WAIT for user input.**

Store `{service_name}`.

### 2. Select SLI Types

Ask which SLIs are relevant:

```
Select SLI types for {service_name}:
[1] Availability (successful requests / total)
[2] Latency (requests under threshold)
[3] Throughput (requests per second)
[4] Freshness (data staleness)
[5] Correctness (valid outputs)
```

**WAIT for user input.**

### 3. Define SLI Queries

For each selected type, gather specific queries.

**Availability:**
```
Availability SLI:
Good Metric (e.g. 200 OK):
Total Metric (all requests):
```

**Latency:**
```
Latency SLI:
Histogram metric:
Threshold (e.g. 0.2s):
Percentile (p90/p99):
```

**WAIT for user input.**

Construct SLI definitions in `{slis}` dictionary.

---

## NEXT STEP

Read fully and follow: `step-02-set-objectives.md`
