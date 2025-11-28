### **Domínio Principal (Core Domain):**

* Usuários  
* Agendamentos

| Contexto | Descrição |
| :--- | :--- |
| **Scheduling** | O coração do negócio. Responsável por agendamentos, slots e validação de conflitos. |

### **Domínio de Suporte (Supporting Domains):**

* Pagamentos  
* Notificações

| Contexto | Descrição |
| :--- | :--- |
| **Patients** | Fonte de verdade para dados cadastrais e histórico de pacientes. |
| **Staff** | Fonte de verdade para dados do corpo clínico e funcionários (recursos). |
| **Catalog** | Gestão de serviços, procedimentos e preços base. |

### **Domínio genérico (Generic domains)**

| Contexto | Descrição |
| :--- | :--- |
| **Auth** | Autenticação e autorização (Login, tokens, permissões). |
| **Payments** | Integração com gateways de pagamento e gestão de transações financeiras. |
| **Notifications** | Envio assíncrono de e-mails, SMS, lembretes, etc. |