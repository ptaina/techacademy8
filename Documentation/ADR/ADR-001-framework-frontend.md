# ADR-001: Escolha do Framework FrontEnd.


**Data:** 23-11-2025 **Status:** Aceito

# #Contexto e Problema

Para o ERP, precisamos selecionar um framework frontend que garanta modernidade e fácil manutenção em telas complexas, como dashboards, cadastros e relatórios, e que tenha uma comunidade robusta para assegurar suporte e longevidade ao projeto

## Alternativas consideradas

**React / Next.js**: Ecossistema dominante,com ampla comunidade e vasta biblioteca de componentes. Performance otimizada, já que o Next.js (SSR) garante carregamento rápido de dashboards e relatórios.Familiaridade da equipe: Conhecimento técnico existente acelera a entrega e reduz riscos.

**Vue.js / Nuxt.js**: Desenvolvimento ágil, de fácil aprendizado e sintaxe limpa, facilitando a manutenção. Documentação excelente, com recursos de consulta de alta qualidade. Porém, menos prevalente em grandes projetos.

**Angular**: Estrutura rígida, garante alta padronização e arquitetura robusta para sistemas gigantes. Overhead e complexa, com uma estrutura excessivamente pesada acaba criando uma curva de aprendizado íngreme, exigindo domínio de ts e rxjs.

## Decisão tomada

A decisão prioriza o Next.js (react) pelo seu suporte integrado a SSR (Server-Side Rendering), o que é vital para o carregamento rápido de telas complexas (dashboards e relatórios). A maturidade do ecossistema React e a familiaridade técnica da equipe são fatores determinantes para garantir a rapidez e a qualidade da entrega.

## Consequências

**Positivo**: Aceleração do desenvolvimento, reutilização e suporte.
**Negativo**: Necessidade de treinamento e adaptação para novos desenvolvedores sem experiência prévia em React/Next.js.
