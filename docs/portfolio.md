# Deprecated – See Home Page

This standalone portfolio page has been merged into the unified **Home** page (resume + portfolio hybrid).

<meta http-equiv="refresh" content="0; url=./index.html" />

Legacy content retained for backward compatibility (will be pruned later):

---
# Portfolio & Impact

> Building data & quantitative systems that turn noisy market streams into reliable, research-ready intelligence.

## Snapshot
- Years of hands-on data & analytics experience: **1.5+**  
- Domains touched: Market Data Engineering · Quant Research Enablement · Web Data Automation · GenAI Tooling  
- High-volume pipelines: Options & equities (historical + live) ingestion (Alpaca, Databento)  
- Cloud focus: Lean, observable AWS-first patterns (EC2 + S3 + CloudWatch automation)  

## Value Proposition
I design lean, composable data pipelines & research accelerators. Emphasis on:
1. Fidelity (accurate, event-aligned datasets)  
2. Extendability (plug-in modules vs monoliths)  
3. Fast iteration (GenAI-assisted tooling + reproducible environments)  
4. Operability (clear metrics, recovery hooks, failure isolation)  

## Core Strength Matrix
| Pillar | Strength | Example Outcome |
|--------|----------|-----------------|
| Market Data Capture | Concurrent ingestion | Stable live options capture with recovery hooks |
| Research Enablement | Backtest framework refactors | Cleaner strategy prototyping surface |
| Automation | AWS wrappers + monitoring | Reduced manual babysitting of long sessions |
| GenAI Integration | DSPy / LangChain tooling | Faster strat ideation + artifact generation |
| Data Quality | Validation & profiling | Higher confidence in downstream analytics |

## Tech Atlas
```text
Languages      : Python • R • C/C++
Frameworks     : FastAPI • Streamlit • Playwright • Scrapy • Selenium
Data / Compute : Pandas • NumPy • MLflow • DSPy • LangChain
Cloud / Infra  : AWS (EC2, S3, IAM, CloudWatch, Bedrock)
Datastores     : MySQL • MongoDB
Market Data    : Alpaca • Databento (REST / RTC)
Tooling & Ops  : Git • CI/CD • Pytest • tmux • BrightData
```

## Systems Thinking (Example Architecture)
```mermaid
flowchart LR
A[Market Feeds
(Alpaca / Databento)] --> B[Ingestion Layer
Async Workers]
B --> C[Raw Bucket (S3)]
C --> D[Normalization / Schema Harmonizer]
D --> E[Validated Zone]
E --> F1[Backtesting Engine]
E --> F2[Feature Gen]
F1 --> G[Strategy Reports]
F2 --> G
G --> H[Research Portal / Notebooks]
H --> I[GenAI Assist
(Prompt + Retrieval Layer)]
```

## Recent Impact Highlights
- Refactored backtesting core → improved clarity for option strategy evaluation.  
- Built concurrent ingestion harness (REST + streaming) → lower latency + resilience.  
- Introduced GenAI research helpers → reduced manual boilerplate in exploratory loops.  
- Standardized crawler design patterns → higher selector reliability & maintainability.  

## Project Spotlights
| Theme | Artifact | Notes |
|-------|----------|-------|
| Data Pipelines | Options data multi-source capture | Includes retry + state checkpointing |
| Quant Research | Modular backtest core | Separation of execution, pricing, event timeline |
| GenAI Tools | Strategy ideation assistant | DSPy + LiteLLM primitives for reproducibility |
| Automation | AWS session guardian | Detects stalls & triggers soft recovery |

## Learning Edge
Currently exploring:  
- Adaptive feature pipelines for intraday factor prototyping  
- Lightweight vector + structured hybrid retrieval for research context  
- Deterministic evaluation harnesses for GenAI-assisted analysis  

## Narrative Timeline
```text
2025  Deepening quant data infra & GenAI augmentation synergy
2024  Market data ingestion + backtesting modernization (contract role)
2024  Large-scale structured web data automation (intern ramp-up)
2022  Information systems + dashboarding + ops streamlining
Pre   Engineering foundation + statistical methods training
```

## Principles
> Ship lean. Instrument early. Automate what hurts twice. Design for observability. Refine naming relentlessly.

## Collaboration Modes
| Mode | How I Contribute |
|------|------------------|
| Quant / Data Teams | Build ingestion, accelerate research loops, enforce data fidelity |
| Infra / Platform | Modularize pipelines, add test harnesses, reduce operational toil |
| Product / Strategy | Translate exploratory insight into reproducible analytics artifacts |

## Call to Action
Interested in data-intensive, research-centric roles (market data, quant enablement, ML platform foundations).  
Let’s connect: LinkedIn / GitHub links above.  

---
*This page is a living portfolio—updated as systems evolve, not just when roles change.*
