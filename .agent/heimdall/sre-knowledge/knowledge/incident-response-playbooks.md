# Incident Response Playbooks

## Overview

This knowledge fragment contains standard incident response procedures for SRE teams. Use these playbooks as a foundation and customize for your specific environment.

---

## 1. Incident Severity Classification

### P1 - Critical

| Criteria | Threshold |
|----------|-----------|
| **User Impact** | >50% users affected OR complete service outage |
| **Revenue Impact** | >$10K/hour OR complete transaction failure |
| **SLO Breach** | Availability <99% OR error rate >5% |
| **Response Time** | Acknowledge within 5 minutes |
| **Resolution Target** | MTTR <1 hour |

**Actions Required:**
- Immediate page to on-call
- War room creation
- Executive notification within 30 minutes
- Status page update within 15 minutes

### P2 - High

| Criteria | Threshold |
|----------|-----------|
| **User Impact** | 10-50% users affected OR degraded experience |
| **Revenue Impact** | $1K-$10K/hour |
| **SLO Breach** | Availability 99-99.5% OR error rate 1-5% |
| **Response Time** | Acknowledge within 15 minutes |
| **Resolution Target** | MTTR <4 hours |

**Actions Required:**
- Page to on-call during business hours, Slack during off-hours
- Incident channel creation
- Status page update if customer-facing

### P3 - Medium

| Criteria | Threshold |
|----------|-----------|
| **User Impact** | <10% users affected OR minor inconvenience |
| **Revenue Impact** | <$1K/hour |
| **SLO Breach** | Within error budget |
| **Response Time** | Acknowledge within 1 hour |
| **Resolution Target** | MTTR <24 hours |

**Actions Required:**
- Slack notification to team
- Track in incident management system

---

## 2. Incident Response Phases

### Phase 1: Detection (0-5 minutes)

**Automated Detection:**
```yaml
Alert Sources:
  - Prometheus/Alertmanager
  - PagerDuty/Opsgenie
  - Application APM (Datadog, New Relic)
  - Synthetic monitoring
  - Log-based alerts

Key Metrics to Monitor:
  - Error rate (5xx responses)
  - Latency (p50, p95, p99)
  - Throughput (requests/second)
  - Saturation (CPU, memory, disk, connections)
  - Availability (health checks)
```

**Manual Detection:**
- Customer support tickets
- Social media monitoring
- Internal reports

### Phase 2: Triage (5-15 minutes)

**Triage Checklist:**
```markdown
- [ ] Acknowledge alert in PagerDuty
- [ ] Determine severity (P1/P2/P3)
- [ ] Identify affected services
- [ ] Create incident channel (#incident-{date}-{short-desc})
- [ ] Post initial assessment
- [ ] Assign Incident Commander if P1
```

**Initial Assessment Template:**
```
🚨 INCIDENT: {brief description}
Severity: P{1/2/3}
Started: {timestamp}
Impact: {user/revenue impact}
Affected: {services/regions}
Current Status: Investigating
IC: @{name}
```

### Phase 3: Escalation (If Needed)

**Escalation Triggers:**
- Severity higher than initially assessed
- Subject matter expertise needed
- Business decision required
- Incident duration exceeds target MTTR

**Escalation Paths:**
```
Service Issues → Service Owner → Engineering Manager
Database Issues → DBA Team → Database Manager
Network Issues → Network Team → Network Manager
Security Issues → Security Team → CISO
Business Decisions → Product Owner → VP of Product
```

### Phase 4: Investigation & Diagnosis (15-45 minutes)

**Investigation Framework:**
```yaml
1. Recent Changes:
   - Deployments in last 24h
   - Config changes
   - Infrastructure changes
   - Traffic patterns

2. Dependency Health:
   - Upstream services
   - Downstream services
   - Database connections
   - Cache availability
   - Message queues

3. Resource Saturation:
   - CPU utilization
   - Memory pressure
   - Disk I/O
   - Network throughput
   - Connection pools

4. Error Analysis:
   - Error types and frequencies
   - Stack traces
   - Correlation with changes
```

