# Database Optimization Techniques

## Overview

This knowledge fragment covers database performance best practices applicable across common database systems (PostgreSQL, MySQL, MongoDB). Focus on patterns that improve query performance, connection management, and overall database health.

---

## 1. Query Optimization

### Indexing Strategies

#### When to Create Indexes

| Scenario | Index Type | Example |
|----------|------------|---------|
| Exact match lookups | B-tree (default) | `WHERE user_id = 123` |
| Range queries | B-tree | `WHERE created_at > '2024-01-01'` |
| Pattern matching (prefix) | B-tree | `WHERE name LIKE 'John%'` |
| Full-text search | GIN/Full-text | Search within text content |
| Array/JSON containment | GIN | `WHERE tags @> ARRAY['sre']` |
| Geospatial queries | GiST/SP-GiST | `WHERE location <-> point` |

#### Index Best Practices

```sql
-- Composite index: order matters (most selective first)
CREATE INDEX idx_users_status_created 
ON users (status, created_at DESC);

-- Partial index: only index relevant rows
CREATE INDEX idx_active_orders 
ON orders (customer_id) 
WHERE status = 'active';

-- Covering index: include frequently accessed columns
CREATE INDEX idx_orders_covering 
ON orders (customer_id) 
INCLUDE (total, created_at);

-- Expression index: for computed values
CREATE INDEX idx_users_email_lower 
ON users (LOWER(email));
```

#### Index Anti-Patterns

```sql
-- ❌ Index not used with function on column
SELECT * FROM users WHERE LOWER(email) = 'user@example.com';
-- ✓ Create expression index or store lowercase

-- ❌ Leading wildcard prevents index usage
SELECT * FROM users WHERE name LIKE '%john%';
-- ✓ Use full-text search or trigram index

-- ❌ Too many indexes slows writes
-- ✓ Audit unused indexes regularly:
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Query Analysis

#### EXPLAIN ANALYZE (PostgreSQL)

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.*, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending'
  AND o.created_at > NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC
LIMIT 100;
```

**Key Metrics to Review:**
- **Actual Time**: Total execution time
- **Rows**: Actual vs estimated (big difference = stale statistics)
- **Buffers**: shared hit (good) vs read (disk I/O)
- **Seq Scan**: On large tables = likely missing index

#### Slow Query Identification

```sql
-- PostgreSQL: Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = '1000';  -- 1 second
SELECT pg_reload_conf();

-- Find top slow queries (pg_stat_statements extension)
SELECT 
  calls,
  total_exec_time / calls as avg_time_ms,
  rows / calls as avg_rows,
  query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

### Common Query Patterns

#### N+1 Query Problem

```python
# ❌ N+1 queries
users = User.query.all()
for user in users:
    orders = Order.query.filter_by(user_id=user.id).all()  # N queries!

# ✓ Eager loading (single query with JOIN)
users = User.query.options(joinedload(User.orders)).all()

# ✓ Or explicit JOIN
SELECT u.*, o.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true;
```

#### Pagination Optimization

```sql
-- ❌ Slow for large offsets
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 1000000;

-- ✓ Keyset pagination (cursor-based)
SELECT * FROM orders 
WHERE id > :last_seen_id 
ORDER BY id 
LIMIT 20;

-- ✓ With composed key
SELECT * FROM orders 
WHERE (created_at, id) > (:last_created, :last_id) 
ORDER BY created_at, id 
LIMIT 20;
```

#### Batch Operations

```sql
-- ❌ Single inserts in loop
INSERT INTO log_entries (msg) VALUES ('entry1');
INSERT INTO log_entries (msg) VALUES ('entry2');
-- ... N times

-- ✓ Batch insert
INSERT INTO log_entries (msg) VALUES 
  ('entry1'), ('entry2'), ('entry3'), ... ;

-- ✓ COPY for bulk loading (PostgreSQL)
COPY log_entries (msg) FROM STDIN WITH CSV;

