# Roadmap: de Frontend Sênior a Referência em Desenvolvimento com IA

> **Perfil:** 7 anos de frontend, JavaScript forte, já desenvolve com Claude e usa sistemas de contexto.
> **Objetivo:** dominar o desenvolvimento AI-native e virar referência na área.
> **Ritmo:** ~5–10h/semana. O roadmap é desenhado pra esse ritmo — fases, não maratona.
> **Princípio central:** tudo é orientado a projeto. Você não "estuda" um módulo, você *entrega* algo ao fim dele. Referência é quem produz, não quem só consome.

---

## Como vamos trabalhar nesta sessão

A cada conversa, a gente pega **uma fase** (ou parte dela), eu te dou o contexto, a gente faz junto, você entrega o artefato e marca como concluído aqui embaixo. Quando voltar, é só dizer "vamos continuar de onde paramos" que eu pego o fio.

**Checklist de progresso** (vá marcando):

- [ ] Fase 0 — Posicionamento
- [ ] Fase 1 — Modelo mental de LLMs
- [ ] Fase 2 — Context Engineering
- [ ] Fase 3 — Maestria em agentic coding
- [ ] Fase 4 — Construir produtos COM IA (API)
- [ ] Fase 5 — MCP e agentes
- [ ] Fase 6 — Confiabilidade: evals e observabilidade
- [ ] Fase 7 — AI UX (seu diferencial — contínuo)
- [ ] Fase 8 — Virar referência (contínuo desde já)

---

## Fase 0 — Posicionamento (1 semana)

Antes de técnica, decisão de identidade. Referência precisa de um lugar pra existir.

- Escolha seu eixo: "AI Product Engineer (frontend-first)" é a aposta forte pro seu perfil.
- Abra **um** canal de "build in public": pode ser GitHub ativo, um blog simples, ou Twitter/X/LinkedIn técnico. Um só, que você sustente.
- Defina uma cadência mínima realista: 1 post/semana sobre algo que você aprendeu ou construiu. Pequeno conta.

**Entrega:** canal criado + primeiro post ("estou aprendendo a construir com IA, aqui vai o que descobri sobre X").

---

## Fase 1 — Modelo mental de LLMs (2–3 semanas)

Você não precisa de matemática de ML. Precisa de um modelo mental de praticante forte o suficiente pra *prever o comportamento* do modelo.

- Tokens, janela de contexto, e por que "contexto é orçamento" (cada token disputa atenção).
- Por que LLMs alucinam, e o que reduz isso (contexto, grounding, ferramentas).
- Temperatura/sampling — quando importa e quando não.
- Quando usar **prompt** vs **contexto** vs **RAG** vs **fine-tuning** (e por que fine-tuning quase nunca é a primeira resposta).
- Famílias de modelo e trade-offs (raciocínio vs velocidade vs custo): quando vale um modelo mais forte vs um mais rápido.

**Entrega:** um documento curto seu — "como eu explico LLM pra um dev" — em 1 página. Se você consegue explicar, você entendeu.

---

## Fase 2 — Context Engineering (3–4 semanas) ⭐ núcleo do ofício

Prompt engineering virou *context engineering*. É aqui que mora a diferença entre quem usa IA e quem domina IA. Você já tangencia isso com `.context` — vamos sistematizar.

- Arquivos de contexto de projeto (ex.: `CLAUDE.md`): o que entra, o que NÃO entra, hierarquia.
- Estruturar contexto: instruções, exemplos (few-shot), restrições, formato de saída.
- Gestão de contexto longo: o que carregar sob demanda vs sempre, evitar "poluição" de contexto.
- Memória e recuperação: quando o modelo precisa lembrar e como você alimenta isso.
- Padrões de reuso: templates de contexto que você aplica em qualquer projeto.

**Entrega:** um setup de contexto bem-engenhado, documentado, para um projeto real seu — e um post explicando suas decisões (isso já alimenta a Fase 8).

---

## Fase 3 — Maestria em agentic coding (3–4 semanas)

Aqui é "programar com IA" no nível sênior. A ferramenta de referência é o **Claude Code** (agente de código em linha de comando / app). Docs: https://docs.claude.com/en/docs/claude-code/overview

- Planejar vs executar: quando deixar o agente correr e quando dirigir passo a passo.
- Delegar com segurança: revisar diffs, TDD com agente, commits pequenos e reversíveis.
- Subagentes / divisão de tarefas para trabalho maior.
- Workflow de git pensado pra colaboração humano+agente.
- O hábito que separa os bons: **revisar o output como se fosse PR de júnior** — nunca confiar cego.

