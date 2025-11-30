# Spike Test

## Objetivo
- Validar resiliência a aumentos abruptos de usuários simultâneos e observar recuperação controlada.
- Garantir que latência e taxa de falhas permaneçam dentro dos thresholds mesmo no pico.

## Estágios definidos (`tests/spike_test.js`)
```
{ duration: "10s", target: 20 }   // rampa inicial
{ duration: "5s",  target: 300 }  // spike forte
{ duration: "10s", target: 300 }  // sustentação do pico
{ duration: "10s", target: 0 }    // rampa de saída
```
- Thresholds globais: `http_req_failed < 5%` e `http_req_duration p(90) < 2000 ms`.
- Fluxo executado: `performanceFlow` (`scripts/purchase-flow.js`) com registro, login e consulta autenticada.

## Como rodar
```bash
k6 run tests/spike_test.js
```
- O `handleSummary` do K6 não é customizado aqui; use `--out json=reports/report.json` se precisar de export adicional.

## Como validar resiliência
- Monitore picos de `http_req_duration` (p90/p95) e `http_req_failed` durante o estágio de 300 VUs.
- Avalie a queda controlada na etapa final (target 0) verificando se não há backlog ou erros acumulados.
- Compare com os thresholds para confirmar aprovação automática.
