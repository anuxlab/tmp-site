<!-- filepath: /Users/anuragprasad/Documents/own/pyprsd.github.io/docs/tutorials/advanced-python.md -->
# Advanced Python

> Deep-dive into Python internals & higher-level constructs. Complements the fundamentals page (`python-basics.md`).

---
## 1. Iterators, Iterables & Generators
An iterable implements `__iter__` returning an iterator. An iterator implements `__next__` and raises `StopIteration` when exhausted.
```python
class Countdown:
    def __init__(self, n: int):
        self.n = n
    def __iter__(self):  # iterable contract
        while self.n > 0:
            yield self.n
            self.n -= 1

list(Countdown(3))  # [3, 2, 1]
```
Manual iterator:
```python
class Repeat:
    def __init__(self, value, times):
        self.value = value; self.times = times
    def __iter__(self): return self
    def __next__(self):
        if self.times <= 0: raise StopIteration
        self.times -= 1; return self.value
```

Generator delegation (`yield from`) flattens:
```python
def nested():
    yield from range(3)
    yield from (x*x for x in range(2))
```

---
## 2. Comprehension Internals & Scope
List comprehension has its own scope (Python 3) preventing leakage of loop var:
```python
x = 'outer'
vals = [x for x in 'ab']
assert x == 'outer'
```
Be careful with late binding closures:
```python
funcs = [lambda i=i: i*i for i in range(3)]
[f() for f in funcs]  # [0,1,4]
```

---
## 3. Decorators
A decorator is a callable returning a callable.
```python
from functools import wraps

def log_calls(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        print(f"→ {fn.__name__}{a}{k}")
        r = fn(*a, **k)
        print(f"← {r}")
        return r
    return wrapper

@log_calls
def add(x, y): return x + y
```
Parameterized decorator adds one more layer:
```python
def enforce_type(t):
    def deco(fn):
        @wraps(fn)
        def inner(x):
            if not isinstance(x, t):
                raise TypeError('bad type')
            return fn(x)
        return inner
    return deco
```

---
## 4. Context Managers
Use for acquire / release patterns.
```python
from contextlib import contextmanager
@contextmanager
def opened(path):
    f = open(path, 'w')
    try:
        yield f
    finally:
        f.close()
```
Class protocol: implement `__enter__` / `__exit__`.

---
## 5. Descriptors
Provide attribute access control via `__get__`, `__set__`, `__delete__`.
```python
class Positive:
    def __set_name__(self, owner, name):
        self.name = '_' + name
    def __get__(self, obj, owner):
        return getattr(obj, self.name)
    def __set__(self, obj, value):
        if value < 0: raise ValueError('negative')
        setattr(obj, self.name, value)

class Account:
    balance = Positive()
    def __init__(self, balance):
        self.balance = balance
```
Properties are thin descriptor wrappers.

---
## 6. Dataclasses vs NamedTuple vs Pydantic
| Feature | dataclass | NamedTuple | Pydantic (BaseModel) |
|---------|-----------|-----------|----------------------|
| Mutability | Mutable (default) | Immutable | Mutable (v2: configurable) |
| Runtime type validation | No | No | Yes |
| Defaults / factories | Yes | Limited | Yes |
| Performance | Fast | Very fast | Slight overhead |
Use dataclasses for simple containers, Pydantic when validation important, NamedTuple for lightweight fixed records.

---
## 7. Metaclasses (Minimalist View)
Metaclass controls class creation. Rarely needed outside frameworks.
```python
class Registry(type):
    registry = {}
    def __new__(mcls, name, bases, ns):
        cls = super().__new__(mcls, name, bases, ns)
        if name != 'Base':
            mcls.registry[name] = cls
        return cls

class Base(metaclass=Registry):
    pass
class Service(Base):
    pass
```

---
## 8. Pattern Matching (PEP 634)
```python
def classify(token):
    match token:
        case {'type': 'price', 'val': v} if v > 0: return ('PRICE', v)
        case [x, y]: return ('PAIR', x, y)
        case str() as s: return ('STRING', s)
        case _: return ('UNKNOWN', token)
```

