# Algoritmos e Estruturas de Dados (com Big-O)

> Fundamento de CS que faltava na bagagem: como **medir** e **comparar** algoritmos,
> não só fazê-los funcionar.
>
> Nasceu de uma questão de prova ("monte uma playlist sem repetir artista em
> sequência") onde a solução funcionava, mas faltou falar do trade-off de
> performance — o famoso **Big-O**.

---

## A ideia central do Big-O (30 segundos)

Big-O responde uma única pergunta: **"se os dados crescerem, o tempo cresce como?"**

| Notação | O que acontece se dobrar os dados | Pista no código |
|---|---|---|
| `O(1)` | nada muda | acesso direto (`arr[i]`, `map.get`) |
| `O(log N)` | sobe pouquíssimo | busca binária, heap |
| `O(N)` | dobra | **1 loop** |
| `O(N log N)` | quase dobra | `.sort()` |
| `O(N²)` | fica **4×** | **loop dentro de loop** |

Regra prática: **conte os loops aninhados.** 1 loop → `O(N)`; loop dentro de loop → `O(N²)`.

Onde isso pega: performance em produção ("por que trava com 10k registros?") e
**entrevistas técnicas** (LeetCode/HackerRank vivem disso).

---

## Recurso 1 — Grokking Algorithms (livro)

📖 **Aditya Bhargava** — https://www.manning.com/books/grokking-algorithms

O mais amigável pra começar: ilustrado, leve, sem matemática pesada. Ótimo pra
construir intuição antes de qualquer formalismo.

**Trilha sugerida (~4 semanas, no ritmo de 5–10h/sem):**

- [ ] **Sem 1 — Cap. 1–3:** Big-O na prática + busca binária + recursão. *Aqui mora o coração do que faltou na prova.*
- [ ] **Sem 2 — Cap. 4–5:** Quicksort (dividir-e-conquistar) + hash tables (o `Map`/objeto do JS por dentro).
- [ ] **Sem 3 — Cap. 6–8:** Grafos + busca em largura (BFS) + algoritmos gulosos. *O problema da playlist é um guloso.*
- [ ] **Sem 4 — Cap. 9–11:** Programação dinâmica + k-vizinhos. Fecha a base.

> 💡 Reimplemente cada exemplo em **JS vanilla** (o livro usa Python). Aprende dobrado.

---

## Recurso 2 — freeCodeCamp (interativo, grátis)

💻 **JavaScript Algorithms and Data Structures** — https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/
> Alternativa em vídeo/visual: **Khan Academy — Algorithms** — https://www.khanacademy.org/computing/computer-science/algorithms

Direto em JavaScript, hands-on, com exercícios corrigidos no navegador. Casa bem
com o livro: leia o conceito no Grokking, fixe praticando aqui.

**Trilha sugerida (paralela ao livro):**

- [ ] **Etapa 1 — Fundamentos JS:** revisar arrays, objetos, `Map`/`Set` (a base de quase toda estrutura de dados).
- [ ] **Etapa 2 — Estruturas de dados:** implementar à mão pilha, fila, **heap** (a fila de prioridade que otimiza problemas como a playlist) e lista ligada.
- [ ] **Etapa 3 — Algoritmos:** ordenação e busca — implementar e **cronometrar** com `console.time` pra *ver* o O(N²) vs O(N log N).
- [ ] **Etapa 4 — Praticar:** 1 problema fácil/dia no estilo entrevista (ex.: reorganizar array sem elementos iguais adjacentes — exatamente a questão da prova).

---

## Status

🌱 Trilha aberta. Marcar os checkboxes conforme avança.
