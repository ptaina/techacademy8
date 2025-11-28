# **Documentação Arquitetural Projeto Medconnect**

## **1\. Introdução**

O **Medconnect** é uma aplicação web destinada ao agendamento de consultas médicas, utilizada por recepções de clínicas e hospitais.  
 O sistema permite cadastrar pacientes, selecionar profissionais, verificar disponibilidade e organizar consultas de maneira moderna, rápida e segura.

---

## **2\. Objetivos do Sistema**

* Facilitar o processo de agendamento médico.  
* Reduzir filas e o congestionamento na recepção.  
* Garantir o controle da agenda dos profissionais.  
* Fornecer uma plataforma segura, escalável e organizada.

---

# **3\. Diagramas C4**

---

## **3.1 — Nível 1: Contexto**

### **Personas**

* **Atendente / Usuário:** realiza login, agenda horários, gerencia perfil.  
* **Administrador:** gerencia usuários, serviços, relatórios e permissões.  
* **Sistema Externo de Pagamento:** processa transações.  
* **Serviço de Notificações:** envia emails e lembretes automáticos.

### **Descrição do Sistema**

O sistema centraliza autenticação, gestão de horários, pagamentos e notificações.

### 

### 

### 

### 

### **Fluxo Geral**

1. Usuário cria conta ou faz login.  
2. Consulta horários disponíveis.  
3. Seleciona serviço e profissional.  
4. Sistema valida disponibilidade.  
5. Integra com módulo de pagamento (quando necessário).  
6. Envia confirmação ao paciente.

---

## **3.2 — Nível 2: Containers**

| Container | Tecnologia | Função |
| ----- | ----- | ----- |
| **Backend (API)** | Node.js \+ Express | Regras de negócio, endpoints, integrações |
| **Frontend Web** | React | Interface de usuário |
| **Banco de Dados** | PostgreSQL | Armazenamento persistente |
| **Worker de Notificações** | Node.js | Envio de emails e lembretes |
| **Pagamento Externo** | API de terceiros | Processamento de pagamento |

---

# 

# 

# 

# **4\. ADRs — Architectural Decision Records**

---

## **ADR 001 — Arquitetura (Monólito Modular)**

**Decisão:** Utilizar um monólito modular (Modulith).  
 **Motivos:**

* Estrutura simples.  
* Manutenção mais fácil.  
* Baixo custo de implementação.  
* Módulos independentes sem complexidade de microserviços.

---

## **ADR 002 — Banco de Dados (PostgreSQL)**

**Motivos:**

* Suporte completo a transações ACID.  
* Excelente para dados relacionais.  
* Alta estabilidade e maturidade.  
* Boa integração com clouds e ORMs modernos.

---

# **5\. Quality Scenarios — Atributos de Qualidade**

---

### **Desempenho**

* P95 das respostas ≤ **600ms**.

### **Disponibilidade**

* Uptime estimado: **99,5%**.

### **Segurança**

* Autenticação via JWT.  
* Senhas criptografadas com bcrypt.  
* Rate limiting para proteger o login.

### 

### **Escalabilidade**

* Worker separado para notificações.  
* Possibilidade de incluir cache Redis no futuro.

# **6\. DDD — Domínios, Context Map e Bounded Contexts**

---

## **6.1 — Context Map**

### **Domínio Principal (Core Domain):**

* Usuários  
* Agendamentos

### **Domínio de Suporte (Supporting Domains):**

* Pagamentos  
* Notificações

---

## **6.2 — Bounded Contexts**

| Contexto | Responsabilidades |
| ----- | ----- |
| **Auth** | Login, tokens, permissões |
| **Scheduling** | Agendamentos, horários, serviços |
| **Payments** | Integração com gateway de pagamento |
| **Notifications** | Emails, lembretes e avisos |

---

## 

## 

## 

## **6.3 — Detalhamento do Bounded Context “Scheduling”**

### **Entities**

* **Appointment**  
* **Customer**  
* **Service**

### **Value Objects**

* **TimeRange**  
* **Price**

### **Aggregate Root**

* **Appointment**

---

# **7\. OpenAPI / Swagger — Endpoints Principais**

`openapi: 3.0.0`

`info:`

  `title: Medconnect API`

  `version: 1.0.0`

`paths:`

  `/auth/login:`

    `post:`

      `summary: Login do usuário`

      `responses:`

        `"200":`

          `description: Autenticado`

  `/auth/register:`

    `post:`

      `summary: Cria novo usuário`

      `responses:`

        `"201":`

          `description: Usuário criado`

  `/appointments:`

    `get:`

      `summary: Lista agendamentos`

      `responses:`

        `"200":`

          `description: Sucesso`

    `post:`

      `summary: Cria um novo agendamento`

      `responses:`

        `"201":`

          `description: Criado`

---

# **8\. Qualidade, Resiliência e Observabilidade**

---

## **8.1 — SLOs e SLIs**

* Tempo de resposta: **≤ 600ms**  
* Disponibilidade: **99,5%**  
* Erros aceitáveis: **≤ 1%**

---

## **8.2 — Estratégias de Resiliência**

* Retry para chamadas externas.  
* Timeout de 3 segundos.  
* Circuit Breaker após repetidas falhas.  
* Logs estruturados JSON.

---

## 

## 

## **8.3 — Observabilidade**

* Logs estruturados.  
* Métricas monitoradas:  
  * Tempo de resposta  
  * Número de falhas  
  * Consumo de CPU  
* Tracing distribuído com OpenTelemetry.

---

# **9\. Segurança e DevSecOps**

---

## **9.1 — Threat Model: Fluxo de Login**

### **Riscos**

* Ataques de força bruta.  
* Roubo de tokens.  
* SQL Injection.

### **Mitigações**

* Rate limiting no login.  
* JWT com expiração curta.  
* ORM seguro.  
* HTTPS obrigatório.

---

## **9.2 — Estratégia de Autenticação / Autorização**

* JWT \+ Refresh Token.  
* RBAC com perfis `user` e `admin`.

---

## **9.3 — Checklist de Segurança no CI/CD**

* Testes automatizados.  
* Análise de dependências.  
* Scans de vulnerabilidade.  
* Proteção de branch via Pull Requests.

---

# **10\. Entrega Contínua — CI/CD**

---

## **10.1 — Pipeline (GitHub Actions)**

`name: CI/CD Pipeline`

`on:`

  `push:`

    `branches: [ main ]`

`jobs:`

  `build:`

    `runs-on: ubuntu-latest`

    `steps:`

      `- uses: actions/checkout@v3`

      `- uses: actions/setup-node@v3`

        `with:`

          `node-version: 18`

      `- run: npm install`

      `- run: npm test`

  `deploy:`

    `needs: build`

    `runs-on: ubuntu-latest`

    `steps:`

      `- run: echo "Deploy automático configurado"`

---

## **10.2 — Estratégia de Deploy**

* **Rolling Release**  
* Rollback rápido caso ocorra falha

---

## **10.3 — Runbook de Incidentes**

**Se o sistema cair:**

1. Verifique os logs.  
2. Teste a saúde do banco.  
3. Valide comunicação com o gateway de pagamento.  
4. Reinicie o serviço.  
5. Caso persista, acione o suporte do provedor.

