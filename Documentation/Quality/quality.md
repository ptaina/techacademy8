## Autenticação / Login

- SLI: Tempo médio de resposta da API de login.
- SLO: 95% das requisições devem ter tempo de resposta < 200ms.
- **Observabilidade:** Logs de erro, métricas de latência e taxa de sucesso/falha de autenticação.

## Cadastro de pacientes

- SLI: Tempo médio para criar um novo registro.
- SLO: 99% das requisições concluídas em < 300ms.
- **Resiliência:** Retry automático em falha de conexão com o banco de dados.
- **Observabilidade:** Métricas de criação (throughput), logs detalhados de falhas, alertas de alterações críticas nos dados.

## Módulo de agendamento

- SLI: Latência de criação/atualização de agendamento..
- SLO: 99% das operações devem ser concluídas em < 500ms.
- **Resiliência:** Mecanismo de Lock otimista no slot de horário para evitar conflitos de agenda (sobreposição).
- **Observabilidade:** Métricas de latência, taxa de conflito de agenda, logs de cancelamento/reagendamento (auditoria).
