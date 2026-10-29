# Salvar o Relatório da Entrevista (EnvironmentToolset)

O agente salva o relatório completo da entrevista e o plano de ação usando as ferramentas de arquivo do **EnvironmentToolset** do Google ADK ([adk.dev/integrations/environment-toolset](https://adk.dev/integrations/environment-toolset/)).

---

## Ferramentas Disponíveis

| Ferramenta | Para que serve | Argumentos |
|---|---|---|
| `WriteFile` | Grava o relatório ou sobrescreve a versão anterior | `path` (texto), `content` (texto) |
| `ReadFile` | Lê o arquivo para consulta ou replanejamento | `path` (texto) |

Use apenas essas ferramentas. Nunca tente executar comandos shell.

## Regras de Caminho

* Use sempre o caminho relativo `relatorio-entrevista.md`. Ele é resolvido automaticamente dentro da pasta `relatorios/` configurada no ambiente.
* Caso gere também a agenda de estudos, salve como `plano-estudos.csv`.
* **Não** use caminhos absolutos (`/home/...`) nem `../`.

## Como Gravar o Relatório

1. Monte o relatório completo seguindo o modelo de `assets/relatorio_template.md`.
2. Chame `WriteFile` com:
   - `path`: `"relatorio-entrevista.md"`
   - `content`: Conteúdo completo em Markdown formatado.
3. Se o retorno for `{"status": "ok", "message": "Wrote relatorio-entrevista.md"}`, informe o usuário na conversa que o arquivo foi salvo com sucesso.
4. Se ocorrer qualquer erro, mostre o relatório formatado diretamente no chat como fallback.
