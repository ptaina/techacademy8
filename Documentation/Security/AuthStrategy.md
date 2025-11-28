
##  Autenticação

- **Método:** Json Web Token (JWT)
- **Fluxo:**
- Usuário envia login e senha
- Sistema valida credenciais
- Gera token JWT com validade de uma hora
- Token enviado ao cliente e usado em requisições subsequentes
- Token enviado ao cliente e usado em requisições subsequentes
- **Observações:** Senhas armazenadas com hash seguro (bcrypt), e sem a possibilidade de reversão.

## Autorização

- **Modelo:** Role-Based Acess Control (RBAC)
- **Papéis:**
- Admin: Acesso completo a todos os módulos
- Gestor: Acesso limitado a cadastros e relatórios
- Usuário comum: Acesso apenas a funcionalidades próprias
- **Validação:**
- Cada endpoint verifica o token e o papel do usuário
- Operações críticas possuem logs de auditoria
- Considerações de segurança

- **Tokens expiram e podem ser renovados via refresh token**
- **Logout remove token do cliente**
- **Logs de acesso e falha de autenticação são armazenados para monitoramento**
