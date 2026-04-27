<!-- filepath: /Users/anuragprasad/Documents/own/pyprsd.github.io/docs/tutorials/quant-finance.md -->
# Quantitative Finance Primer

> Focused on data-driven trading & risk concepts: instruments, math, modeling, infrastructure.

---
## 1. Market Microstructure
| Concept | Note |
|---------|------|
| Bid / Ask | Best buy / sell quotes |
| Spread | Ask - Bid; liquidity proxy |
| Order Types | Market, Limit, Stop, IOC, FOK |
| Slippage | Execution vs expected price gap |
| Latency | Time from signal to execution |

Order book snapshot structure:
```python
order_book = {
  'bids': [(101.1, 200), (101.0, 300)],
  'asks': [(101.2, 150), (101.3, 100)]
}
mid = (order_book['bids'][0][0] + order_book['asks'][0][0]) / 2
```

---
## 2. Return Calculations
```python
import pandas as pd
prices = pd.Series([100, 101, 99, 102])
returns_simple = prices.pct_change()
returns_log = (prices/ prices.shift(1)).apply(lambda x: pd.NA if pd.isna(x) else __import__('math').log(x))
```
Log returns additive across time slices.

---
## 3. Risk & Volatility
```python
import numpy as np
vol_daily = returns_simple.std()
vol_annual = vol_daily * np.sqrt(252)
```
Value at Risk (historical): quantile of loss distribution.
```python
VaR_95 = returns_simple.quantile(0.05)
```
Expected Shortfall: average of worst tail fraction.

---
## 4. Portfolio Math
```python
import numpy as np
weights = np.array([0.4, 0.6])
mu = np.array([0.10, 0.15])         # expected annual returns
cov = np.array([[0.04, 0.01],[0.01,0.09]])
port_return = weights @ mu
port_var = weights @ cov @ weights
port_vol = port_var**0.5
```
Sharpe = (R_p - R_f) / vol.

---
## 5. Correlation & Diversification
Diversification lowers unsystematic risk; correlation breakdown in crises (regimes). Use shrinkage estimators for covariance stability (Ledoit-Wolf).

---
## 6. Factor Models
| Factor | Interpretation |
|--------|---------------|
| Market (MKT) | Broad market exposure |
| Size (SMB) | Small minus big |
| Value (HML) | High book-to-market minus low |
| Momentum | Past winners continue short-term |
| Quality/Low Vol | Defensive characteristics |

Regression for factor exposure:
```python
import statsmodels.api as sm
Y = asset_returns
X = sm.add_constant(factors_df[['MKT','SMB','HML']])
model = sm.OLS(Y, X).fit()
betas = model.params
```

---
## 7. Backtesting Principles
| Principle | Rationale |
|-----------|-----------|
| No Look-Ahead | Avoid future info in features |
| Realistic Costs | Include spread, slippage, fees |
| Execution Modeling | Partial fills, latency |
| Out-of-Sample Segments | Forward walk vs single test |
| Robust Metrics | Sharpe, max drawdown, turnover |

---
## 8. Performance Metrics
| Metric | Description |
|--------|-------------|
| Sharpe | Excess return / volatility |
| Sortino | Downside risk-adjusted return |
| Max Drawdown | Largest drop from peak |
| Win Rate | % profitable trades |
| Hit Ratio | Accuracy of signal classification |
| Turnover | Trade volume relative to capital |

---
## 9. Options Basics
| Term | Meaning |
|------|---------|
| Call / Put | Right to buy / sell underlying |
| Strike | Exercise price |
| Premium | Price paid for option |
| Greeks | Sensitivities: Delta, Gamma, Vega, Theta, Rho |

Black-Scholes call price:
```python
from math import log, sqrt, exp
from mpmath import quad, pi, e
# Use scipy.stats.norm.cdf in practice
```
Implied volatility solved by root-finding on price difference.

---
## 10. Greeks Intuition
| Greek | Sensitivity |
|-------|-------------|
| Delta | Price to underlying |
| Gamma | Delta to underlying |
| Vega | Price to volatility |
| Theta | Price to time decay |
| Rho | Price to interest rate |

Hedging adjusts portfolio Greeks toward target (e.g., delta-neutral).

---
## 11. Execution & Slippage Modeling
Simulate fill probability vs distance from top-of-book; incorporate queue position, partial fills.
```python
def slip(mid, spread, aggressiveness=0.5):
    return mid + spread * aggressiveness
```

---
## 12. Data Engineering Considerations
| Aspect | Concern |
|--------|--------|
| Latency | Efficient ingestion (async, batching) |
| Normalization | Consistent field naming & types |
| Survivorship Bias | Include delisted symbols |
| Corporate Actions | Adjust splits/dividends |
| Timezones | Normalize to UTC |

---
## 13. Regimes & Robustness
Detect structural breaks (e.g., Chow test, rolling metrics). Regime-aware strategies adapt leverage or model selection.

---
## 14. Machine Learning in Finance Caveats
Label scarcity, non-stationarity, regime shifts, overfitting via heavy hyperparam search, data snooping. Emphasize cross-validation with purging/embargo (see Lopez de Prado).

---
## 15. Risk Management Essentials
Position sizing (Kelly fraction bounds), stop-loss vs volatility targeting, exposure limits, scenario & stress testing.

---
## 16. Interview Q & A (Quant Finance)
1. Simple vs log returns difference? Log returns additive over time, approximate simple returns for small changes.
2. Why adjust for look-ahead bias? Prevent inflated performance using unavailable future info.
3. Purpose of volatility scaling? Normalize strategy risk, enabling comparability across periods.
4. Explain diversification failure. Correlations increase during crises; tail dependence undermines naive diversification.
5. What is overfitting in backtests? Excessive tuning to historical noise; signals not robust out-of-sample.
6. Meaning of negative skew? Frequent small gains, rare large losses (risk of blow-up).
7. Role of transaction costs? Erode alpha; high turnover strategies sensitive; must be modeled early.
8. Gamma risk significance? High gamma increases delta variability; requires active re-hedging.
9. Difference between VaR and Expected Shortfall? VaR is quantile threshold; ES averages tail losses beyond VaR (coherent risk measure).
10. Why use purged k-fold CV (finance)? Avoid leakage from overlapping samples / label overlap across folds.
11. Uses of factor models? Attribution, risk decomposition, portfolio construction constraints.
12. Max drawdown importance? Captures tail path risk, investor psychology; complements Sharpe.
13. Slippage modeling challenge? Dependent on order book dynamics, volume profile, market impact; hard to generalize.
14. Regime detection usage? Adjust strategy parameters, switch models, manage leverage.
15. Why prefer median to mean in some metrics? Robust to outliers, especially in skewed PnL distributions.

---
*Last updated: Sep 2025*
