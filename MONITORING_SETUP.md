# 📊 Monitoring Setup Guide - Prometheus & Grafana

This guide explains the monitoring infrastructure for TaskMaster Pro.

## 🎯 What's Monitored

### Application Metrics
- **HTTP Request Rate** - Requests per second
- **HTTP Response Time** - p50, p95, p99 latencies
- **Error Rate** - 4xx and 5xx errors
- **Request Count** - Total requests by method, route, status

### Business Metrics
- **Tasks Created** - Number of tasks created
- **Tasks Completed** - Number of tasks completed
- **Active Users** - Currently active users

### System Metrics
- **Memory Usage** - Node.js heap size
- **CPU Usage** - Process CPU time
- **Event Loop Lag** - Node.js event loop performance
- **Database Connections** - Connection pool status

---

## 🚀 Quick Start

### Start Monitoring Services

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro

# Start all services including monitoring
docker-compose up -d

# Or start just monitoring services
docker-compose up -d prometheus grafana
```

### Access Dashboards

- **Grafana:** http://localhost:3002
  - Username: `admin`
  - Password: `admin`
- **Prometheus:** http://localhost:9090

---

## 📈 Using Grafana

### First Login

1. Open http://localhost:3002
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. Change password when prompted (optional)

### View Pre-configured Dashboard

1. Click **Dashboards** (left sidebar)
2. Click **TaskMaster Pro - API Metrics**
3. You'll see:
   - HTTP Request Rate
   - Response Time (p95)
   - Error Rate
   - Memory Usage
   - Active Connections

### Create Custom Dashboard

1. Click **+** → **Create Dashboard**
2. Click **Add Visualization**
3. Select **Prometheus** as data source
4. Enter PromQL query, for example:
   ```
   rate(http_requests_total[5m])
   ```
5. Click **Run query**
6. Save dashboard

---

## 🔍 Using Prometheus

### Query Metrics

Open http://localhost:9090 and try these queries:

**Request Rate:**
```
rate(http_requests_total[5m])
```

**Response Time (p95):**
```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

**Error Rate:**
```
rate(http_requests_total{status=~"5.."}[5m])
```

**Memory Usage:**
```
nodejs_heap_size_used_bytes
```

### View All Metrics

1. Go to http://localhost:9090
2. Click **Status** → **Targets**
3. You should see `taskmaster-backend` as UP

---

## 📊 Available Metrics

### HTTP Metrics

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram

### Business Metrics

- `tasks_created_total` - Tasks created
- `tasks_completed_total` - Tasks completed
- `active_users` - Active users

### System Metrics (Auto-collected)

- `nodejs_heap_size_used_bytes` - Memory used
- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `process_cpu_user_seconds_total` - CPU usage

---

## 🎨 Grafana Dashboard Examples

### API Performance Dashboard

**Panel 1: Request Rate**
```
Query: rate(http_requests_total[5m])
Legend: {{method}} {{route}}
```

**Panel 2: Response Time (p95)**
```
Query: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
Legend: p95 latency
```

**Panel 3: Error Rate**
```
Query: rate(http_requests_total{status=~"5.."}[5m])
Legend: 5xx errors
```

### Business Metrics Dashboard

**Panel 1: Tasks Created (Last Hour)**
```
Query: increase(tasks_created_total[1h])
```

**Panel 2: Active Users**
```
Query: active_users
```

---

## 🔧 Configuration

### Prometheus Config

Location: `monitoring/prometheus/prometheus.yml`

Key settings:
- `scrape_interval: 15s` - How often to collect metrics
- `evaluation_interval: 15s` - How often to evaluate alerts

### Grafana Config

Location: `monitoring/grafana/provisioning/`

- **Datasources:** Auto-configured to use Prometheus
- **Dashboards:** Pre-provisioned dashboards

---

## 🚨 Setting Up Alerts (Future)

### Alert Rules

Create `monitoring/prometheus/alert_rules.yml`:

```yaml
groups:
  - name: taskmaster_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        annotations:
          summary: "High response time detected"
```

### Alertmanager (Future)

For sending alerts to Slack, email, PagerDuty, etc.

---

## 📝 Adding Custom Metrics

### In Your Code

```typescript
import { tasksCreatedCounter } from './utils/metrics';

// When a task is created
tasksCreatedCounter.inc({
  organization_id: orgId,
  project_id: projectId,
});
```

### Metrics Types

- **Counter** - Always increasing (e.g., total requests)
- **Gauge** - Can go up or down (e.g., active users)
- **Histogram** - Distribution of values (e.g., response times)

---

## 🐛 Troubleshooting

### Prometheus Can't Scrape Backend

**Check:**
1. Backend is running: `docker-compose ps`
2. Backend `/metrics` endpoint works: `curl http://localhost:3001/metrics`
3. Prometheus config has correct target: `backend:3001`

**View Prometheus logs:**
```bash
docker-compose logs prometheus
```

### Grafana Can't Connect to Prometheus

**Check:**
1. Prometheus is running: `docker-compose ps`
2. Prometheus is accessible: `curl http://localhost:9090`
3. Grafana datasource config: `monitoring/grafana/provisioning/datasources/prometheus.yml`

**View Grafana logs:**
```bash
docker-compose logs grafana
```

### No Metrics Showing

**Check:**
1. Backend `/metrics` endpoint returns data: `curl http://localhost:3001/metrics`
2. Prometheus targets are UP: http://localhost:9090/targets
3. Wait a few minutes for metrics to accumulate

---

## 📚 PromQL Query Examples

### Request Rate by Route
```
sum(rate(http_requests_total[5m])) by (route)
```

### Top 5 Slowest Endpoints
```
topk(5, histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])))
```

### Error Percentage
```
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

### Memory Usage Percentage
```
(nodejs_heap_size_used_bytes / nodejs_heap_size_total_bytes) * 100
```

---

## 🎯 Next Steps

1. ✅ **Set up alerts** - Get notified when things go wrong
2. ⏭️ **Add more business metrics** - Track what matters to your business
3. ⏭️ **Create custom dashboards** - Visualize your specific use cases
4. ⏭️ **Set up log aggregation** - Combine with ELK Stack

---

**Your monitoring infrastructure is ready! 📊**

Now you can:
- See real-time metrics
- Track performance over time
- Identify bottlenecks
- Set up alerts for issues

This is a **major DevOps win** - you can now observe your system! 🎉
