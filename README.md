# MedConnect

> Aplicação web destinada ao agendamento de consultas médicas, utilizada por recepções de clínicas e hospitais.

O sistema permite cadastrar pacientes, selecionar profissionais, verificar disponibilidade e organizar consultas de maneira moderna, rápida e segura.

## Objetivos do Sistema

- **Facilitar** o processo de agendamento médico.
- **Reduzir** filas e o congestionamento na recepção.
- **Garantir** o controle da agenda dos profissionais.
- **Fornecer** uma plataforma segura, escalável e organizada.

## Como Rodar o Projeto (Docker)

Este projeto utiliza **Docker Compose** para orquestrar Backend, Frontend, Banco de Dados, Cache e Microsserviços. Não é necessário instalar Node.js ou MySQL na máquina.

### Pré-requisitos

- Docker Desktop instalado e rodando.

### Passo a Passo

1.  Clone o repositório:

    ```bash
    git clone [https://github.com/ptaina/techacademy8.git](https://github.com/ptaina/techacademy8.git)
    cd techacademy8
    ```

2.  Suba o ambiente:

    ```bash
    docker-compose up --build
    ```

3.  Acesse a aplicação:
    - **Frontend (App):** [https://localhost](https://localhost) (Aceite o certificado SSL local)
    - **Documentação API (Swagger):** [https://localhost/api-docs](https://localhost/api-docs)

---

## Arquitetura e Tecnologias

O projeto foi desenvolvido seguindo padrões de arquitetura moderna e microsserviços.

### Backend & Infraestrutura

- **Node.js & Express:** API REST principal.
- **TypeScript:** Tipagem estática para segurança do código.
- **MySQL 8:** Banco de dados relacional (Persistência principal).
- **Redis:**
  - **Cache:** Implementado na listagem de médicos (`cache-aside`) para alta performance.
  - **Pub/Sub:** Sistema de mensageria para comunicação assíncrona.
- **Microsserviço de Notificações:** Serviço isolado que "escuta" eventos do Redis (ex: `APPOINTMENT_CREATED`) e gera logs de auditoria.
- **Nginx:** Proxy Reverso e terminação SSL (HTTPS).
- **Docker:** Containerização de todos os serviços.

### Tech Forge (Funcionalidades Avançadas)

- **Segurança (RBAC):** Controle de acesso baseado em cargos (`Admin` vs `Patient`).
- **Upload de Arquivos:** Implementado com **Multer**, incluindo validação de tipo, tamanho e renomeação para evitar colisão.
- **Registro Duplo:** Criação automática de perfil de Paciente ao registrar novo usuário.

### Frontend

- **React + Vite:** Interface moderna e rápida.
- **TailwindCSS:** Estilização responsiva.

---

## Documentação Arquitetural (Rubrica)

A documentação detalhada da arquitetura (Diagramas C4, ADRs, DDD) encontra-se na pasta `/docs` deste repositório.

## Como Testar as Funcionalidades

### 1. Teste de Cache (Redis)

1.  Acesse a aba **Médicos**.
2.  Verifique o log do container `backend`: ` Buscando no Banco de Dados...`
3.  Atualize a página (F5).
4.  Verifique o log: ` Recuperado do Cache Redis!`

### 2. Teste de Mensageria (Microsserviços)

1.  Crie um **Novo Agendamento**.
2.  Verifique o log do container `notifications`: ` [EVENTO RECEBIDO]: APPOINTMENT_CREATED`.
3.  O sistema processou o evento de forma assíncrona sem travar o backend principal.

Desenvolvido por **Tainá, Jacqueline e Mariana** para a disciplina de Tech Academy 8.
