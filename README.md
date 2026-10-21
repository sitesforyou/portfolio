# Lorenzo D'Oliveira

Automação de processos, agentes de IA e sistemas para empresas.
Sócio-fundador da **Mentor.IA** · Administração na ESPM · São Paulo

**Portfólio:** [sitesforyou.github.io/portfolio](https://sitesforyou.github.io/portfolio/) · **Mentor.IA:** [sitesforyou.github.io/mentor-ia-site](https://sitesforyou.github.io/mentor-ia-site/)

---

## Sobre

Desenvolvo automações e agentes de IA que tiram processos manuais de planilhas
e e-mails e os colocam em fluxos que rodam sozinhos, com conferência humana nos
pontos de decisão. Trabalho com automação de processos financeiros em empresa
de varejo e, pela Mentor.IA, com automação, sites e IA para pequenas e médias
empresas.

## Automações em destaque

| Projeto | O que faz | Stack | Case |
|---|---|---|---|
| **Central de Contas a Pagar** | Acompanha cada cobrança do boleto ao ERP: robôs de coleta, leitura de PDF por IA, 7 regras de conferência e painel por etapa | Next.js · Supabase · Claude API · n8n · Power Automate | [ler](cases/central-contas-a-pagar.md) |
| **Lançador automático no ERP** | Lança boletos operando a tela do ERP, sem IA: 8 travas, releitura da tela antes de gravar, rascunho de aprovação no Outlook. ~1,5 min por lançamento | PowerShell · Outlook | [ler](cases/lancador-erp.md) |
| **Atualização diária de relatório** | Atualiza a base de uma planilha mestre toda madrugada, confere a gravação e envia resumo por IA | n8n · Microsoft 365 | [ler](cases/atualizacao-diaria-relatorio.md) |
| **Escritório dos Agentes** | Escritório virtual com agentes de IA especializados que trocam informações e montam as entregas | Claude API · Netlify | — |
| **Robôs de trade em cripto** | Duas estratégias automatizadas competindo em modo simulado por oito semanas | Python · Freqtrade | — |

> Os sistemas internos são descritos sem dados da empresa. Código e dados são privados.

## Agentes e skills para Claude Code

**[8 agentes](agentes/)**: `prospector`, `diagnosticador`, `arquiteto-automacao`, `redator`, `orcamentista`, `gestor-cliente`, `auditor-automacao`, `documentador-processo`.

**[5 skills](skills/)**:

| Skill | Para quê |
|---|---|
| [`auditoria-seo-geo`](skills/auditoria-seo-geo/SKILL.md) | Audita a presença em buscadores e em respostas de IA e entrega um plano priorizado |
| [`pesquisa-de-mercado`](skills/pesquisa-de-mercado/SKILL.md) | Pesquisa de mercado estruturada, com fontes, concorrentes e oportunidades |
| [`relatorio-executivo`](skills/relatorio-executivo/SKILL.md) | Relatório de uma página para a liderança, com conclusão primeiro |
| [`landing-page-conversao`](skills/landing-page-conversao/SKILL.md) | Estrutura e texto de landing page orientada a conversão |
| [`especificacao-dashboard`](skills/especificacao-dashboard/SKILL.md) | Indicadores, fontes e layout de um dashboard antes da construção |

## SaaS

| Projeto | Descrição |
|---|---|
| **Régua Pro** | Gestão para barbearias: PDV, NFS-e simulada, DRE, estoque e comissões |
| **Quimapa** | Gera o Mapa Mensal da Polícia Federal (SIPROQUIM) a partir dos XMLs de NF-e |
| **Gestão de marketplaces** | Painel único para vendedores de Mercado Livre e Shopee |

## Sites

Site institucional e plataforma do curso da Mentor.IA, e sites para clientes
de hortifruti por assinatura, consultoria de marketing, moda praia, clínica de
cirurgia plástica, empório artesanal e estúdio de arquitetura.

## Princípios de engenharia

- Regra fixa onde dá para ser regra; IA só onde a entrada não tem padrão.
- Conferência determinística depois de toda gravação.
- Ação irreversível passa por uma pessoa.
- Na dúvida, não executa e explica o porquê.

## Ferramentas

`n8n` `Power Automate` `PowerShell` `Python` `Claude API` `Claude Code` `Next.js` `React` `TypeScript` `Supabase` `PostgreSQL` `GSAP` `Three.js` `Microsoft 365`

## Formação e certificações

- Administração · ESPM São Paulo (em curso), com especialização em Marketing de Conteúdo e SEO/GEO
- Salt Lake Community College (EUA) · inglês avançado
- Anthropic: Claude Code in Action · AI Fluency for Small Businesses (2026)
- Marketing Digital · USP/Coursera (2026) · Excel Standard (2026) · Google Analytics (2024)

## Estrutura deste repositório

```
site/                 código do site (React, GSAP e componentes do 21st.dev)
cases/                cases detalhados das automações
agentes/              subagentes para Claude Code
skills/               skills para Claude
```