---
## 9. Concurrency Models
| Model | Best For | Key Primitive |
|-------|----------|---------------|
| threading | I/O bound mixed tasks | GIL serializes Python bytecode |
| multiprocessing | CPU bound | Separate processes (pickling cost) |
| asyncio | High-concurrency I/O | Event loop + await |
| vectorized libs | Numeric heavy | Native / C loops |

Async example:
```python
import asyncio, httpx
async def fetch(url):
    async with httpx.AsyncClient(timeout=5) as c:
        r = await c.get(url); return r.status_code
async def main():
    codes = await asyncio.gather(*(fetch(u) for u in ["https://example.com"]*3))
    print(codes)
asyncio.run(main())
```

---
## 10. Memory & Profiling
Tools: `tracemalloc`, `cProfile`, `line_profiler`, `memory_profiler`.
```python
import tracemalloc
tracemalloc.start()
# run workload
current, peak = tracemalloc.get_traced_memory()
```
Use `slots` to reduce per-instance dict overhead. Avoid unnecessary temporary lists: prefer generator pipelines.

---
## 11. Packaging & Distribution (Quick Glance)
```
project/
  pyproject.toml  # build-system, dependencies
  src/pkg/__init__.py
  tests/
```
Build: `python -m build`; Install locally: `pip install -e .`.

---
## 12. Typing & Static Analysis
Common types: `list[int]`, `dict[str, float]`, `Sequence[T]`, `Callable[[int,str], bool]`, `TypedDict`, `Protocol` for structural typing.
`mypy`, `pyright`: enforce contracts.

Protocol example:
```python
from typing import Protocol
class SupportsLen(Protocol):
    def __len__(self) -> int: ...

def size(x: SupportsLen) -> int: return len(x)
```

---
## 13. C Extensions & Speed Paths (Overview)
Options: Cython, ctypes, cffi, PyO3 (Rust). Use when Python-level optimizations exhausted and hotspot isolated.

---
## 14. Robust Error Handling Patterns
Wrap boundary layers (IO, network) with minimal try/except. Convert 3rd-party exceptions to domain ones early.
```python
class FetchError(RuntimeError): ...
```
Keep inner logic clean; log once near boundary.

---
## 15. Advanced Interview Q & A
1. Describe descriptor protocol use cases.
   - Implement computed attributes, validation, lazy loading, ORM field mapping.
2. How does `@functools.lru_cache` work?
   - Wraps function storing args→result in dict with LRU eviction (ordered linked structure); requires hashable args.
3. Difference between iterator exhaustion vs re-iteration.
   - Iterators are stateful single-pass; containers return fresh iterators each call to `iter(container)`.
4. Why prefer `Protocol` over inheritance sometimes?
   - Enables structural typing; decouples interface from hierarchy (duck typing with static assurance).
5. Explain event loop fairness concerns.
   - Long synchronous blocks starve loop; use `await asyncio.sleep(0)` or split tasks.
6. Pattern matching vs if-elif chains advantages?
   - Declarative shape matching; guards; reduces boilerplate; clearer intent.
7. Metaclass vs class decorator?
   - Class decorator post-processes created class; metaclass intervenes during creation (e.g., modifying namespace, controlling subclass registration).
8. When choose multiprocessing over threading?
   - CPU-bound pure-Python tasks limited by GIL; processes exploit multiple cores.
9. Generator `close()` / `throw()` semantics?
   - `close()` raises `GeneratorExit` inside; `throw()` injects exception at current yield point.
10. Why avoid broad except?
   - Masks programming errors (e.g., `NameError`), complicates debugging; restrict to expected exceptions.
11. How `async with` works?
   - Uses object implementing `__aenter__` / `__aexit__` for asynchronous resource management.
12. Impact of `slots=True` dataclass?
   - Eliminates `__dict__`, reducing memory; prevents dynamic attribute assignment.
13. Global interpreter lock: real performance mitigations?
   - Vectorized native extensions, multiprocessing, releasing GIL in C extensions, async for I/O.
14. Typical optimization workflow?
   - Measure -> identify hotspot -> apply algorithmic / data structure improvements -> micro-opt -> re-measure.
15. Why use `contextvars`?
   - Store context local state safe across async tasks (replacement for thread locals in async code).

---
*Last updated: Sep 2025*
