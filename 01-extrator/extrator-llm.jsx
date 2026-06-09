import { useState } from "react";

/*
  ============================================================
  AULA: COMO INCLUIR UM LLM NUM APP
  ============================================================
  Padrão demonstrado: STRUCTURED OUTPUT -> UI
  Em vez de tratar o LLM como um chat, tratamos como uma
  FUNÇÃO: recebe texto -> devolve JSON -> vira interface.

  As 3 partes novas (o resto você já sabe como frontend):
    1. A estrutura da requisição (messages + um "system prompt")
    2. Forçar o modelo a devolver SÓ JSON
    3. Parsear com segurança (a saída é não-determinística!)
  ============================================================
*/

// Tema (CSS-in-JS simples pra manter tudo num arquivo)
const ink = "#1a1714";
const paper = "#f4efe6";
const accent = "#c2410c"; // terracota
const muted = "#6b6258";

const serif = "Georgia, 'Times New Roman', serif";
const mono = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

const EXEMPLO = `Reunião de produto - 12/06
A entrega do checkout atrasou de novo, o time está frustrado com a falta de specs.
Ana vai revisar os requisitos até quinta. Preciso que o Bruno alinhe com o design antes disso.
No geral o clima melhorou desde a última sprint, mas ainda há risco no prazo.`;

export default function App() {
  const [texto, setTexto] = useState(EXEMPLO);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState(null);

  async function analisar() {
    setCarregando(true);
    setErro(null);
    setResultado(null);

    try {
      // ----------------------------------------------------------
      // PARTE 1 + 2: A CHAMADA. É só um fetch.
      // O segredo está no prompt: descrevemos o formato EXATO de
      // JSON que queremos e dizemos "responda SÓ com JSON, sem
      // markdown, sem texto antes ou depois". Sem isso, o modelo
      // tende a tagarelar ("Claro! Aqui está...") e quebra o parse.
      // ----------------------------------------------------------
      const prompt = `Você é um extrator de dados. Analise o TEXTO e responda APENAS com um objeto JSON válido, sem markdown, sem crases, sem nenhum texto antes ou depois.

Formato exato:
{
  "sentimento": "positivo" | "neutro" | "negativo",
  "resumo": "uma frase curta",
  "topicos": ["tópico 1", "tópico 2"],
  "acoes": [{ "tarefa": "...", "responsavel": "nome ou null" }]
}

TEXTO:
"""${texto}"""`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", // modelo a usar
          max_tokens: 1000,
          // "messages" é o coração da API: uma lista de turnos.
          // Cada um tem role ("user"/"assistant") e content.
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();

      // ----------------------------------------------------------
      // PARTE 3: TRATAR A RESPOSTA.
      // data.content é uma LISTA de blocos. O texto vem nos blocos
      // de type "text". Sempre extraia por TIPO, nunca por posição.
      // ----------------------------------------------------------
      const textoResposta = data.content
        .filter((bloco) => bloco.type === "text")
        .map((bloco) => bloco.text)
        .join("");

      // Defesa: mesmo pedindo "só JSON", às vezes vem com ```json.
      // Limpamos as crases antes de parsear. SEMPRE em try/catch,
      // porque a saída é não-determinística e pode não ser JSON.
      const limpo = textoResposta.replace(/```json|```/g, "").trim();
      const json = JSON.parse(limpo);

      setResultado(json);
    } catch (e) {
      // Tratar erro faz parte do ofício de AI: rede falha, o modelo
      // pode devolver algo inesperado. UX nunca pode quebrar.
      setErro("Não consegui processar. Tente de novo ou ajuste o texto.");
    } finally {
      setCarregando(false);
    }
  }

  const corSentimento = {
    positivo: "#15803d",
    neutro: muted,
    negativo: "#b91c1c",
  };

  return (
    <div
      style={{
        background: paper,
        color: ink,
        minHeight: "100%",
        fontFamily: serif,
        padding: "2.5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Cabeçalho */}
        <div style={{ borderBottom: `2px solid ${ink}`, paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 2, color: accent, textTransform: "uppercase" }}>
            structured output → ui
          </div>
          <h1 style={{ fontSize: 34, margin: "0.25rem 0 0", fontWeight: 700, letterSpacing: -0.5 }}>
            Extrator
          </h1>
          <p style={{ color: muted, fontSize: 15, margin: "0.4rem 0 0" }}>
            Cole um texto. O LLM devolve JSON. O JSON vira interface.
          </p>
        </div>

        {/* Entrada */}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontFamily: mono,
            fontSize: 13.5,
            lineHeight: 1.6,
            padding: "1rem",
            border: `1.5px solid ${ink}`,
            background: "#fbf8f1",
            color: ink,
            resize: "vertical",
            outline: "none",
          }}
        />

        <button
          onClick={analisar}
          disabled={carregando || !texto.trim()}
          style={{
            marginTop: "0.85rem",
            fontFamily: mono,
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
            background: carregando ? muted : ink,
            color: paper,
            border: "none",
            padding: "0.8rem 1.6rem",
            cursor: carregando ? "wait" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {carregando ? "Analisando…" : "Analisar →"}
        </button>

        {/* Estado de erro (AI UX: falha com elegância) */}
        {erro && (
          <div style={{ marginTop: "1.25rem", color: "#b91c1c", fontFamily: mono, fontSize: 13 }}>
            ⚠ {erro}
          </div>
        )}

        {/* Resultado: JSON renderizado como UI */}
        {resultado && (
          <div style={{ marginTop: "2rem", animation: "fade 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: 1, color: muted, textTransform: "uppercase" }}>
                sentimento
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: corSentimento[resultado.sentimento] || muted }}>
                {resultado.sentimento}
              </span>
            </div>

            <p style={{ fontSize: 19, fontStyle: "italic", lineHeight: 1.5, margin: "0 0 1.5rem", borderLeft: `3px solid ${accent}`, paddingLeft: "1rem" }}>
              {resultado.resumo}
            </p>

            {/* Tópicos como chips */}
            {resultado.topicos?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 1, color: muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  tópicos
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {resultado.topicos.map((t, i) => (
                    <span key={i} style={{ fontFamily: mono, fontSize: 12, background: "#e9e1d3", padding: "0.35rem 0.7rem", border: `1px solid ${ink}` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ações como lista */}
            {resultado.acoes?.length > 0 && (
              <div>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 1, color: muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  itens de ação
                </div>
                {resultado.acoes.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.7rem 0", borderBottom: `1px solid #ddd3c4` }}>
                    <span style={{ color: accent, fontWeight: 700 }}>—</span>
                    <div>
                      <div style={{ fontSize: 16 }}>{a.tarefa}</div>
                      {a.responsavel && (
                        <div style={{ fontFamily: mono, fontSize: 12, color: muted, marginTop: 2 }}>
                          @ {a.responsavel}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
