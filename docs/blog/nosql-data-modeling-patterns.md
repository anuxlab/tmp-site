---
title: NoSQL Data Modeling Patterns: Key-Value, Document, Columnar, Graph
description: Practical patterns for modeling data in NoSQL systems with query-driven design, access paths, and anti-patterns to avoid.
---

# NoSQL Data Modeling Patterns: Key-Value, Document, Columnar, Graph

Relational modeling starts with normalized entities and derives queries later. In NoSQL, you flip the order: start from the access patterns and then shape data to serve those queries predictably at scale. This guide summarizes core patterns across four families—key-value, document, wide-column, and graph—with examples and trade-offs.

## 1) Principles of query-driven design

- Define read and write access paths: latency expectations, cardinalities, paging, and sorting needs.
- Co-locate data read together in the same item/document/row to avoid cross-partition joins.
- Use stable partition keys to distribute load and avoid hot partitions; prefer high-cardinality keys with even distribution.
- Denormalize judiciously; maintain derived views via event streams or background jobs.
- Embrace immutability where possible; append-only logs simplify concurrency and auditing.

## 2) Key-value patterns (e.g., Redis, DynamoDB as KV)

- Simple lookup and cache: Store precomputed aggregates or session state keyed by user_id or composite keys.
- Time-ordered lists: Use sorted sets or time-based keys (user:123:events:2025-09-26) for range scans and TTL expiry.
- Write-through cache: Keep KV in front of a durable store; invalidate on updates to avoid stale reads.
- Pitfalls: Large values and unbounded lists; track sizes and shard lists by time or sequence.

## 3) Document patterns (e.g., MongoDB, Couchbase)

- Entity-aggregate: Model a natural aggregate as a single document (order with line items, profile with preferences). Reads are fast; writes update one document.
- Bucketing: For high-frequency child items (events, comments), group by time buckets (comments_2025_09) to cap document growth and avoid 16MB limits.
- Precomputed views: Store denormalized projections for hot queries (e.g., product card) and update via change streams.
- Secondary indexes: Use sparse/compound indexes aligned to query filters and sorts; avoid “scan then sort” patterns.
- Pitfalls: Over-embedding causes large doc rewrites; over-referencing reintroduces joins and latency.

## 4) Wide-column patterns (e.g., Cassandra, Bigtable, HBase)

- Query tables: One table per core query shape. Primary key = (partition_key, clustering_columns...) to serve range scans and sort order.
- Time-series: Partition by entity and time bucket (sensor_id + day), cluster by timestamp desc for fast latest reads.
- Inverted index: For search-like queries, maintain a term → postings table with clustering by doc_id.
- Counters and rollups: Pre-aggregate by dimensions to serve dashboards with constant-time reads.
- Pitfalls: ALLOW FILTERING anti-patterns; tombstone bloat from frequent updates/deletes; keep rows narrow and writes idempotent.

## 5) Graph patterns (e.g., Neo4j, JanusGraph)

- Adjacency list: Model relationships explicitly; pick directionality to match traversal queries.
- Subgraph materialization: Precompute frequent k-hop neighborhoods or community assignments for fast recommendations.
- Hybrid: Store attributes in a document/column store and relationships in a graph; join at the application layer or via IDs.
- Pitfalls: Unbounded traversals; set hop limits and use graph algorithms offline to reduce online complexity.

## 6) Cross-cutting patterns

- Composite keys: Encode multiple dimensions (tenant#user#day) to support targeted range scans.
- Write-once, read-many: Event sourcing plus projections; rebuild projections when logic changes.
- TTL and archiving: Apply expirations; move cold data to cheaper storage or compacted tables.
- Backfill safety: Version schemas in keys (v2#...) or fields; run dual-writes during migrations.

## 7) Anti-patterns and safeguards

- Joins across partitions: Replace with pre-joined aggregates or search indexes.
- Hot partitions: Caused by low-cardinality keys (country) or skew (celebrity users). Add salting or hierarchical keys.
- Big documents/rows: Cap sizes; split by buckets or paginate child collections.
- Unbounded queries: Always include partition key and an upper bound; design per-page tokens for pagination.

## 8) Observability and operations

- Track p99 latency by table and operation; watch partition heatmaps and hot key alarms.
- Monitor item sizes, partition utilization, and tombstones; compact or re-partition proactively.
- Validate data with contracts: required fields, value ranges, and referential integrity enforced at write time.

NoSQL modeling is about predictability. Start from the heaviest queries, model data to serve them in O(1) or O(log n) per partition, and add projections for alternative views. Accept denormalization, but automate consistency with streams and jobs. With disciplined data contracts and monitoring, NoSQL scales sustainably.
