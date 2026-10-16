# Atualização diária de relatório

Workflow **n8n** agendado (com versão alternativa em Power Automate + Office
Scripts) que atualiza toda madrugada a base de uma planilha mestre de estoque
a partir do relatório do dia, confere a gravação e envia um resumo ao gestor.

```mermaid
flowchart LR
  T[Agendamento 02:00] --> B[Busca relatório no OneDrive]
  B --> N{Arquivo das últimas 24 h?}
  N -- não --> A1[E-mail: sem arquivo novo<br>planilha não é tocada]
  N -- sim --> W[Grava a aba de base a partir de A1]
  W --> C{Conferência: linhas, colunas,<br>primeira linha}
  C -- falhou --> A2[E-mail de erro com o detalhe]
  C -- ok --> IA[Resumo operacional e<br>análise do estoque por IA]
  IA --> E[E-mail ao gestor]
```

## Regras do workflow
- Só nós nativos do n8n Cloud.
- Atualiza apenas a aba de base; dashboards e outras abas ficam intactos.
- Conferência determinística antes da IA: a IA só escreve o resumo.
- Três avisos: sucesso, sem arquivo novo e erro.
- Entregue salvo e desligado; ativado só depois de revisão.
- Se faltar credencial, ID ou nome de aba, o construtor para e pergunta.