**Useful Commands:**
```bash
# Check recent deployments
kubectl rollout history deployment/{service}

# Check pod status
kubectl get pods -n {namespace} | grep -v Running

# Check recent logs
kubectl logs -f deployment/{service} --since=30m | grep -i error

# Check resource usage
kubectl top pods -n {namespace}

# Check database connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

### Phase 5: Mitigation (Variable)

**Common Mitigation Strategies:**

| Strategy | When to Use | Example |
|----------|-------------|---------|
| **Rollback** | Bad deployment | `kubectl rollout undo deployment/{service}` |
| **Scale Out** | Capacity issue | `kubectl scale deployment/{service} --replicas=10` |
| **Circuit Breaker** | Dependency failure | Enable circuit breaker, return cached/degraded response |
| **Feature Flag** | Feature causing issues | Disable feature via config |
| **Traffic Shift** | Regional issue | Shift traffic to healthy region |
| **Restart** | Unknown state | `kubectl rollout restart deployment/{service}` |

### Phase 6: Resolution & Communication

**Resolution Checklist:**
```markdown
- [ ] Confirm service is healthy (metrics back to baseline)
- [ ] Monitor for 15 minutes after fix
- [ ] Update status page: Resolved
- [ ] Notify stakeholders
- [ ] Close incident channel (after documentation)
- [ ] Schedule postmortem (P1/P2)
```

**Resolution Communication Template:**
```
✅ RESOLVED: {incident description}
Duration: {start} - {end} ({total time})
Impact: {summary of impact}
Root Cause: {brief description}
Resolution: {what fixed it}
Postmortem: {scheduled date/link}
```

### Phase 7: Postmortem (Within 48-72 hours)

**Postmortem Triggers:**
- All P1 incidents
- P2 incidents with customer impact
- Any incident with valuable learnings
- Repeated incidents

**Postmortem Meeting Agenda:**
```
1. Timeline review (10 min)
2. Root cause analysis (15 min)
3. What went well (5 min)
4. What could be improved (15 min)
5. Action items (10 min)
6. Questions (5 min)
```

---

## 3. Communication Templates

### Status Page Updates

**Investigating:**
```
We are currently investigating reports of {issue description}. 
Some users may experience {impact}. 
We will provide an update within 30 minutes.
```

**Identified:**
```
We have identified the cause of {issue} affecting {service}.
Our team is working on a fix.
Estimated time to resolution: {ETA}
```

**Monitoring:**
```
A fix has been implemented for {issue}.
We are monitoring the results.
We will provide an update in 15 minutes.
```

**Resolved:**
```
The issue affecting {service} has been resolved.
Service has been operating normally since {time}.
We apologize for any inconvenience.
A full postmortem will be published at {link}.
```

### Stakeholder Updates

**Initial Notification (P1):**
```
Subject: [P1] {Service} Incident - {Brief Description}

Hi Team,

We are experiencing a P1 incident affecting {service}.

Impact: {description}
Started: {time}
Status: Investigating
IC: {name}

Updates will be provided every 30 minutes.

Incident Channel: #{channel}
Status Page: {link}
```

**Resolution Notification:**
```
Subject: [RESOLVED] {Service} Incident - {Brief Description}

Hi Team,

The incident has been resolved.

Duration: {time range}
Impact: {summary}
Root Cause: {brief}
Resolution: {what fixed it}

Full postmortem will be scheduled for {date}.

Thanks,
{IC Name}
```

---

## 4. Incident Commander Checklist

**Before Incident:**
- [ ] Familiar with escalation paths
- [ ] Access to all monitoring tools
- [ ] Know how to create war rooms
- [ ] Status page admin access

**During Incident:**
- [ ] Assign clear roles (IC, scribe, comms)
- [ ] Maintain timeline
- [ ] Coordinate investigation
- [ ] Make go/no-go decisions
- [ ] Communicate regularly
- [ ] Protect team from external interruptions

**After Incident:**
- [ ] Verify resolution
- [ ] Close incident channel appropriately
- [ ] Schedule postmortem
- [ ] Ensure action items are created
- [ ] Thank the team

---

## 5. On-Call Best Practices

### Before On-Call Shift

- [ ] Review recent incidents
- [ ] Check scheduled changes
- [ ] Verify PagerDuty configuration
- [ ] Test laptop/VPN connectivity
- [ ] Review runbooks for common issues

### During On-Call Shift

- [ ] Acknowledge alerts promptly
- [ ] Document everything
- [ ] Don't hesitate to escalate
- [ ] Hand off cleanly at shift end

### Shift Handoff Template

```markdown
## On-Call Handoff: {date}

### Active Issues
- {issue 1}: {status}
- {issue 2}: {status}

### Recent Incidents (Last 24h)
- {incident 1}: {resolution}

### Scheduled Changes
- {change 1}: {time}

### Things to Watch
- {concern 1}
- {concern 2}

### Notes for Incoming
- {any special context}
```

---

*Last updated: 2026-02-04*
*Review cycle: Quarterly*
