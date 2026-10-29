# AGENTS.md: Agente Simulador de Entrevistas Técnicas

## Goal

Construir o **`agente-entrevistas`**: um agente **Google ADK** (Python) movido a skills, que conduz simulações hiper-realistas de entrevistas técnicas em inglês para vagas internacionais (EUA/Europa), gera diagnósticos com veredito de contratação (*Aprovado* / *Reprovado na Etapa* / *Risco Alto*), gabarito comparativo com Tech Leads nativos e salva o relatório completo de preparação usando o **EnvironmentToolset** do ADK. Roda localmente no **ADK Web** com suporte ao **Antigravity CLI (`agy`)**.

## Context

* **Quem é você:** um Tech Lead e estrategista sênior de IA, fazendo pair programming com quem está desenvolvendo o agente. Explique **o que** está fazendo e **por quê**, em português do Brasil, de forma curta e objetiva.
* **Ambiente:** Google Cloud Shell ou máquina local com `uv` e `agy`. O `agy` roda na raiz do repositório, e o projeto do agente fica em `./agente-entrevistas/`, estruturado nas convenções do **agents-cli**.
* **Skills do ADK** ([adk.dev/skills](https://adk.dev/skills/)): carregadas com `load_skill_from_dir` e expostas pelo `SkillToolset` (`load_skill` e `load_skill_resource`). A skill usa divulgação progressiva:
  * **L1:** `name` e `description` no frontmatter do `SKILL.md`.
  * **L2:** o corpo do `SKILL.md`, com a regra de gating e condução.
  * **L3:** `references/workflow.md`, `references/rubrica_avaliacao.md`, `references/salvar_relatorio.md`, `assets/relatorio_template.md` e `assets/exemplo_relatorio.md`.
* **EnvironmentToolset** ([adk.dev/integrations/environment-toolset](https://adk.dev/integrations/environment-toolset/)): dá ao agente ferramentas de arquivo (`ReadFile`, `WriteFile`) dentro de um `LocalEnvironment`. O agente usa `WriteFile` para gravar `relatorio-entrevista.md` e o plano de ação em `plano-estudos.csv`.
* **Regra de gating da skill:** sem **cargo alvo**, **descrição da vaga / requisitos**, **currículo / stack principal** e **formato da entrevista** (Screening vs Tech Lead), o agente pergunta só o que falta e não carrega nenhum recurso L3. Com tudo em mãos, ele conduz a simulação em inglês e entrega o veredito detalhado em português.
* **Autenticação local:** API Key do Google AI Studio no arquivo `agente-entrevistas/.env`:
  ```env
  GOOGLE_GENAI_USE_VERTEXAI=FALSE
  GEMINI_API_KEY=<sua-api-key>
  MODEL=gemini-3.8-flash
  ```
* **Execução local:**
  ```bash
  cd agente-entrevistas
  uv run adk web --allow_origins="*"
  ```

## Constraints

* **Framework:** use exclusivamente o **Google ADK** em Python, seguindo a especificação de ADK Skills (`load_skill_from_dir` + `SkillToolset`).
* **Divulgação progressiva:** **não** cole o conteúdo de `references/` ou `assets/` na instrução principal do agente. O conteúdo deve ser carregado sob demanda pelas ferramentas da skill.
* **Empacotamento da skill:** copie `skills/simulador-entrevistas/` para `agente-entrevistas/app/skills/simulador-entrevistas/`, porque o ADK resolve o caminho a partir do `agent.py`. Mantenha as duas cópias sincronizadas.
* **Ferramentas de arquivo:** use `EnvironmentToolset(environment=LocalEnvironment(working_dir=...))`, com `working_dir` apontando para `agente-entrevistas/relatorios/` (caminho absoluto calculado a partir do `agent.py`).
* **Sem shell:** exponha apenas `ReadFile` e `WriteFile` através da subclasse de filtro:
  ```python
  class FerramentasDeArquivo(EnvironmentToolset):
      async def get_tools(self, readonly_context=None):
          tools = await super().get_tools(readonly_context)
          return [t for t in tools if t.name in ("ReadFile", "WriteFile")]
  ```
* **Modelo:** leia o modelo da variável de ambiente `MODEL`, com padrão `gemini-3.8-flash`.
* **Segredos:** **nunca** versione `.env` nem a pasta `relatorios/`.
* **Dependências:** gerencie com `uv` dentro de `agente-entrevistas/` (`uv sync`).

## Done-when

- [ ] `agente-entrevistas/app/agent.py` define um `root_agent` com o `SkillToolset` carregando `app/skills/simulador-entrevistas` e o `EnvironmentToolset` expondo apenas `ReadFile` e `WriteFile`.
- [ ] O modelo vem da variável `MODEL`, com fallback para `gemini-3.8-flash`.
- [ ] `uv sync` e `uv run adk web --allow_origins="*"` rodam sem erros e o agente `app` aparece no ADK Web.
- [ ] **Gating:** com um pedido incompleto (ex: "Quero treinar para uma entrevista"), o agente pergunta apenas as informações faltantes e **não** chama `load_skill_resource`.
- [ ] **Simulação e Veredito:** com todas as informações, o agente carrega os recursos L3, conduz as perguntas em inglês, gera o Veredito (0 a 100%, Status de Contratação, Comparativo Sênior) e chama `WriteFile` para salvar `relatorio-entrevista.md`.
- [ ] Nenhum arquivo `.env` ou relatórios pessoais aparecem no versionamento git.
