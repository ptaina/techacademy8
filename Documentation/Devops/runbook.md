# Estratégia de Deploy

- **Tipo de deploy:** Blue/green
- **Objetivo:** Minimizar downtime e permitir rollback rápido
- **Passos**
- Deploy da nova versão de ambiente Green
- Testes automatizados e manuais de validação
- Redirecionamento e manuais de validação
- Redirecionamento do tráfego do ambiente Blue para Green
- Desativação do ambiente Blue
- **Rollback:** em caso de falha, redirecionar tráfego novamente para Blue.
