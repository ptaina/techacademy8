## Autenticação / Login

**Retry:** Tentativa automática em caso de falha de conexão com o banco de dados. Máx. 3 tentativas com backoff exponencial.
**Timeout:** 2 segundos para resposta completa da API de autenticação.
**Circuit breaker:** Abre após 5 falhas consecutivas no serviço de hashing de senhas (ou serviço de token), com reset automático após 30s.

## Cadastro de pacientes

**Retry:** Tentativa em caso de falha de escrita no banco. Máx. 2 tentativas.
**Timeout:** 1,5 segundos por operação de criação/atualização.
**Circuit breaker:** Não aplicável já que opera apenas internamente.

## Módulo de agendamento

**Retry:** Retry em serviços de fornecedores externos de notificação (e-mail).
**Timeout:** 3 segundos para requisições a APIs externas.
**Circuit breaker:** Prevê isolamento de falhas de APIs externas de notificação, evitando impacto no sistema principal de agendamento. Abre após 10 falhas consecutivas, com reset após 60s.
