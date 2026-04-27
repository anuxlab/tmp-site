<!-- filepath: /Users/anuragprasad/Documents/own/pyprsd.github.io/docs/tutorials/ai-ml.md -->
# AI / ML Essentials

> Pragmatic machine learning & applied AI concepts with concise code snippets and interview anchors.

---
## 1. Taxonomy Overview
| Layer | Focus | Examples |
|-------|-------|----------|
| Data | Collection, cleaning | Web/API ingestion, feature extraction |
| Modeling | Algorithms, training loops | Linear models, Trees, Neural nets |
| Evaluation | Metrics, validation | k-fold CV, ROC-AUC, F1 |
| Deployment | Serving & ops | FastAPI, batch scoring, monitoring |
| Governance | Drift, bias, reproducibility | Model registry, lineage |

---
## 2. Data Preparation
```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

raw = pd.DataFrame({
    'age': [20, 22, 21, 25],
    'salary': [30_000, 31_000, 29_000, 50_000],
    'label': [0, 0, 0, 1]
})
X = raw[['age','salary']]; y = raw['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)
sc = StandardScaler(); X_train_sc = sc.fit_transform(X_train); X_test_sc = sc.transform(X_test)
```
Missing values: impute (mean/median/model-based). Encoding: one-hot vs target encoding (beware leakage).

---
## 3. Core Algorithms Snapshot
| Family | Algorithm | Notes |
|--------|-----------|-------|
| Linear | Logistic Regression | Fast baseline, interpretable |
| Trees | Random Forest | Robust to outliers, non-linear |
| Boosting | XGBoost / LightGBM | High performance tabular |
| Distance | k-NN | Lazy, sensitive to scale |
| SVM | Linear / RBF | Effective high-dim, scaling cost |
| Probabilistic | Naive Bayes | Strong for text (conditional independence) |
| Neural | MLP/CNN/RNN/Transformer | Representation learning |
| Unsupervised | KMeans / DBSCAN | Clustering; shape vs density |
| Dimensionality | PCA / t-SNE / UMAP | Variance vs manifold preservation |

---
## 4. Training Loop (Barebones PyTorch)
```python
import torch, torch.nn as nn, torch.optim as optim

X = torch.randn(32, 10); y = torch.randint(0, 2, (32,))
model = nn.Sequential(nn.Linear(10, 16), nn.ReLU(), nn.Linear(16, 2))
opt = optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(5):
    opt.zero_grad()
    out = model(X)
    loss = loss_fn(out, y)
    loss.backward()
    opt.step()
```
Key steps: forward -> loss -> backward -> optimizer step.

---
## 5. Evaluation & Metrics
| Task | Metrics |
|------|---------|
| Classification | Accuracy, Precision, Recall, F1, AUC, LogLoss |
| Regression | MSE, RMSE, MAE, R^2, MAPE |
| Ranking | MAP, NDCG |
| Clustering | Silhouette, Davies–Bouldin |

Confusion matrix clarifies error distribution; calibrate probabilities with Platt / isotonic when needed.

---
## 6. Cross-Validation & Data Leakage
Always isolate test set. Common leakage sources: target encoding on full data, scaling before split, temporal shuffle in time series, label in features. Use `Pipeline` in scikit-learn.
```python
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
pipe = Pipeline([
    ('sc', StandardScaler()),
    ('clf', LogisticRegression(max_iter=1000))
])
```

---
## 7. Feature Engineering Highlights
- Numerical: binning, interactions, polynomial terms (risk of overfit)
- Categorical: frequency encoding, embeddings for high-cardinality
- Time: lags, rolling stats, cyclical (sine/cosine for hour/day)
- Text: TF-IDF vs contextual embeddings (BERT)
- Leakage guard: derive only from past / training folds.

---
## 8. Model Explainability
| Method | Applies To | Idea |
|--------|-----------|------|
| Coefficients | Linear | Direct weight interpretation |
| Feature Importance | Tree ensembles | Split gain / permutation impact |
| SHAP values | Any | Game theoretic contribution |
| LIME | Any | Local surrogate linear model |

