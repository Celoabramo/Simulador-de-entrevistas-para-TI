# 🎙️ Agente Simulador de Entrevistas Técnicas (Antigravity CLI + Google ADK)

Agente especialista em simulação e preparação para **entrevistas técnicas de emprego em inglês** (focado em vagas remotas internacionais nos EUA e Europa), construído com o **Google ADK** (Python) e movido pelo **Antigravity CLI (`agy`)**.

O agente utiliza a skill [`simulador-entrevistas`](skills/simulador-entrevistas/SKILL.md): analisa o cruzamento do seu currículo com a vaga de interesse, atua como um Tech Lead ou Recrutador internacional em tempo real, desafia sua capacidade de *think out loud*, entrega o veredito com nota (0 a 100%) e salva o relatório completo com **gabarito comparativo com desenvolvedores seniores nativos** usando o [EnvironmentToolset](https://adk.dev/integrations/environment-toolset/) do ADK.

---

## 🛠️ Pré-requisitos

- Chave de API do Google AI Studio ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- Python ≥ 3.10 com o gerenciador de pacotes [`uv`](https://astral.sh/uv/)
- [Antigravity CLI (`agy`)](https://antigravity.google/cli) instalado (opcional, para pair programming via terminal)
- Conta no GitHub para versionamento

---

## 🚀 Como Executar o Agente Localmente

### 1. Clonar ou Acessar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/agente-entrevistas.git
cd agente-entrevistas
```

### 2. Configurar o Ambiente e Chave de API

Entre na pasta do agente e crie o arquivo `.env`:

```bash
cd agente-entrevistas

cat << EOF > .env
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GEMINI_API_KEY=SUA_API_KEY_AQUI
MODEL=gemini-3.8-flash
EOF
```

Instale as dependências com `uv`:

```bash
uv sync
```

### 3. Iniciar no ADK Web

```bash
uv run adk web --allow_origins="*"
```

Abra no navegador o link gerado (geralmente `http://127.0.0.1:8000`), selecione o agente **`app`** e inicie a simulação.

---

## 🧪 Roteiro de Testes

### Teste 1: Regra de Ativação (Gating / Pedido Incompleto)
Envie apenas uma frase vaga:
```text
Quero treinar para uma entrevista de desenvolvedor.
```
*Comportamento esperado:* O agente **não carrega nenhum arquivo de recurso** e faz uma mensagem curta e direta perguntando o que falta: **cargo alvo, requisitos da vaga, seu currículo/experiência e o formato (Screening vs Tech Lead)**.

---

### Teste 2: Iniciar Simulação Completa
Envie o contexto completo:
```text
Quero simular a 2ª fase (Tech Lead Deep Dive) para a vaga de Senior Distributed Systems Engineer na CloudScale Inc. (EUA remoto).
Requisitos da vaga: Go/Node.js, PostgreSQL, Redis, microsserviços, mensageria com Kafka e fluência em inglês para System Design.
Meu currículo: 6 anos como Fullstack/Backend, experiência com TypeScript, Go, PostgreSQL e AWS. Já desenhei pipelines de pagamento com Redis cache. Falo inglês intermediário/avançado mas travo sob pressão.
```
*Comportamento esperado:*
1. O agente assume a persona do Tech Lead e inicia a primeira pergunta técnica em **inglês**.
2. Ele aguarda suas respostas, faz contra-perguntas e pode enviar pequenos snippets de código ou diagramas.
3. Ao finalizar, entrega a avaliação completa e aciona a ferramenta `WriteFile` para salvar `relatorio-entrevista.md`.

---

### Teste 3: Ajustes e Plano de Estudos
```text
Fui reprovado na parte de concorrência e uso de vícios de fala ("like", "uhm"). Pode gerar um plano de estudos de 2 semanas para corrigir isso antes da minha entrevista real?
```
*Comportamento esperado:* O agente reorganiza o cronograma, atualiza o arquivo com o plano de ação e confirma que o relatório foi regravado.

---

## 📂 Estrutura do Repositório

```text
├── AGENTS.md                          # Diretrizes do agente para o Antigravity CLI
├── README.md                          # Guia completo de instalação e testes
├── skills/
│   └── simulador-entrevistas/
│       ├── SKILL.md                   # Frontmatter L1 e corpo L2 (Regra de Gating)
│       ├── references/
│       │   ├── workflow.md            # Ciclo de vida da entrevista e papéis
│       │   ├── rubrica_avaliacao.md   # Critérios de nota 0-100 e matriz STAR
│       │   └── salvar_relatorio.md    # Instruções de uso do EnvironmentToolset
│       └── assets/
│           ├── relatorio_template.md  # Template padronizado do veredito
│           └── exemplo_relatorio.md   # Exemplo calibrado de avaliação
└── agente-entrevistas/
    ├── pyproject.toml                 # Gerenciamento de dependências com uv
    ├── .env.example                   # Exemplo das variáveis de ambiente
    ├── app/
    │   ├── agent.py                   # Definição do root_agent (ADK)
    │   └── skills/                    # Cópia espelhada da skill para o ADK
    └── relatorios/                    # Pasta de saída dos arquivos (não versionada)
```

---

## 📤 Publicando no seu GitHub

1. Configure seu nome e e-mail no git:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

2. Crie um novo repositório vazio no seu GitHub (ex.: `agente-simulador-entrevistas`).

3. Vincule e envie os arquivos:
```bash
git add .
git commit -m "feat: agente simulador de entrevistas tecnicas com google adk e skills"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/agente-simulador-entrevistas.git
git push -u origin main
```

---

## 📚 Referências

- [Google ADK Documentation](https://adk.dev/)
- [ADK Skills Specification](https://agentskills.io/specification)
- [ADK EnvironmentToolset](https://adk.dev/integrations/environment-toolset/)
- [Google AI Studio](https://aistudio.google.com/)
