# Runbook Templates

## Overview

This knowledge fragment provides various runbook formats for different operational scenarios. These templates ensure consistency and completeness in operational documentation.

---

## 1. Deployment Runbook

### Template: Standard Deployment

```markdown
# Deployment Runbook: {Service Name}

## Pre-Deployment Checklist
- [ ] All tests passing on main branch
- [ ] Approval from {approver}
- [ ] Change request ticket: {CR-XXX}
- [ ] Deployment window confirmed
- [ ] Rollback plan documented

## Deployment Steps

### Step 1: Pre-flight Checks
```bash
# Verify current state
kubectl get pods -n {namespace}
kubectl get deployments -n {namespace}

# Record current image version
kubectl get deployment {service} -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### Step 2: Deploy
```bash
# Apply new deployment
kubectl set image deployment/{service} {container}={image}:{tag}

# Or using helm
helm upgrade {release} {chart} --set image.tag={tag}
```

### Step 3: Monitor Rollout
```bash
# Watch rollout status
kubectl rollout status deployment/{service} --timeout=5m

# Verify pods are healthy
kubectl get pods -n {namespace} -l app={service}
```

### Step 4: Verify
- [ ] Health endpoints responding
- [ ] Key metrics normal (error rate, latency)
- [ ] No new errors in logs
- [ ] Smoke tests passing

## Rollback Procedure
```bash
# Rollback to previous revision
kubectl rollout undo deployment/{service}

# Verify rollback
kubectl rollout status deployment/{service}
```

## Success Criteria
- All pods running
- Error rate < 0.1%
- Latency p99 < 200ms
- No alerts firing
```

---

## 2. Rollback Runbook

### Template: Emergency Rollback

```markdown
# Emergency Rollback Runbook: {Service Name}

## When to Rollback
- Error rate > 5%
- Latency p99 > 500ms
- Critical functionality broken
- Data integrity concerns

## Rollback Steps

### Immediate Actions (< 5 minutes)

1. **Acknowledge the situation**
   - Post in #incidents: "Rolling back {service} due to {reason}"

2. **Execute rollback**
   ```bash
   # Kubernetes
   kubectl rollout undo deployment/{service} -n {namespace}
   
   # Verify rollback started
   kubectl rollout status deployment/{service} -n {namespace}
   ```

3. **Verify rollback success**
   ```bash
   # Check pods
   kubectl get pods -n {namespace} -l app={service}
   
   # Check image version
   kubectl get deployment {service} -n {namespace} \
     -o jsonpath='{.spec.template.spec.containers[0].image}'
   ```

### Post-Rollback Actions

4. **Verify service health**
   - [ ] Health endpoint: `curl {health-url}`
   - [ ] Error rate normalized
   - [ ] Latency normalized
   - [ ] Key functionality tested

5. **Communication**
   - [ ] Update #incidents with status
   - [ ] Notify stakeholders
   - [ ] Create incident ticket if not exists

6. **Investigation**
   - [ ] Preserve logs: `kubectl logs deployment/{service} --since=1h > rollback-logs.txt`
   - [ ] Document timeline: When deployed, when issues observed, when rolled back
   - [ ] Schedule postmortem

## Escalation
If rollback fails or issues persist:
- Page: {on-call team}
- Escalate to: {engineering manager}
```

---

## 3. Incident Response Runbook

### Template: Service Outage

```markdown
# Incident Runbook: {Service Name} Outage

## Severity Classification
| Indicator | P1 | P2 | P3 |
|-----------|----|----|----| 
| User Impact | >50% | 10-50% | <10% |
| Error Rate | >5% | 1-5% | <1% |
| Duration | >15min | >30min | >1h |

## Initial Triage (First 5 minutes)

### Step 1: Verify the Issue
```bash
# Check pod status
kubectl get pods -n {namespace} -l app={service}

# Check recent events
kubectl get events -n {namespace} --sort-by='.lastTimestamp' | tail -20

# Check service endpoint
curl -I {health-endpoint}
```

### Step 2: Check Common Causes

#### High Resource Usage
```bash
# CPU/Memory
kubectl top pods -n {namespace} -l app={service}

# Disk
df -h (on affected nodes)
```

#### Dependency Issues
```bash
# Database connectivity
psql -h {db-host} -c "SELECT 1"

# Cache connectivity
redis-cli -h {redis-host} ping
```

#### Recent Changes
```bash
# Recent deployments
kubectl rollout history deployment/{service}

# Config changes
kubectl get configmap {config} -o yaml
```

## Common Issues and Fixes

### Issue: OOMKilled Pods
```bash
# Increase memory limit
kubectl set resources deployment/{service} --limits=memory=2Gi
```

### Issue: Connection Pool Exhaustion
```bash
# Check connections
SELECT count(*) FROM pg_stat_activity WHERE datname = '{db}';

# Restart pods to reset connections
kubectl rollout restart deployment/{service}
```

### Issue: Certificate Expiry
```bash
# Check cert expiry
openssl s_client -connect {host}:443 | openssl x509 -noout -dates
```

## Escalation Path
1. L1: On-call engineer
2. L2: Service owner
3. L3: Engineering lead
4. L4: VP Engineering (P1 only)
```

---

## 4. Maintenance Runbook

### Template: Database Maintenance

```markdown
# Maintenance Runbook: Database Vacuum

## Overview
Regular vacuum and analyze operations to maintain PostgreSQL performance.

## Schedule
- Frequency: Weekly (off-peak hours)
- Duration: ~2 hours
- Impact: Minimal (VACUUM is non-blocking)

## Pre-Maintenance

### Notifications
```
Subject: Scheduled DB Maintenance - {date} {time}

Hi Team,

Scheduled database maintenance will occur:
- When: {day} {time} UTC
- Duration: ~2 hours
- Impact: Minimal query slowdown expected

No action required.
```

