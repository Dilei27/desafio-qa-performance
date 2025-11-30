# Resultados

## Resultado real
- Throughput sustentado: **~1119 req/s** durante o teste de carga.
- Latência: **P90 ≈ 165 ms** no cenário público (bem abaixo do limite de 2s).
- Thresholds: todos atendidos (`success_rate`, `http_req_failed`, `http_req_duration` por cenário).
- Estabilidade: sem quedas de VU ou degradação perceptível ao longo do minuto de execução.

## Observação técnica (201/200)
- A API demo `test-api.k6.io` limita criação de usuários por IP.
- Consequências observadas:
  - Algumas chamadas de registro retornam `200` em vez de `201`.
  - Falhas intermitentes são toleradas pelos thresholds configurados para fluxos autenticados.
- Não afeta a validação do critério principal (carga pública com P90 < 2s).

## Conclusão
- O objetivo de 250 req/s com P90 < 2s foi atingido com ampla margem.
- A arquitetura com cenários paralelos, thresholds por tag e relatório HTML permite monitorar rapidamente qualquer regressão.
- Os artefatos `reports/summary.html` e `reports/report.json` sustentam a evidência de aprovação.
