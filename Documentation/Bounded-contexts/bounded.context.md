# Bounded Contexts do MedConnect ERP

| Contexto | Responsabilidades |
| ----- | ----- |
| **Auth** | Login, tokens, permissões |
| **Scheduling** | Agendamentos, horários, serviços |
| **Payments** | Integração com gateway de pagamento |
| **Notifications** | Emails, lembretes e avisos |


## Agendamento

- Gerenciamento de horários e slots dos médicos
- Criação, alteração e cancelamento de consultas.
- Validação de conflitos de agendas

## Cadastros

- Cadastro e manutenção de Pacientes
- Cadastro e gestão de Funcionários/Corpo Clínico.
- Cadastro de Fornecedores

## Mensageria / Eventos

- Fila de eventos (Redis)
- Processamento assíncrono de notificações e integração com terceiros
- Microserviço Node.js para processamentos assíncronos e consolidação de dados

## **Detalhamento do Bounded Context “Scheduling”**

### **Entities**

* **Appointment**  
* **Customer**  
* **Service**

### **Value Objects**

* **TimeRange**  
* **Price**

### **Aggregate Root**

* **Appointment**