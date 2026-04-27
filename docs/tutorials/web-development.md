<!-- filepath: /Users/anuragprasad/Documents/own/pyprsd.github.io/docs/tutorials/web-development.md -->
# Web Development Essentials

> Backend-first pragmatic overview: HTTP basics, APIs, frontend integration, performance, security.

---
## 1. HTTP Fundamentals
| Element | Description |
|---------|-------------|
| Method | GET (idempotent), POST (create), PUT (replace), PATCH (partial), DELETE |
| Status Codes | 2xx success, 3xx redirect, 4xx client error, 5xx server error |
| Idempotency | Safe to repeat (e.g., GET, PUT) |
| Caching Headers | `ETag`, `Cache-Control`, `Last-Modified` |

Request lifecycle: DNS → TCP handshake → TLS (HTTPS) → Request/Response → Connection reuse (keep-alive / HTTP/2 multiplexing).

---
## 2. REST vs GraphQL vs gRPC
| Style | Pros | Cons |
|-------|------|------|
| REST | Simplicity, caching | Over/under-fetching |
| GraphQL | Flexible queries | Complexity, caching harder |
| gRPC | High performance, typed streams | Browser friction (needs proxy) |

---
## 3. FastAPI Minimal Example
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

DB = {}

@app.post('/items', status_code=201)
async def create(item: Item):
    if item.name in DB: raise HTTPException(409, 'exists')
    DB[item.name] = item
    return item

@app.get('/items/{name}')
async def get_item(name: str):
    return DB.get(name) or HTTPException(404, 'missing')
```

---
## 4. Middleware & Observability
Logging, request IDs, metrics, tracing.
```python
import time
from starlette.requests import Request

@app.middleware('http')
async def timing(request: Request, call_next):
    start = time.time(); resp = await call_next(request)
    resp.headers['X-Elapsed'] = f"{(time.time()-start)*1000:.1f}ms"
    return resp
```

---
## 5. Authentication & Authorization
| Method | Use Case |
|--------|----------|
| Session Cookie | Traditional web apps |
| JWT | Stateless APIs (short expiry) |
| OAuth2 / OpenID | Delegated auth (3rd-party) |
| API Keys | Service-to-service (low complexity) |

Principle of least privilege; store passwords hashed (bcrypt/argon2).

---
## 6. Database Patterns
| Concern | Pattern |
|---------|--------|
| Connections | Pooling (e.g., SQLAlchemy engine) |
| Migrations | Alembic / Flyway |
| N+1 Queries | Use joins, selectinload |
| Caching | Redis for hot paths |

---
## 7. Caching Layers
| Layer | Scope |
|-------|------|
| Browser | Static assets (immutable hash filenames) |
| CDN | Global edge distribution |
| Application | Memoization / in-process LRU |
| Data | Redis / Memcached |

ETag + conditional GET reduces bandwidth.

---
## 8. Frontend Integration (Minimal)
HTML template:
```html
<div id="app"></div>
<script type="module">
  const res = await fetch('/items/widget');
  const data = await res.json();
  document.getElementById('app').textContent = data.name;
</script>
```
Use build tools for bundling (Vite, Webpack). Keep bundle sizes small: code splitting, tree shaking.

---
## 9. Security Checklist
| Threat | Mitigation |
|--------|-----------|
| XSS | Escape output, CSP headers |
| CSRF | SameSite cookies, tokens |
| SQL Injection | Parameterized queries |
| SSRF | Whitelist outbound domains |
| Secrets Exposure | Vault / env variables, rotate keys |
| Clickjacking | `X-Frame-Options: DENY` |

---
## 10. Performance
| Area | Strategy |
|------|----------|
| Latency | Async I/O, connection reuse |
| Throughput | Horizontal scaling, load balancing |
| Payload | Compression (gzip/br), minify assets |
| DB | Index selective columns, avoid wildcards |
| API | Pagination, partial responses |

Measure before optimizing (APM, tracing).

---
## 11. Testing Pyramid
| Layer | Purpose |
|-------|---------|
| Unit | Logic correctness |
| Integration | Service boundaries |
| Contract | Schema evolution safety |
| E2E | User flow validation |
| Performance | Latency / throughput budget |

---
## 12. Deployment Approaches
| Style | Notes |
|-------|------|
| Containers | Reproducible images; orchestrate via K8s |
| Serverless | Event-driven; cold start trade-offs |
| PaaS | Simplified infra (Heroku, Render) |
| Edge Functions | Low-latency global compute |

Blue-green or canary deploys reduce risk.

---
## 13. API Versioning Strategies
URL versioning `/v1/`, header-based, or semantic (graph evolution in GraphQL). Provide deprecation headers for retiring endpoints.

---
## 14. Observability Stack
| Component | Tool |
|----------|-----|
| Metrics | Prometheus, StatsD |
| Logs | Structured JSON + ELK / Loki |
| Traces | OpenTelemetry + Jaeger |
| Dashboards | Grafana |

---
## 15. Interview Q & A (Web Dev)
1. Difference between PUT and PATCH? PUT replaces entire resource; PATCH applies partial changes.
2. Why idempotency matters? Enables safe retries without unintended side effects.
3. Prevent N+1 query issues? Use joins, eager loading strategies, batching.
4. Statelessness in REST? Each request includes all necessary context; server does not rely on stored session (except cache keys).
5. JWT drawbacks? Size overhead, revocation complexity; short expirations mitigate risk.
6. CSP header purpose? Restricts sources of content reducing XSS vectors.
7. Blue-green vs canary? Blue-green swaps full traffic; canary shifts gradually to new version.
8. Handling breaking API changes? Versioning, deprecation schedule, communication, compatibility layer.
9. When prefer GraphQL? Client-specific querying needs, multiple backends aggregation; avoid for simple CRUD only.
10. Scaling database reads? Read replicas, caching, CQRS patterns.
11. Mitigating slow queries? Indexing, query plan inspection, caching, denormalization.
12. Benefits of Infrastructure as Code? Reproducibility, versioned changes, disaster recovery.
13. Why structured logging? Machine-parsable for aggregation & alerting; easier correlation with trace IDs.
14. Avoid memory leaks in async server? Close sessions/connections, use context managers, monitor reference growth.
15. Zero-downtime deploy considerations? Health checks, graceful shutdown, connection draining.

---
*Last updated: Sep 2025*
