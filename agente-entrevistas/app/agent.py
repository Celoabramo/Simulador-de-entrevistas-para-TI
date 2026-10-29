import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

from google.adk import Agent
from google.adk.skills import load_skill_from_dir, SkillToolset
from google.adk.integrations.environment import LocalEnvironment, EnvironmentToolset

# Carrega variáveis de ambiente do .env
load_dotenv()

# Caminhos base calculados a partir deste arquivo
APP_DIR = Path(__file__).resolve().parent
SKILLS_DIR = APP_DIR / "skills" / "simulador-entrevistas"
RELATORIOS_DIR = (APP_DIR.parent / "relatorios").resolve()

# Garante que a pasta de relatórios exista
RELATORIOS_DIR.mkdir(parents=True, exist_ok=True)


# Subclasse para filtrar apenas ferramentas seguras de arquivo (sem execução de shell)
class FerramentasDeArquivo(EnvironmentToolset):
    async def get_tools(self, readonly_context=None):
        tools = await super().get_tools(readonly_context)
        return [t for t in tools if t.name in ("ReadFile", "WriteFile")]


# Configuração do EnvironmentToolset apontando para a pasta relatorios/
ambiente_arquivos = LocalEnvironment(working_dir=str(RELATORIOS_DIR))
ferramentas_arquivo = FerramentasDeArquivo(environment=ambiente_arquivos)

# Carrega a skill de simulação de entrevistas
skill_simulador = load_skill_from_dir(str(SKILLS_DIR))
ferramentas_skill = SkillToolset(skills=[skill_simulador])

# Modelo configurável via variável de ambiente (padrão gemini-3.8-flash)
MODEL_NAME = os.getenv("MODEL", "gemini-3.8-flash")


# Provedor de instrução dinâmica com a data atual injetada
def instrucao_do_agente() -> str:
    hoje = datetime.now().strftime("%d/%m/%Y")
    return f"""Você é o Agente Simulador de Entrevistas Técnicas para vagas internacionais de engenharia de software.
Data de hoje: {hoje}.

Sua missão é ajudar desenvolvedores e profissionais de tecnologia a passarem em entrevistas técnicas em inglês para os EUA e Europa.
Você é movido pela skill 'simulador-entrevistas'.

DIRETRIZES FUNDAMENTAIS:
1. Respeite rigorosamente a Regra de Gating da skill: se faltar cargo alvo, requisitos da vaga, currículo/experiência ou formato da entrevista, pergunte apenas o que falta em uma única mensagem curta e NÃO carregue recursos da skill antes de ter todas as respostas.
2. Quando todas as informações forem fornecidas, carregue o recurso 'references/workflow.md' da skill e siga os passos na ordem.
3. Conduza as perguntas da simulação em inglês de forma interativa, realista e exigente (uma pergunta por vez).
4. Ao final da entrevista, aplique a rubrica de avaliação e gere o veredito completo em português no formato do template.
5. Use a ferramenta WriteFile para gravar o relatório final em 'relatorio-entrevista.md'.
"""


# Definição do root_agent para o Google ADK Web e Antigravity CLI
root_agent = Agent(
    name="app",
    model=MODEL_NAME,
    instruction=instrucao_do_agente,
    tools=[ferramentas_skill, ferramentas_arquivo],
)
