# ADR-004: Banco de dados

**Data:** 23-11-2025 **Status:** Aceito

# Contexto e Problema

O sistema do MedConnect requer o armazenamento de dados com alta consistência e integridade, essenciais para informações financeiras, cadastros de pacientes, agendamentos e transações. É crucial que o banco de dados suporte transações complexas e consultas robustas para geração de relatórios.

# Alternativas consideradas

**PostgreSQL:** Relacional, confiável, excelente suporte a transações complexas e funções avançadas. Grande comunidade. Estrutura rígida e curva de aprendizado mais acentuada para recursos avançados.

**MySQL:** Relacional, popular, amplamente utilizado no mercado e fácil de configurar. Bom para a maioria dos cadastros. Menos avançado em tipos de dados e funções transacionais complexas se comparado ao PostgreSQL.

**Angular:** Document-oriented, flexível, ideal para dados não estruturados.. Não é ideal para relações complexas e para garantir a consistência financeira (Atomicity, Consistency, Isolation, Durability - ACID).

# Decisão tomada

A decisão tomada foi adotar uma estratégia de banco de dados MySQL.

# Consequências

**Positivo:** Consistência Segura, com o uso do MySQL para transações críticas e complexas, e suporte. 
**Negativo:** Escalabilidade limitada, dificuldade em backups incrementais.


