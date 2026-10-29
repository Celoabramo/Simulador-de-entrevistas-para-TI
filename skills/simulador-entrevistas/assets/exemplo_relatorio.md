# Exemplo Calibrado de Relatório Preenchido

Use este exemplo para **calibrar o nível de rigor, detalhe e tom consultivo**.

---

# 📊 Relatório de Desempenho: Simulação Técnica Internacional

**Cargo Alvo:** Senior Distributed Systems Engineer · **Empresa / Perfil:** CloudScale Inc. (US Remote)
**Data da Simulação:** 29/10/2026 · **Entrevistador:** David Keller (Director of Engineering)

---

## 🏆 Veredito do Comitê de Contratação

**Score Geral:** **68 / 100**
**Decisão:** `[ 🛑 REPROVADO NA ETAPA TÉCNICA ]`

> **Resumo Executivo:** O candidato demonstrou sólida experiência prática em desenvolvimento backend e familiaridade com ferramentas essenciais de microsserviços (PostgreSQL, Redis e Docker). Contudo, sob a pressão de questionamentos diretos em inglês, recorreu a respostas curtas e pouco fundamentadas para cenários de alta concorrência e falhas parciais. A hesitação excessiva e a ausência de justificativas com métricas de engenharia (latência P99, MTTR e failover) o colocam abaixo da barra esperada para um cargo Sênior no mercado norte-americano.

---

### 1. Detalhamento por Pilar

| Pilar | Nota | Nível Observado |
|---|---|---|
| **Inglês Técnico & Assertividade** | 65% | Risco Alto (hesitações frequentes e vocabulário genérico) |
| **Profundidade Técnica & Arquitetura** | 72% | Aprovado (soluções viáveis, mas sem tratamento de edge cases) |
| **Comunicação Think-Out-Loud** | 67% | Risco Alto (pouco compartilhamento do processo de decisão) |
| **Fator Câmera / Presença Visual** | OK | Câmera ligada durante toda a sessão (engajamento pleno) |

---

### 2. Pontos Fortes Observados
* Identificou rapidamente a necessidade de desacoplar o banco de dados primário de picos de leitura utilizando camada de cache.
* Conhecimento prático real de queries complexas e particionamento em PostgreSQL.

### 3. Falhas Críticas & Oportunidades de Melhoria
* Uso excessivo de muletas linguísticas (*"uhm", "like", "you know", "I guess"*) que transmitem insegurança técnica.
* Quando questionado sobre concorrência (*race conditions* em carteiras digitais), sugeriu travar a tabela inteira, o que causaria gargalo severo em produção.

---

### 4. Gabarito Comparativo: Como Você Disse vs. Como um Tech Lead Sênior Falaria

#### Rodada 1: Estratégia de Caching e Banco de Dados
* **Como você respondeu:** *"I think maybe we can put Redis because it is very fast and easy to do, so the database doesn't crash."*
* **Como um Tech Lead Sênior nativo formularia:** *"We should introduce an in-memory Redis cluster as a look-aside cache to shield our primary PostgreSQL database from read spikes, reducing our P99 read latency to sub-5ms while maintaining a strict TTL and LRU eviction policy."*
* **Por que funciona:** Substitui suposições tímidas (*"I think maybe"*) por termos e métricas consolidadas de engenharia sênior (*look-aside cache, read spikes, P99 latency, TTL, LRU eviction*).

#### Rodada 2: Tratamento de Falhas e Queda de Servidores
* **Como você respondeu:** *"If the server breaks, we just restart and see what happened in the logs."*
* **Como um Tech Lead Sênior nativo formularia:** *"To guarantee high availability and minimize MTTR, we should configure liveness and readiness probes in Kubernetes for automated pod eviction, coupled with distributed tracing via OpenTelemetry to correlate logs and diagnose the root cause without downtime."*
* **Por que funciona:** Transforma uma visão amadora de suporte ("reiniciar e olhar log") em uma estratégia profissional de resiliência e observabilidade (*MTTR, probes, automated eviction, OpenTelemetry*).

---

### 5. Plano de Ação Imediato em 3 Passos
1. **Estruturar respostas no Framework STAR:** Iniciar contextualizando a Situação, a Tarefa arquitetural, a Ação técnica tomada e o Resultado mensurável alcançado.
2. **Substituir vícios de fala por pausas silenciosas:** Praticar 2 segundos de silêncio consciente para organizar as palavras em inglês antes de emitir a resposta.
3. **Revisar tópicos de Concorrência e Consistência:** Estudar bloqueio otimista vs pessimista (*optimistic locking*), idempotência com tokens em APIs e o Teorema CAP.

---
📁 Relatório salvo com sucesso em `relatorio-entrevista.md`.
