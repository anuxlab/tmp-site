<!-- filepath: /Users/anuragprasad/Documents/own/pyprsd.github.io/docs/tutorials/data-science.md -->
# Data Science Foundations

> Workflow-centric perspective on practical data science: framing → data → analysis → modeling → communication.

---
## 1. Problem Framing
- Clarify objective: classification, regression, ranking, clustering, forecasting, causal inference
- Define success metrics & constraints (latency, interpretability, update cadence)
- Establish baseline (heuristic / simple model) early

---
## 2. Data Acquisition & Integrity
| Aspect | Checks |
|--------|--------|
| Schema | Column presence, types, constraints |
| Quality | Null % trends, unique counts, range bounds |
| Consistency | Cross-field logical rules (e.g., start_date <= end_date) |
| Drift | Distributional changes vs reference |

Automated validation example (Great Expectations-like idea):
```python
import pandas as pd

def validate(df: pd.DataFrame):
    assert 'price' in df
    assert df['price'].ge(0).all()
```

---
## 3. Exploratory Data Analysis (EDA)
Goals: understand distributions, relationships, anomalies.
```python
import seaborn as sns, pandas as pd
sns.pairplot(df[['age','income','spend','label']], hue='label')
```
Statistical profiling: correlation matrix, mutual information, missingness heatmaps.

---
## 4. Feature Extraction
| Type | Technique | Example |
|------|----------|---------|
| Numeric | Scaling, binning | Quantile bins for income |
| Categorical | One-hot, hashing | Hashing for high-cardinality IDs |
| Text | TF-IDF, embeddings | Sentence transformer vectors |
| Time | Lags, rolling stats | 7-day moving average |
| Aggregations | Group-based stats | user_id → mean session length |

---
## 5. Sampling & Splitting
- IID: random train/val/test split
- Temporal: forward chaining (walk-forward)
- Spatial / group: group-aware splitting to avoid leakage (e.g., user-level)

---
## 6. Statistical Foundations Snapshot
| Concept | Note |
|---------|------|
| Bias/Variance | Trade-off controlling generalization |
| Central Limit Theorem | Sample mean ~ Normal for large n |
| Confidence Interval | Range capturing parameter with probability (under model) |
| Hypothesis Testing | p-value = probability of observing as extreme assuming H0 |
| Multiple Testing | Adjust (Bonferroni, FDR) |

---
## 7. Dimensionality Reduction
```python
from sklearn.decomposition import PCA
pca = PCA(n_components=0.95).fit(X)
X_red = pca.transform(X)
```
Use t-SNE/UMAP for visualization, not distance-preserving inference.

---
## 8. Time Series (Brief)
Components: trend, seasonality, residual. Stationarity tests (ADF), differencing, rolling window features.
```python
ts['returns'] = ts['price'].pct_change()
```
Avoid leakage: train only on past, validate forward.

---
## 9. Causal vs Predictive
Predictive identifies association; causal isolates effect size (interventions). Tools: randomized experiments, propensity scoring, difference-in-differences, synthetic control.

---
## 10. Experimentation
| Design | Description |
|--------|-------------|
| A/B Test | Random split traffic, compare metrics |
| Multi-armed Bandit | Adaptive allocation to better arms |
| Sequential Testing | Monitor with alpha spending controls |

---
## 11. Reproducibility Stack
| Layer | Practice |
|-------|---------|
| Data | Version raw + feature sets |
| Code | Git, code review |
| Environment | Lock dependencies (hashes) |
| Model | Store artifacts + params + metrics |
| Reports | Parameterized notebooks (Papermill) |

---
## 12. Communication & Storytelling
Structure: Problem → Approach → Key Findings → Limitations → Recommendations → Next Steps.
Visual hierarchy: emphasize contrast, limit color palette, annotate critical points.

---
## 13. Data Ethics & Governance
PII handling, consent records, audit trails, security classification, minimization. Comply with retention policies.

---
## 14. Common Anti-Patterns
| Issue | Symptom | Mitigation |
|-------|---------|------------|
| Overfitting to test set | Repeated tuning | Maintain untouched holdout |
| Silent data drift | Gradual performance decay | Scheduled validation monitors |
| Manual feature scripts | Inconsistency prod vs train | Central feature store |
| Glue notebooks | No reuse | Modularize + tests |

---
## 15. Interview Q & A (Data Science)
1. How do you prevent leakage in feature engineering? Build features inside CV folds or time windows, exclude future info, separate pipelines.
2. When choose AUC vs F1? F1 balances precision/recall; AUC threshold-independent ranking; pick metric matching business cost function.
3. Explain bias vs variance tradeoff control levers. Regularization, model complexity, data quantity, ensembling.
4. Why is cross-validation variance important? High variance across folds suggests instability; consider more data / simpler model.
5. How detect concept drift? Statistical tests on joint distribution of (X,y), performance degradation; deploy shadow models.
6. Difference between causal effect and correlation? Causal effect implies change under intervention; correlation is association possibly confounded.
7. Pros/cons of feature hashing? Low memory, constant dimensionality; collisions, loss of interpretability.
8. Approach for highly skewed target in regression? Log transform, quantile regression, robust loss (Huber), stratified sampling.
9. Handling large categorical features with millions of levels? Hashing, embedding representations, frequency thresholds.
10. Time series validation vs random split? Must maintain temporal order to avoid future leakage into past training.
11. Why maintain a feature store? Ensures consistency between training and serving; reuse, lineage, governance.
12. Methods to explain black-box model? SHAP, permutation importance, partial dependence, surrogate models.
13. Evaluate recommendation system? Precision@k, Recall@k, MAP, NDCG, coverage, diversity, serendipity.
14. Detect outliers robustly? Isolation forest, robust covariance, density-based (LOF), IQR method.
15. Role of data contracts? Formal schema + SLA preventing silent upstream breaking changes.

---
*Last updated: Sep 2025*