-- ✓ Batch updates
UPDATE users 
SET last_active = NOW() 
WHERE id = ANY(ARRAY[1, 2, 3, 4, 5]);
```

---

## 2. Connection Pooling

### Why Connection Pooling?

| Without Pool | With Pool |
|--------------|-----------|
| New connection per request (~50-100ms overhead) | Reuse existing connections |
| Max connections exhausted quickly | Controlled connection count |
| Connection storms during traffic spikes | Queuing under load |
| Database CPU overhead managing connections | Stable connection count |

### Connection Pool Sizing

**Rule of Thumb:**
```
Pool Size = (Core Count * 2) + Disk Spindles
```

For SSD:
```
Pool Size ≈ Core Count * 2 to 4
```

**PostgreSQL Example:**
```
Server: 8 cores, SSD
Recommended pool: 16-32 connections per database
Total max_connections: Consider all app instances
```

### Common Poolers

#### PgBouncer (PostgreSQL)

```ini
; pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

; Pool settings
pool_mode = transaction        ; transaction, session, or statement
max_client_conn = 1000         ; max client connections
default_pool_size = 20         ; connections per user/database pair
min_pool_size = 5              ; minimum connections to keep
reserve_pool_size = 5          ; extra connections for burst
reserve_pool_timeout = 5       ; seconds to wait before using reserve
```

#### HikariCP (Java)

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000      # 5 minutes
      connection-timeout: 20000  # 20 seconds
      max-lifetime: 1200000     # 20 minutes
      leak-detection-threshold: 60000
```

### Monitoring Connections

```sql
-- PostgreSQL: Active connections
SELECT 
  state,
  usename,
  datname,
  count(*)
FROM pg_stat_activity
GROUP BY state, usename, datname;

-- Connection by application
SELECT 
  application_name,
  count(*)
FROM pg_stat_activity
GROUP BY application_name;

-- Blocked queries
SELECT 
  blocked.pid AS blocked_pid,
  blocked.query AS blocked_query,
  blocking.pid AS blocking_pid,
  blocking.query AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking ON blocking.pid = ANY(pg_blocking_pids(blocked.pid))
WHERE blocked.pid != blocking.pid;
```

---

## 3. Caching Strategies

### Cache Layers

```
┌─────────────┐
│  Application │ ← L1: In-process cache (e.g., Guava)
└──────┬──────┘
       │
┌──────▼──────┐
│    Redis    │ ← L2: Distributed cache
└──────┬──────┘
       │
┌──────▼──────┐
│  PostgreSQL │ ← L3: Query cache / Buffer pool
└─────────────┘
```

### Cache Patterns

#### Cache-Aside (Lazy Loading)

```python
def get_user(user_id):
    # Try cache first
    user = cache.get(f"user:{user_id}")
    if user:
        return user
    
    # Miss: load from database
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    
    # Populate cache
    cache.set(f"user:{user_id}", user, ttl=3600)
    return user
```

#### Write-Through

```python
def update_user(user_id, data):
    # Update database
    db.execute("UPDATE users SET ... WHERE id = %s", user_id)
    
    # Update cache immediately
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    cache.set(f"user:{user_id}", user, ttl=3600)
```

#### Write-Behind (Async)

```python
def update_user(user_id, data):
    # Update cache immediately
    cache.set(f"user:{user_id}", data, ttl=3600)
    
    # Queue database update
    queue.publish("user-updates", {"id": user_id, "data": data})
    
# Worker processes queue and batch-writes to DB
```

### Cache Invalidation

```python
# Event-driven invalidation
def on_user_updated(user_id):
    cache.delete(f"user:{user_id}")
    cache.delete(f"user-orders:{user_id}")

# Pattern-based invalidation (Redis)
# Delete all user-related keys
for key in redis.scan_iter("user:123:*"):
    redis.delete(key)

# TTL-based (eventual consistency)
cache.set(key, value, ttl=300)  # Refresh every 5 minutes
```

### Database Query Cache

```sql
-- PostgreSQL: Warm buffer pool
SELECT pg_prewarm('users');
SELECT pg_prewarm('users_pkey');

-- Check buffer cache hit ratio
SELECT 
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as cache_hit_ratio
FROM pg_statio_user_tables;

-- Target: >99% cache hit ratio
```

---

## 4. Performance Monitoring

