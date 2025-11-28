# Diagrams C4**

## **Contexto**

### **Personas**

* **Paciente / Usuário:** realiza login, agenda horários, gerencia perfil.  
* **Administrador:** gerencia usuários, serviços, relatórios e permissões.  
* **Sistema Externo de Pagamento:** processa transações.  
* **Serviço de Notificações:** envia emails e lembretes automáticos.

### **Descrição do Sistema**

O sistema centraliza autenticação, gestão de horários, pagamentos e notificações.

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

## **Containers**

| Container | Tecnologia | Função |
| ----- | ----- | ----- |
| **Backend (API)** | Node.js \+ Express | Regras de negócio, endpoints, integrações |
| **Frontend Web** | React | Interface de usuário |
| **Banco de Dados** | Armazenamento persistente |
| **Worker de Notificações** | Node.js | Envio de emails e lembretes |
| **Pagamento Externo** | API de terceiros | Processamento de pagamento |