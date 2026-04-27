# Python Basics

> Ground-up primer on Python fundamentals with concise examples and interview-oriented notes. Advanced patterns (metaclasses, descriptors, async internals, C extensions) live in the Advanced Python page.

---
## 1. Getting Started
**Install / Version**:
```bash
python --version
python -m venv .venv && source .venv/bin/activate
pip install --upgrade pip
```
Run a script:
```bash
python main.py
```
REPL quick math:
```python
>>> 2 * (3 + 4)
14
```

---
## 2. Syntax Essentials
```python
# inline comment
x = 10              # assignment
PI = 3.14159        # constant by convention
name = "Anurag"     # string
def greet(who: str) -> str:
    return f"Hi {who}!"

if __name__ == "__main__":
    print(greet(name))
```
Indentation = structure (4 spaces). No braces.

---
## 3. Built-in Types
| Category | Examples | Notes |
|----------|----------|-------|
| Numeric  | int, float, complex | int arbitrary precision |
| Text     | str | Immutable, Unicode |
| Boolean  | bool | Subclass of int |
| Sequence | list, tuple, range | tuple immutable |
| Mapping  | dict | Python 3.7+ preserves insertion order |
| Set      | set, frozenset | Unordered unique elements |
| Binary   | bytes, bytearray | Network / file IO |
| None     | NoneType | Sentinel |

### Literals
```python
n = 1_000_000      # underscores improve readability
s = "multi\nline"  # newline escape
raw = r"C:\\path"  # raw string
b = b"data"         # bytes literal
```

---
## 4. Collections & Operations
```python
nums = [1, 2, 3]
nums.append(4)
nums.extend([5, 6])
nums[0] = 99
squares = [n*n for n in nums]  # list comprehension
first, *middle, last = squares

point = (10, 20)
# point[0] = 30  # TypeError (tuple immutable)

stock = {"symbol": "AAPL", "price": 195.4}
stock["price"] += 1
for k, v in stock.items():
    pass

unique = {3, 3, 2, 1}  # {1,2,3}
```
Membership: `in` is O(1) average for `set` / `dict` keys.

---
## 5. Control Flow
```python
if x > 0:
    status = "positive"
elif x == 0:
    status = "zero"
else:
    status = "negative"

for i, v in enumerate(nums):
    print(i, v)

while nums and nums[-1] != 6:
    nums.pop()

# Ternary
sign = "pos" if x >= 0 else "neg"
```
Use `for ... else:` when the `else` executes only if loop not broken:
```python
primes = [2,3,5,7,11]
for p in primes:
    if p % 10 == 0:
        break
else:
    print("No prime ended with 0")
```

---
## 6. Functions & Parameters
```python
def add(a: int, b: int = 0, *extra: int, scale: float = 1.0, **meta) -> float:
    total = a + b + sum(extra)
    return total * scale

add(2, 3)
add(2, 3, 4, 5, scale=0.5, source="calc")
```
Parameter order: `positional_or_keyword, *args, keyword_only=..., **kwargs`.

Docstring example:
```python
def midpoint(a: float, b: float) -> float:
    """Return midpoint between a & b.

    Args:
        a: Left value.
        b: Right value.
    """
    return (a + b) / 2
```

---
## 7. Comprehensions & Generators
```python
squares = [n*n for n in range(5)]
set_even = {n for n in range(10) if n % 2 == 0}
lengths = {w: len(w) for w in ["alpha", "beta"]}

# Generator expression (lazy):
avg = sum(n for n in range(1_000_000)) / 1_000_000

# Custom generator
def countdown(n: int):
    while n > 0:
        yield n
        n -= 1
```

---
## 8. Object-Oriented Basics
```python
class Position:
    __slots__ = ("x", "y")  # memory optimization (optional)
    def __init__(self, x: float, y: float):
        self.x = x; self.y = y
    def move(self, dx: float, dy: float):
        self.x += dx; self.y += dy
    def __repr__(self):
        return f"Position(x={self.x}, y={self.y})"

p = Position(2, 4)
p.move(1, -2)
```
Dataclasses for boilerplate reduction:
```python
from dataclasses import dataclass
@dataclass(slots=True)
class Trade:
    symbol: str
    qty: int
    price: float

print(Trade("AAPL", 10, 195.4))
```

---
## 9. Modules & Packages
```
project/
  pkg/__init__.py
  pkg/mathutils.py
  main.py
```
```python
# pkg/mathutils.py
def add(a, b): return a + b

# main.py
from pkg.mathutils import add
print(add(2, 5))
```
`__all__` controls wildcard export.

---
## 10. File I/O
```python
from pathlib import Path
p = Path("data.txt")
p.write_text("hello\n")
print(p.read_text())

with p.open("a") as fh:
    fh.write("more\n")
```
Binary:
```python
with open("image.bin", "wb") as f:
    f.write(b"\x00\xFF")
```

