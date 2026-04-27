# Computer Engineering Foundations

> Concise systems-oriented primer: architecture, OS, networks, compilers, performance—bridging theory & practical debugging.

---
## 1. Computer Architecture (Abbreviated)
| Layer | Concept | Note |
|-------|--------|------|
| ISA | Instruction Set | x86-64 vs ARM differences (power vs density) |
| CPU Microarchitecture | Pipelines, ALUs | Out-of-order execution hides latency |
| Memory Hierarchy | L1/L2/L3, DRAM | Locality (temporal/spatial) dominates speed |
| Storage | SSD vs HDD | SSD lower latency, wear leveling |
| Parallelism | SIMD, multi-core | Data vs task parallel strategies |

Caches: write-back vs write-through; false sharing inflates coherence traffic.

---
## 2. Memory & Representation
Endianness: byte order. Alignment improves access speed. Common numeric overflow pitfalls (in C) absent in Python (big-int) but performance trade-offs.

---
## 3. Operating System Essentials
| Area | Responsibilities |
|------|------------------|
| Process Management | Scheduling, context switching |
| Memory Management | Virtual memory, paging |
| File Systems | Organization, consistency (journaling) |
| Concurrency | Synchronization primitives |
| Security | Isolation, permissions, syscalls |

System calls transition user → kernel mode. Context switch overhead: save registers, switch stacks, flush pipelines.

---
## 4. Processes vs Threads vs Async
| Model | Characteristics | Use |
|-------|-----------------|-----|
| Process | Separate address space | Isolation, multi-core CPU bound |
| Thread | Shared memory | Lightweight, synchronization cost |
| Async | Cooperative tasks | High-concurrency I/O |

---
## 5. Concurrency Hazards
| Hazard | Description | Mitigation |
|--------|-------------|-----------|
| Race Condition | Order-dependent shared access | Locks / atomic ops |
| Deadlock | Cyclic wait | Lock ordering, timeouts |
| Starvation | Thread never scheduled | Fair scheduling |
| Livelock | Active but no progress | Backoff strategies |

---
## 6. Networking Fundamentals
| Layer | Protocols |
|-------|----------|
| Application | HTTP, DNS, SMTP |
| Transport | TCP (reliable), UDP (datagrams) |
| Internet | IP, ICMP |
| Link | Ethernet, Wi-Fi |

TCP handshake: SYN → SYN-ACK → ACK. Congestion control adjusts send window (AIMD). Latency sources: propagation, serialization, queueing.

---
## 7. Sockets (Minimal Python)
```python
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('example.com', 80))
s.sendall(b'GET / HTTP/1.1\r\nHost: example.com\r\n\r\n')
data = s.recv(1024)
```
Non-blocking & async wrappers improve scalability.

---
## 8. Filesystems & I/O
Ext4, NTFS, APFS differences; journaling prevents corruption. Sequential I/O faster due to prefetch; random I/O latency bound.

---
## 9. Compilation & Toolchain
Source → (Preprocess) → Compile → Assemble → Link. Optimization levels (`-O2`, `-O3`) trade performance vs compile time. Just-In-Time (Python: CPython bytecode interpreter + potential acceleration via PyPy).

---
## 10. Performance Profiling Mindset
| Step | Action |
|------|-------|
| Measure | Baseline metrics (perf, time, memory) |
| Identify | Hotspots via profiling |
| Optimize | Algorithmic > micro-optimizations |
| Validate | Re-measure, ensure no regression |

Tools: `perf`, `vmstat`, `iostat`, `htop`, flame graphs.

---
## 11. Reliability & Observability
Metrics (latency, error rate, saturation). Logging (structured). Tracing spans across services. Error budgets guide release velocity.

---
## 12. Virtualization & Containers
Hypervisors (KVM) vs containers (namespace isolation + cgroups). Overhead: virtualization adds additional layer; containers share kernel.

---
## 13. Cloud & Scalability Basics
Horizontal vs vertical scaling. Elasticity: auto-scaling groups. Load balancing: L4 (TCP) vs L7 (HTTP) decisions. Stateless services easier to scale; state moved to external stores.

---
## 14. Security Principles
Least privilege, defense in depth, threat modeling, secure defaults, patch management, encryption in transit (TLS) & at rest.

---
## 15. Interview Q & A (Systems)
1. Difference between process and thread context switch? Process switches page tables & more state (heavier). Threads share address space (lighter).
2. What is a race condition? Outcome depends on non-deterministic scheduling; fix with synchronization primitives.
3. Why use non-blocking I/O? Avoid tying up threads during waits, scaling to many concurrent connections.
4. Explain virtual memory benefit. Provides isolation & larger logical address space via paging.
5. Deadlock necessary conditions? Mutual exclusion, hold-and-wait, no preemption, circular wait.
6. Throughput vs latency? Throughput = operations per unit time; latency = time per operation.
7. DNS lookup impact on latency? Adds network round trip; cache results to reduce.
8. Container vs VM? Container lighter (share host kernel); VM full OS virtualization (stronger isolation).
9. What is false sharing? Multiple cores modify different data on same cache line -> invalidation thrash.
10. Why prefer async over threads sometimes? Lower memory overhead, less context switching for I/O-bound workloads.
11. TCP vs UDP tradeoff? Reliability & ordering (TCP) vs low latency & no built-in congestion control (UDP).
12. What is a segmentation fault? Invalid memory access in low-level languages (protected page); prevented by memory safety in Python.
13. Horizontal scaling challenge? Distributed state consistency & coordination overhead.
14. CAP theorem summary? In partition: choose Consistency or Availability trade-off.
15. Purpose of load balancer health checks? Route traffic only to healthy instances ensuring resilience.

---
*Last updated: Sep 2025*