---
## 9. Handling Imbalance
Techniques: resampling (SMOTE), class weights, focal loss, threshold tuning, anomaly detection framing.
```python
from sklearn.utils.class_weight import compute_class_weight
cw = compute_class_weight('balanced', classes=[0,1], y=y)
```

---
## 10. Pipelines, Reproducibility & Tracking
Use: environment pinning (`requirements.txt`/`poetry.lock`), dataset versioning (DVC), experiment tracking (MLflow), random seeds (note nondeterminism in GPU ops).

---
## 11. Deployment Patterns
| Pattern | Use Case | Example |
|---------|----------|---------|
| Batch Scoring | Periodic predictions | Cron + write to DB |
| Online REST | Low latency queries | FastAPI + serialized model |
| Streaming | Real-time events | Kafka consumer w/ sliding window |
| Edge | Low power devices | Quantized / pruned models |

FastAPI example:
```python
from fastapi import FastAPI
import joblib, numpy as np
app = FastAPI()
model = joblib.load('model.joblib')
@app.post('/predict')
async def predict(v: list[float]):
    return {'pred': float(model.predict(np.array(v).reshape(1,-1))[0])}
```

---
## 12. Monitoring & Drift
Track input feature stats, output distributions, performance over time. Detect covariate drift (KS test), label drift, concept drift. Retrain trigger policies.

---
## 13. Modern NLP Snapshot
| Technique | Notes |
|-----------|------|
| Word2Vec / GloVe | Static embeddings |
| Transformer Encoders | Contextual, parallel attention |
| Instruction Tuning | Alignment with instructions |
| RAG | Retrieval + generation hybrid |
| Quantization | Reduce model size/latency |

---
## 14. Vector Databases & Retrieval (RAG)
Store embeddings (FAISS, Chroma, Milvus). Pipeline: chunk -> embed -> store -> retrieve -> augment prompt.

---
## 15. MLOps High-Level
| Stage | Tooling |
|-------|---------|
| Versioning | Git, DVC |
| Tracking | MLflow, Weights & Biases |
| CI | pytest, lint, data validation |
| Deployment | Docker, K8s, Serverless |
| Monitoring | Prometheus, custom validators |

---
## 16. Ethical & Responsible AI
Bias detection, explainability, fairness metrics (equal opportunity, demographic parity), privacy (differential privacy), model cards, data lineage.

---
## 17. Interview Q & A (AI / ML)
1. Why prefer ROC-AUC over accuracy on imbalance? Accuracy hides class distribution; ROC-AUC measures ranking quality independent of threshold.
2. Difference between precision and recall trade-off? Precision = quality of positive predictions, Recall = coverage; threshold tuning shifts balance.
3. Bias vs variance? Bias: underfitting systemic error; Variance: sensitivity to fluctuations; Aim for balance (regularization, more data, ensembling).
4. Explain gradient boosting intuition. Sequential trees fit residual errors of previous ensemble members minimizing loss via stage-wise additive modeling.
5. How does SHAP differ from permutation importance? SHAP gives local additive contributions using Shapley values; permutation is global, measures performance drop when shuffling a feature.
6. Regularization forms? L1 (sparsity), L2 (weight shrink), ElasticNet (combo), Dropout (stochastic subnetwork), Early stopping.
7. Causes of data leakage? Future info, target encoded before split, normalization on full dataset, duplicates with target in both train/test.
8. Handling high-cardinality categoricals? Target encoding (with CV), hashing trick, embeddings.
9. When use PR curve vs ROC? PR better when positive class rare (focus on precision/recall performance).
10. Cold-start strategies in recommender systems? Content-based features, popularity priors, user attribute similarity, hybrid models.
11. Overfitting detection strategies? Train vs validation divergence, high variance across folds, unstable feature importances.
12. Distillation purpose? Transfer knowledge from large teacher to smaller student improving latency while retaining accuracy.
13. Difference between bagging vs boosting? Bagging builds independent models in parallel (variance reduction). Boosting sequentially reduces residual error (bias reduction).
14. Latency optimization for online inference? Model pruning, quantization, batching small requests, caching embeddings, asynchronous I/O.
15. Explain concept drift mitigation. Continuous monitoring, sliding window retraining, adaptive weighting, ensemble aging.

---
*Last updated: Sep 2025*
