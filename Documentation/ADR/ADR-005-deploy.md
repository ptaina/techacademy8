# ADR-005: Deploy

**Data:** 23-11-2025 **Status:** Aceito

# Contexto e Problema

O ERP precisa ser implantado de forma consistente em diferentes ambientes (desenvolvimento, homologação e produção) e suportar escalabilidade.
Alternativas consideradas

**Docker e Docker Compose:** Padroniza ambiente, fácil de configurar local e em servidores.

**Deploy direto em VPS:** Mais simples, mas sujeito a inconsistências entre ambientes.

**Kubernetes:** Robusto e escalável, mas overhead grande para um ERP pequeno.

# Decisão tomada

Adotar Docker + Docker Compose para padronização de ambientes, com containers separados para backend, frontend, banco de dados e mensageria.

# Consequências

**Positivo:** Reprodutibilidade, fácil deploy, isolamento de serviços.
**Negativo:** Não resolve automaticamente escalabilidade horizontal avançada.