**Entrega:** entregar uma feature não-trivial num projeto real, majoritariamente de forma agêntica, e escrever o "antes/depois" do seu processo.

---

## Fase 4 — Construir produtos COM IA (4–6 semanas) ⭐ a virada

Sai de "uso IA pra codar" e entra em "construo software que usa IA". Aqui seu frontend brilha. Docs da API: https://docs.claude.com/en/api/overview

- A API de mensagens: requisição, resposta, streaming.
- **Tool use / function calling**: dar "mãos" ao modelo.
- **Structured outputs**: fazer o modelo devolver JSON confiável que vira UI.
- Gerenciar conversa multi-turno e estado (o modelo não tem memória entre chamadas — você gerencia).
- Seleção de modelo por tarefa (custo/latência/qualidade).

**Entrega:** um app de IA de ponta a ponta — ex.: um assistente de domínio específico com UI de streaming, tool use e uma saída estruturada que vira interface. Esse é seu carro-chefe de portfólio.

---

## Fase 5 — MCP e agentes (3–4 semanas)

O **Model Context Protocol (MCP)** é como você conecta o modelo a ferramentas e dados externos de forma padronizada. Dominar isso hoje te coloca à frente.

- Conceito de MCP: servidores, ferramentas, recursos.
- Construir um **servidor MCP** simples (uma ferramenta que você expõe ao modelo).
- Montar um agente pequeno que usa ferramentas pra cumprir um objetivo de várias etapas.
- Limites: quando um agente é overkill e um fluxo simples resolve.

**Entrega:** um servidor MCP funcional + demo de um agente usando-o. Open source no seu GitHub.

---

## Fase 6 — Confiabilidade: evals e observabilidade (2–3 semanas)

Isto separa referência de hype. Qualquer um faz uma demo bonita; poucos garantem que funciona amanhã.

- Por que "funcionou no meu teste" não é confiabilidade.
- Escrever **evals**: conjuntos de casos que medem se mudanças melhoram ou pioram o sistema.
- Detectar regressões ao mexer em prompt/contexto/modelo.
- Observabilidade em produção: logar, medir, entender falhas reais.

**Entrega:** uma suíte de evals para o app da Fase 4 + um post "como eu testo sistemas de IA" (conteúdo raro = ótimo pra virar referência).

---

## Fase 7 — AI UX (contínuo) ⭐ seu diferencial real

Onde seus 7 anos de frontend viram vantagem injusta. A maioria dos AI engineers ignora isso.

- UIs de streaming: mostrar o modelo "pensando/escrevendo" bem.
- Generative UI: o modelo decide partes da interface.
- Padrões de chat: estados de loading, erro, retry, latência percebida.
- Lidar com alucinação na UX: citações, confiança, "human-in-the-loop", desfazer.
- Affordances honestas: deixar claro o que é IA e dar controle ao usuário.

**Entrega:** uma "biblioteca de padrões de AI UX" sua — componentes + notas — que você reusa e mostra publicamente.

---

## Fase 8 — Virar referência (contínuo, desde a Fase 0)

Referência = pessoa de quem os outros aprendem. Isso exige output constante, não só estudo.

- Publique o que aprende em cada fase (você já vai ter material das entregas).
- Open source os projetos (Fases 4 e 5 são portfólio forte).
- Escreva os "como eu faço X" — padrões reproduzíveis valem mais que opiniões.
- Eventualmente: palestra em meetup, vídeo, ou guia mais longo.

**Métrica honesta:** você é referência quando alguém te cita ou usa algo que você publicou sem você pedir.

---

## Stack sugerida (enxuta de propósito)

- **Linguagem:** TypeScript (alavanca seu JS; structured outputs e tooling ficam muito melhores tipados).
- **Agentic coding:** Claude Code.
- **App de IA:** SDK da Anthropic + seu framework de frontend de preferência.
- **Contexto:** arquivos de contexto de projeto versionados no git.
- **Docs de referência:** https://docs.claude.com (API e Claude Code).

---

## Sequência realista no seu ritmo (~5–10h/semana)

Não é prazo, é ordem. Pule o que já domina.

1. Fase 0 + começo da Fase 1 (modelo mental) — primeiras semanas.
2. Fase 2 (context engineering) — o coração; não tenha pressa.
3. Fase 3 (agentic) — provavelmente você avança rápido aqui.
4. Fase 4 (construir com API) — o grande salto; reserve fôlego.
5. Fases 5 e 6 — onde poucos chegam; é seu diferencial técnico.
6. Fases 7 e 8 rodam *em paralelo* o tempo todo.

---

*Documento vivo. A gente atualiza o checklist e ajusta conforme você avança. Quando voltar, diga "vamos continuar" e a gente pega a próxima fase.*
