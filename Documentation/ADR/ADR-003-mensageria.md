# ADR-003: Microsserviço de mensageria

**Data:** 23-11-2025 **Status:** Aceito

# Contexto e Problema

O sistema ERP necessita de um mecanismo para processar eventos de forma assíncrona. Isso é essencial para tarefas como envio de notificações, alertas de agendamento e integração com sistemas de terceiros, garantindo que o backend principal não seja sobrecarregado por operações de longa duração ou que não exigem resposta imediata.
Alternativas consideradas

**Go + gRPC / RabbitMQ:** Baixa latência, leve, fácil deploy em containers.
**Python + Celery/RabbitMQ:** Simples para tarefas assíncronas, mas menos performático e exige mais dependências.
**Node.js:** Fácil integração com o express.js, usando a mesma stack. Possível performance inferior em cenários de processamento intenso em comparação ao GO.

# Decisão tomada

Criar o microsserviço de mensageria em Node.js.
Consequências

**Positivo:** Coerência de stack, aceleração e arquitetura desacoplada.
**Negativo:** Performance em carga alta.
