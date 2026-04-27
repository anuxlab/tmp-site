---
title: Modern Data Warehouse Architecture: Lakehouse Patterns and ELT
description: Practical guidance on designing a modern data warehouse with lakehouse patterns, ELT, governance, and cost controls.
---

# Modern Data Warehouse Architecture: Lakehouse Patterns and ELT

The modern analytics stack blends a flexible data lake with the ease of a warehouse—often called a lakehouse. The goal is reliable, governed, and performant analytics without excessive complexity. This guide lays out pragmatic patterns.

## 1) Storage and file formats

- Use open table formats (Delta, Iceberg, Hudi) to bring ACID, time travel, and schema evolution to object storage.
- Prefer columnar formats (Parquet) with compression (ZSTD/Snappy) and partitioning tuned to query patterns.
- Small files kill performance: compact with size targets (128–512 MB) and clustering.

## 2) Ingestion and ELT

- Land raw data in a bronze layer with minimal transformation; record source schema and load metadata.
- Use change data capture for databases (Debezium/Fivetran) to keep incremental pipelines cheap.
- Transform later (ELT) into silver/gold models using SQL and compute engines (Spark, Snowflake, BigQuery, DuckDB for local).

## 3) Data modeling

- Start with a consistent layer of normalized entities; project to dimensional models (star/snowflake) for BI.
- Adopt a modeling framework (dbt) for tests, documentation, and lineage; codify contracts with schema.yml.
- Use surrogate keys, slowly changing dimensions (SCD2) where history matters, and snapshot facts as needed.

## 4) Query engines and performance

- Match engines to workloads: Presto/Trino for interactive SQL over lake; Spark for batch; warehouses for turnkey performance.
- Optimize partition pruning, clustering, and statistics. Leverage materialized views for hot aggregations.
- Push compute to data where possible; avoid egress across clouds.

## 5) Governance and security

- Centralize access via catalog (Glue, Unity Catalog) with role-based and attribute-based controls.
- Mask sensitive fields; tokenize or encrypt at rest and in transit; maintain fine-grained audit logs.
- Track data quality with checks on freshness, null rates, ranges, and referential integrity; fail pipelines on critical breaches.

## 6) Cost management

- Separate storage and compute; schedule jobs during off-peak; right-size clusters or use serverless.
- Cache BI extracts; avoid SELECT *; adopt query budgets and alerts.
- Monitor cost per query/table/job; deprecate unused datasets.

## 7) BI and semantic layers

- Keep a semantic layer (LookML, MetricFlow, dbt metrics) for consistent business definitions.
- Version dashboards; test with golden datasets; document caveats and owners.
- Provide certified data marts while allowing exploratory sandboxes with guardrails.

## 8) Data contracts and SLAs

- Define producer/consumer contracts for schemas, nullability, and delivery times. Enforce via CI and runtime checks.
- Set freshness SLAs and alerting; communicate maintenance windows.
- Add backfills and replay mechanisms with idempotent jobs.

## 9) Platform operations

- IaC (Terraform) for reproducible infra. GitOps for declarative pipelines and permissions.
- Blue/green upgrades for engines/catalogs; test on canaries.
- Document runbooks for incidents; invest in lineage to accelerate impact analysis.

A modern warehouse balances flexibility and governance. Keep formats open, transformations declarative, and costs visible. Prioritize contracts, quality checks, and a semantic layer to make analytics reliable and scalable.
