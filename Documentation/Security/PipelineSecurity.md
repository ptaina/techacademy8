
## Análise de dependências

- Executar ferramentas de análises de vulnerabilidades (ex: npm audit, gosec)
- Bloquear builds se forem encontradas vulnerabilidades críticas

## Análise estática de código (SAST)

- Rodar linters e scanners de segurança
- Verificar padrões inseguros (ex: SQL injection, XSS, uso de credenciais em código)

## Gestão de dados

- Nunca armazenar senhas ou chaves diretamente no repositório
- Uso de variáveis de ambiente ou serviços de vault

## Testes automatizados de segurança

- Testes de endpoints críticos (login, transações financeiras)
- Testes de autorização e roles

## Revisão e auditoria

- Pull requests revisados por pelo menos 1 desenvolvedor
- Logs de build e deploy armazenados para auditoria