### Key Database Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Query latency (p99) | <100ms | >500ms |
| Connection utilization | <70% | >85% |
| Cache hit ratio | >99% | <95% |
| Deadlocks/min | 0 | >1 |
| Replication lag | <100ms | >1s |
| Disk I/O utilization | <60% | >80% |
| Long-running queries | 0 | >5min duration |

### PostgreSQL Monitoring Queries

```sql
-- Table sizes and bloat
SELECT 
  schemaname || '.' || relname as table,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size,
  pg_size_pretty(pg_table_size(relid)) as table_size,
  pg_size_pretty(pg_indexes_size(relid)) as index_size,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  round(n_dead_tup::numeric / nullif(n_live_tup, 0) * 100, 2) as dead_ratio
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 20;

-- Index usage
SELECT 
  schemaname || '.' || relname as table,
  indexrelname as index,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC
LIMIT 20;

-- Lock waits
SELECT 
  blocked.pid,
  blocked.query,
  blocking.pid as blocking_pid,
  blocking.query as blocking_query,
  now() - blocked.query_start as blocked_duration
FROM pg_stat_activity blocked
CROSS JOIN LATERAL (
  SELECT * FROM pg_stat_activity 
  WHERE pid = ANY(pg_blocking_pids(blocked.pid))
  LIMIT 1
) blocking
WHERE blocked.wait_event_type = 'Lock';
```

---

## 5. Common Optimization Scenarios

### Scenario 1: Slow Dashboard Query

**Before:**
```sql
-- 15 seconds
SELECT 
  date_trunc('day', created_at) as day,
  count(*) as orders,
  sum(total) as revenue
FROM orders
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY date_trunc('day', created_at)
ORDER BY day;
```

**After:**
```sql
-- Create pre-aggregated materialized view
CREATE MATERIALIZED VIEW daily_order_stats AS
SELECT 
  date_trunc('day', created_at) as day,
  count(*) as orders,
  sum(total) as revenue
FROM orders
GROUP BY date_trunc('day', created_at);

CREATE INDEX idx_daily_stats_day ON daily_order_stats(day);

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_order_stats;

-- Query: <50ms
SELECT * FROM daily_order_stats WHERE day > NOW() - INTERVAL '30 days';
```

### Scenario 2: High Connection Count

**Symptoms:**
- `max_connections` errors
- Slow connection establishment
- High database CPU

**Solutions:**
1. Implement connection pooling (PgBouncer)
2. Use transaction pooling mode
3. Reduce application pool size per instance
4. Audit connection leaks

```sql
-- Find connection hogs
SELECT 
  application_name,
  client_addr,
  count(*)
FROM pg_stat_activity
GROUP BY application_name, client_addr
ORDER BY count(*) DESC;
```

### Scenario 3: N+1 Queries

**Detection:**
```python
# Enable query logging
import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Look for repeated similar queries
```

**Solution:**
```python
# Before: N+1 queries
users = session.query(User).all()
for user in users:
    print(user.orders)  # Triggers N queries

# After: Eager loading
users = session.query(User).options(joinedload(User.orders)).all()
```

---

## 6. Database-Specific Tips

### PostgreSQL

```sql
-- Update statistics for query planner
ANALYZE orders;

-- Vacuum to reclaim space
VACUUM (VERBOSE, ANALYZE) orders;

-- Tune autovacuum for high-churn tables
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.01,
  autovacuum_analyze_scale_factor = 0.005
);

-- Enable JIT for complex queries (PostgreSQL 11+)
SET jit = on;
```

### MySQL

```sql
-- Analyze table
ANALYZE TABLE orders;

-- Optimize fragmented table
OPTIMIZE TABLE orders;

-- Check query cache status
SHOW STATUS LIKE 'Qcache%';

-- Tune buffer pool
SET GLOBAL innodb_buffer_pool_size = 12G;
```

### MongoDB

```javascript
// Analyze query performance
db.orders.find({status: "pending"}).explain("executionStats")

// Create index
db.orders.createIndex({status: 1, createdAt: -1})

// Compact collection
db.runCommand({compact: "orders"})

// Check index usage
db.orders.aggregate([{$indexStats: {}}])
```

---

*Last updated: 2026-02-04*
*Applies to: PostgreSQL 13+, MySQL 8+, MongoDB 5+*
