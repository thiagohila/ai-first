# Algorithms and Data Structures (with Big-O)

> The CS fundamental missing from my toolkit: how to **measure** and **compare**
> algorithms, not just make them work.
>
> It grew out of an exam question ("build a playlist without repeating an artist
> back-to-back") where the solution worked, but I failed to talk about the
> performance trade-off — the famous **Big-O**.

---

## The core idea of Big-O (30 seconds)

Big-O answers a single question: **"if the data grows, how does the time grow?"**

| Notation | What happens if you double the data | Clue in the code |
|---|---|---|
| `O(1)` | nothing changes | direct access (`arr[i]`, `map.get`) |
| `O(log N)` | rises very little | binary search, heap |
| `O(N)` | doubles | **1 loop** |
| `O(N log N)` | almost doubles | `.sort()` |
| `O(N²)` | becomes **4×** | **loop inside a loop** |

Rule of thumb: **count the nested loops.** 1 loop → `O(N)`; loop inside a loop → `O(N²)`.

Where it bites: production performance ("why does it hang with 10k records?") and
**technical interviews** (LeetCode/HackerRank live on this).

---

## Resource 1 — Grokking Algorithms (book)

📖 **Aditya Bhargava** — https://www.manning.com/books/grokking-algorithms

The friendliest place to start: illustrated, light, no heavy math. Great for
building intuition before any formalism.

**Suggested track (~4 weeks, at a pace of 5–10h/week):**

- [ ] **Week 1 — Ch. 1–3:** Big-O in practice + binary search + recursion. *This is the heart of what was missing on the exam.*
- [ ] **Week 2 — Ch. 4–5:** Quicksort (divide-and-conquer) + hash tables (JS's `Map`/object from the inside).
- [ ] **Week 3 — Ch. 6–8:** Graphs + breadth-first search (BFS) + greedy algorithms. *The playlist problem is a greedy one.*
- [ ] **Week 4 — Ch. 9–11:** Dynamic programming + k-nearest neighbors. Rounds out the base.

> 💡 Reimplement each example in **vanilla JS** (the book uses Python). You learn it twice over.

---

## Resource 2 — freeCodeCamp (interactive, free)

💻 **JavaScript Algorithms and Data Structures** — https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/
> Video/visual alternative: **Khan Academy — Algorithms** — https://www.khanacademy.org/computing/computer-science/algorithms

Straight in JavaScript, hands-on, with exercises graded in the browser. Pairs
well with the book: read the concept in Grokking, cement it by practicing here.

**Suggested track (parallel to the book):**

- [ ] **Stage 1 — JS fundamentals:** review arrays, objects, `Map`/`Set` (the basis of almost every data structure).
- [ ] **Stage 2 — Data structures:** implement by hand a stack, queue, **heap** (the priority queue that optimizes problems like the playlist), and linked list.
- [ ] **Stage 3 — Algorithms:** sorting and searching — implement and **time** them with `console.time` to *see* O(N²) vs O(N log N).
- [ ] **Stage 4 — Practice:** 1 easy interview-style problem/day (e.g. reorder an array with no equal adjacent elements — exactly the exam question).

---

## Status

🌱 Open track. Check the boxes as you go.