---
## 11. Error Handling
```python
try:
    risky()
except ValueError as e:
    print("Bad value", e)
except (TypeError, ZeroDivisionError):
    pass
else:
    print("No exception")
finally:
    cleanup()
```
Raise:
```python
if x < 0:
    raise RuntimeError("x must be non-negative")
```
Custom exception:
```python
class DataError(Exception):
    pass
```

---
## 12. Virtual Environments & Dependencies
```bash
python -m venv .venv
source .venv/bin/activate
pip install requests
pip freeze > requirements.txt
```
Recreate: `pip install -r requirements.txt`.

---
## 13. Testing (Intro)
```bash
pip install pytest
```
```python
# test_math.py
def add(a, b): return a + b

def test_add():
    assert add(2, 3) == 5
```
Run: `pytest -q`.

---
## 14. Performance Micro-tips
| Item | Tip |
|------|-----|
| Membership | Prefer set/dict over list for frequent lookups |
| String concat | Use `''.join(list)` not `+` in loops |
| Comprehension | Faster than building then appending in loop |
| Multiprocessing | Use for CPU-bound; `asyncio` for I/O-bound |
| Profiling | `python -m cProfile -o prof.out script.py` |

---
## 15. Common Pitfalls
| Pitfall | Example | Fix |
|---------|---------|-----|
| Mutable default | `def f(x, cache={})` | Use `None` then init |
| Shadow built-in | `list = []` | Use different name |
| Floating equality | `0.1+0.2==0.3` | Use `math.isclose` |
| Late binding loop var | closures capturing loop var | Use default arg (`lambda x=i: x`) |

---
## 16. Mini Cheat Sheet
```python
# Truthy: non-zero numbers, non-empty containers
# Falsy: 0, 0.0, '', [], {}, set(), None, False
bool(0), bool([]), bool('x')  # False False True

# Unpacking
(a, b, *rest) = (1,2,3,4)

# Slicing
seq = [0,1,2,3,4]
seq[1:4]      # [1,2,3]
seq[::-1]     # reversed

# Ternary
res = 'ok' if cond else 'fail'

# Inline swap
x, y = y, x
```

---
## 17. Interview Q & A (Fundamentals)

### 1. What is the difference between a list and a tuple?
Lists are mutable; tuples are immutable. Tuples can be used as dict keys (if elements hashable) and may convey fixed structure.

### 2. Explain list vs generator comprehension memory use.
List builds all elements eagerly in memory; generator yields one at a time (lazy), saving memory for large sequences.

### 3. How does Python manage memory for integers?
Small integers are interned (implementation detail) for reuse; arbitrary precision via dynamic allocation; reference counting + cyclic GC handles lifetime.

### 4. Describe the GIL impact.
Global Interpreter Lock allows only one thread to execute Python bytecode at a time; limits CPU-bound multi-thread scaling; I/O-bound threads still benefit; multiprocessing circumvents.

### 5. Difference between `==` and `is`?
`==` value equality (calls `__eq__`); `is` identity (same object in memory).

### 6. When use `dataclass` vs regular class?
Use dataclass for primarily data containers needing auto-generated `__init__`, `__repr__`, comparisons. Regular class when custom behavior dominates or fine-grained control needed.

### 7. Why avoid mutable default arguments?
The default object persists across calls leading to shared state bugs. Use `None` sentinel and create inside function.

### 8. What is short-circuit evaluation?
`and` / `or` stop evaluating once result determined, enabling patterns like `x and x.method()` safely.

### 9. Explain exception hierarchy design.
Create a project root exception (e.g., `class AppError(Exception): pass`) then domain-specific subclasses. Catch narrowly to avoid masking unrelated errors.

### 10. How to measure a code snippet runtime quickly?
Use `python -m timeit 'expr'` or `timeit` module inside code.

### 11. What are keyword-only arguments and why use them?
Parameters after `*` in signature must be passed by name—improves clarity, prevents accidental positional misuse.

### 12. How to safely compare floats?
`math.isclose(a, b, rel_tol=1e-9, abs_tol=0.0)` accounts for representation error.

### 13. Difference between module and package?
Module = single `.py` file; Package = directory with `__init__.py` (may re-export, set metadata, side-effects).

### 14. How does `with` work internally?
Context manager protocol: object provides `__enter__` and `__exit__`; exceptions inside block passed to `__exit__` which can suppress by returning True.

### 15. What is iterable vs iterator?
Iterable defines `__iter__` returning an iterator; Iterator also defines `__next__`. Generators are iterators.

---
## 18. Next Steps
Proceed to Advanced Python for: iterators & generators deep dive, context managers, descriptors, decorators, async, packaging, typing, performance patterns.

---
*Last updated: Sep 2025*
