# ADR-002: Escolha do Framework BackEnd.

**Data:** 23-11-2025 **Status:** Aceito

## Contexto e Problema

O projeto requer um backend que sirva como a espinha dorsal do sistema ERP (módulos de cadastro, financeiro, estoque e mensageria). O framework deve ser robusto, escalável, e, idealmente, ter compatibilidade nativa com TypeScript para garantir a consistência e a segurança de tipos em toda a aplicação.
Alternativas consideradas

**NestJS:** Estrutura modular, uso nativo de TypeScript, e fácil integração com bancos de dados relacionais e serviços de mensageria

**Expressjs:** Leveza e comunidade Node.js massiva.

**Spring boot:** Leveza e comunidade Node.js massiva.

## Decisão tomada

A escolha de usar o Express.js foi pela sua leveza e flexibilidade. Sendo o framework web mínimo do Node.js, ele oferece controle total sobre a arquitetura, permitindo à equipe construir uma solução backend altamente customizada e performática . Sua maturidade e a vasta comunidade do Node.js garantem uma base sólida. Esta escolha capitaliza a experiência da equipe com a stack Node.js, assegurando a rapidez na implementação e a otimização de recursos.
Consequências

**Positivo:** Leveza e desempenho, flexibilidade total e recursos amplos
**Negativo:** Necessidade de padrões internos, já que o express.js puro não impõe estrutura, assim exigindo uma documentação rigorosa e boas práticas.