### Pre-checks
```sql
-- Check current bloat
SELECT schemaname, relname,
       n_dead_tup,
       n_live_tup,
       round(n_dead_tup::numeric / nullif(n_live_tup, 0) * 100, 2) as dead_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY dead_ratio DESC;

-- Check last vacuum
SELECT schemaname, relname,
       last_vacuum,
       last_autovacuum,
       last_analyze
FROM pg_stat_user_tables
ORDER BY last_vacuum ASC NULLS FIRST;
```

## Maintenance Steps

### Step 1: High-Bloat Tables First
```sql
-- Vacuum analyze specific tables
VACUUM (VERBOSE, ANALYZE) orders;
VACUUM (VERBOSE, ANALYZE) events;
VACUUM (VERBOSE, ANALYZE) audit_log;
```

### Step 2: Full Database Maintenance
```sql
-- Analyze all tables (update query planner stats)
ANALYZE VERBOSE;

-- Reindex if needed (can be blocking!)
-- Only during maintenance window
REINDEX DATABASE mydb CONCURRENTLY;
```

### Step 3: Verify
```sql
-- Confirm vacuum completed
SELECT schemaname, relname, last_vacuum
FROM pg_stat_user_tables
WHERE last_vacuum > NOW() - INTERVAL '1 hour';

-- Check for any errors
SELECT * FROM pg_stat_progress_vacuum;
```

## Post-Maintenance
- [ ] Verify query performance normal
- [ ] Check for any blocked queries
- [ ] Record maintenance in log
- [ ] Schedule next maintenance
```

---

## 5. Capacity Planning Runbook

### Template: Scale-Up Procedure

```markdown
# Capacity Runbook: Horizontal Scaling

## When to Scale
- CPU utilization > 70% sustained
- Memory utilization > 80%
- Request queue depth growing
- Latency increasing

## Scaling Thresholds

| Metric | Scale Up | Scale Down |
|--------|----------|------------|
| CPU | >70% for 5m | <30% for 30m |
| Memory | >80% | <50% |
| Requests/pod | >1000/s | <500/s |

## Manual Scaling Steps

### Step 1: Assess Current State
```bash
# Current replicas
kubectl get deployment {service} -n {namespace}

# Current resource usage
kubectl top pods -n {namespace} -l app={service}

# HPA status (if exists)
kubectl get hpa {service} -n {namespace}
```

### Step 2: Scale Up
```bash
# Scale to specific count
kubectl scale deployment {service} --replicas={new-count} -n {namespace}

# Verify pods starting
kubectl get pods -n {namespace} -l app={service} -w
```

### Step 3: Verify
```bash
# All pods running
kubectl get pods -n {namespace} -l app={service}

# Load distributed
kubectl top pods -n {namespace} -l app={service}

# Metrics normalizing (check Grafana)
```

## HPA Configuration

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {service}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {service}
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
```

## Cost Considerations
| Replicas | Monthly Cost | Notes |
|----------|--------------|-------|
| 3 | ${base} | Minimum for HA |
| 5 | ${base * 1.67} | Normal load |
| 10 | ${base * 3.33} | Peak load |
| 20 | ${base * 6.67} | Maximum |
```

---

## 6. On-Call Handoff Runbook

### Template: Shift Handoff

```markdown
# On-Call Handoff

## Shift Information
| Field | Value |
|-------|-------|
| Outgoing Engineer | {name} |
| Incoming Engineer | {name} |
| Shift Period | {start-date} to {end-date} |
| Handoff Time | {time} UTC |

## Current Status

### Active Incidents
| ID | Severity | Status | Summary |
|----|----------|--------|---------|
| INC-001 | P2 | Investigating | API latency elevated |

### Recent Incidents (Last 7 days)
| ID | Severity | Resolution | Postmortem |
|----|----------|------------|------------|
| INC-000 | P1 | Resolved | Scheduled 02/10 |

### Ongoing Issues
- {service-1}: Intermittent timeout errors (monitoring)
- {service-2}: Memory leak under investigation

## Scheduled Changes

| Date | Time | Change | Owner |
|------|------|--------|-------|
| 02/05 | 10:00 UTC | Deploy v2.3.1 | @alice |
| 02/06 | 02:00 UTC | DB maintenance | @bob |

## Things to Watch

### Known Flaky Alerts
- `HighLatency-{service}`: Can spike during batch jobs (02:00 UTC)
- `DiskUsage-{node}`: Logs need rotation, ticket-in-progress

### Monitoring Dashboards
- Main dashboard: {grafana-link}
- SLO dashboard: {grafana-link}
- On-call dashboard: {grafana-link}

## Escalation Contacts

| Role | Name | Contact |
|------|------|---------|
| Team Lead | {name} | @{slack} |
| Eng Manager | {name} | @{slack} |
| Database | {name} | @{slack} |
| Security | {name} | @{slack} |

## Notes
{Any additional context the incoming engineer should know}

## Acknowledgment
- [ ] Incoming engineer confirmed receipt
- [ ] PagerDuty schedule verified
- [ ] Slack on-call channel joined
```

---

## 7. Runbook Quality Checklist

### Before Publishing

- [ ] All commands tested and verified
- [ ] Expected outputs documented
- [ ] Failure scenarios covered
- [ ] Rollback procedure included
- [ ] Escalation path defined
- [ ] Links to related runbooks
- [ ] Last tested date recorded

### Periodic Review

- [ ] Runbook executed successfully in last 90 days
- [ ] All links still valid
- [ ] Commands still work with current tooling
- [ ] Contact information current
- [ ] Integrated with incident management

---

*Last updated: 2026-02-04*
*Review cycle: Quarterly*
