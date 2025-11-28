# Contexto 

Este documento define os Quality Scenarios do MedConnect, estabelecendo métricas, critérios e expectativas de comportamento para garantir alta performance, confiabilidade, manutenibilidade e capacidade de observação. O objetivo é garantir que o sistema atenda às expectativas do negócio e suporte o crescimento.

## Desempenho

**Objetivo:** Garantir que as operações essenciais (login, cadastros e agendamentos) respondam de forma rápida e consistente, mesmo sob carga moderada.

**Cenários:**

- Usuário realiza login durante horário de pico com 300 acessos simultâneos.
- Criação de um novo paciente com validações de CPF e e-mail.
- Agendamento de consulta verificando disponibilidade de horário (slot) em tempo real.

**Critérios de aceitação:**

- Tempo máximo de resposta: 2 segundos.
- API deve suportar até 500 requisições simultâneas sem degradação perceptível.
- SSR do Next.js deve renderizar dashboards em menos de 2s com até 1000 registros.

## Disponibilidade

**Objetivo:** Garantir que o sistema esteja disponível para clínicas e usuários finais em horário comercial, e que interrupções planejadas não causem impacto.

**Cenários:**

- Usuário tenta acessar o MedConnect entre 07h e 22h.

- **Critérios de aceitação:**

- Disponibilidade mensal mínima de 99,5%.
- Docker + Docker Compose devem permitir deploy de frontend, backend e mensageria sem downtime perceptível.
- Falhas em serviços externos de notificação não devem derrubar o ERP (circuit breaker ativo).

## Confiabilidade

**Objetivo:** Garantir integridade dos dados de pacientes, profissionais e agendamentos, mesmo em falhas temporárias de banco ou mensageria.

**Cenários:**

- Queda momentânea do PostgreSQL ou MySQL.
- Falha temporária no envio de notificações pelo microsserviço de mensageria.

## Critérios de aceitação:

- Operações críticas devem seguir padrões ACID (em especial transações no PostgreSQL).
- Em caso de falha no banco, sistema deve tentar novamente:
- **Login:** até 3 tentativas com backoff exponencial.
- **Cadastro de pacientes:** até 2 tentativas.

## Logs detalhados devem registrar:

- Erros de autenticação
- Falhas na criação/atualização de registros
- Eventos de agendamento crítico
- Mensageria deve reprocessar notificações quando o serviço for restaurado.

## Escalabilidade

**Objetivo:** Permitir que o sistema cresça de forma sustentável, acompanhando aumento de usuários e clínicas integradas.

**Cenários:**

- Duplicação da quantidade de usuários simultâneos.
- Crescimento de 5x no volume de agendamentos e históricos de atendimento.
- Aumento repentino de notificações enviadas pelo microsserviço.

# Critérios de aceitação:

- Arquitetura em containers deve permitir:
- Réplicas do backend Express
- Escalonamento horizontal do microsserviço de mensageria
- Next.js deve suportar cache e SSR otimizados para dashboards.
- Sistema deve manter performance estável com o aumento de carga.

## Manutenibilidade:

**Objetivo:** Facilitar a evolução contínua do MedConnect e reduzir o custo de manutenção.

**Cenários:**

- Adição de novo módulo: prontuário, financeiro ou integração externa.
- Ajustes e atualizações no fluxo de agendamento ou cadastro.
- Inclusão de novos profissionais front e back na equipe.

## Critérios de aceitação:

- Arquitetura modular (Express + microsserviço + Next.js) deve permitir adição de features sem retrabalho massivo.
- Código deve seguir padrões estabelecidos nos ADRs e boas práticas internas.
- Testes automatizados (unitários e integração) devem cobrir funcionalidades essenciais.
- Estrutura de pastas e documentação clara devem permitir onboarding rápido de novos devs.

## Observabilidade:

**Objetivo:** Assegurar monitoramento completo do sistema, facilitando detecção de falhas, análise de comportamento e rastreamento de operações críticas.

**Cenários:**

- Aumento anormal na falha de logins.
- Conflitos de agendamento ocorrendo acima do esperado.
- Latência elevada no envio de notificações.

## Critérios de aceitação:
	
- **Métricas:**

- **Login:**

- Latência média por requisição
- Taxa de sucesso/falha
- Número de tentativas por usuário
- Cadastro de pacientes:
- Tempo médio para criar registro
- Taxa de falha no banco

- **Agendamentos:**

- Latência de criação/atualização
- Taxa de conflito de agenda
- Tempo de busca de Slot Livre

- **Logs obrigatórios:**

- Erros de autenticação
- Erros CRUD
- Eventos críticos (cancelamentos, reagendamentos, bloqueios de conta)
- Falhas em integrações assíncronas
- Auditoria completa dos agendamentos

## Resiliência

**Objetivo:** Garantir que falhas inevitáveis não interrompam a operação.

**Cenários:**

- Serviço externo de notificação fica indisponível.
- Serviço de hashing/token apresenta instabilidade.
- Falha de escrita no banco durante cadastro.

**Critérios de aceitação:**

- **Login:**

- Retry automáticos. 3 tentativas
- Timeout: 2s
-Circuit breaker após 5 falhas consecutivas. Reset em 30s

- **Cadastro de pacientes:**

- Retry até 2 vezes
- Timeout: 1.5s

- **Agendamentos:**

- Retry em APIs externas
- Circuit breaker após 10 falhas. Reset após 60s.
- Mecanismo de lock otimista para evitar conflitos
