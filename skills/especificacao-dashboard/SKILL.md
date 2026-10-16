---
name: especificacao-dashboard
description: Define os indicadores, as fontes de dados e o layout de um dashboard antes de ele ser construído (Power BI, Looker Studio, planilha ou web). Use quando o usuário pedir um dashboard, painel de indicadores, KPIs, métricas para acompanhar ou relatório automático.
---

# Especificação de dashboard

Dashboard bom nasce de perguntas, não de gráficos.

## 1. Perguntas
Liste as 3 a 5 perguntas que quem vai usar o painel precisa responder toda
semana. Cada indicador precisa responder a uma delas.

## 2. Indicadores
Para cada um: nome, fórmula, fonte do dado, frequência de atualização, meta
ou referência de comparação e quem é o dono.

## 3. Fontes
Onde cada dado mora, como chega ao painel (manual, exportação, API,
automação) e o que acontece quando a fonte atrasa.

## 4. Layout
- Topo: os 3 a 4 indicadores principais com variação.
- Meio: tendência no tempo dos principais.
- Base: detalhamento e tabela para quem quer investigar.
- Filtros: período e no máximo duas dimensões.

## 5. Entrega
Documento com perguntas, dicionário de indicadores, mapa de fontes e um
esboço do layout. Só depois disso o painel é construído.
