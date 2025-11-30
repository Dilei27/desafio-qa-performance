# Testes

## Load Test (`tests/load_test.js`)
- Três cenários `constant-vus` executam em paralelo durante 1 minuto.
- VUs: público 250 (imediato), auth 5 (start 5s), privado 10 (start 10s).
- Objetivo: sustentar 250 req/s com P90 < 2s no cenário público sem degradar fluxos autenticados.
- Thresholds são aplicados por cenário usando tags (`scenario:public|auth|private`).

### Fluxos
- **publicFlow**: `GET https://test-api.k6.io/public/crocodiles/`, valida `200`.
- **authFlow**: registra usuário (`201`) e faz login (`200`), simula autenticação leve.
- **privateFlow**: registra, loga e consulta `/my/crocodiles/` com token Bearer, espera `200`.

### Métrica `successRate`
- `successRate` é um `Rate` customizado que recebe `1` para respostas com status esperado e `0` para falhas.
- Permite um threshold global `rate>0.95`, cobrindo todos os fluxos.

### Trechos importantes
```javascript
export const options = {
  scenarios: {
    public_load: { executor: "constant-vus", exec: "publicFlow", vus: 250, duration: "1m", tags: { scenario: "public" } },
    auth_flow:   { executor: "constant-vus", exec: "authFlow",   vus: 5,   duration: "1m", startTime: "5s",  tags: { scenario: "auth" } },
    private_flow:{ executor: "constant-vus", exec: "privateFlow",vus: 10,  duration: "1m", startTime: "10s", tags: { scenario: "private" } },
  },
  thresholds: {
    "success_rate": ["rate>0.95"],
    "http_req_failed{scenario:public}": ["rate<0.01"],
    "http_req_duration{scenario:public}": ["p(90)<2000"],
    "http_req_failed{scenario:auth}": ["rate<0.20"],
    "http_req_duration{scenario:auth}": ["p(95)<2500"],
    "http_req_failed{scenario:private}": ["rate<0.05"],
    "http_req_duration{scenario:private}": ["p(90)<2000"],
  },
};
```
- Cada cenário tem `check` dedicado e incrementa `successRate` apenas quando o status esperado é recebido.

### `handleSummary`
- Importa `htmlReport` de `k6-reporter` e grava automaticamente em `reports/summary.html`.
- Mantém o relatório HTML mesmo quando a execução ocorre dentro de contêiner ou CI.
```javascript
export function handleSummary(data) {
  return { "reports/summary.html": htmlReport(data) };
}
```

## Spike Test (`tests/spike_test.js`)
- Usa `performanceFlow` do `scripts/purchase-flow.js` para simular registro, login e acesso privado.
- Estágios: `10s` → 20 VUs, `5s` → 300 VUs (spike), `10s` mantendo 300, `10s` descendo para 0.
- Thresholds globais: `http_req_failed < 5%` e `http_req_duration p(90) < 2000 ms`.
- Objetivo: avaliar resiliência a crescimento abrupto de carga e recuperação sem erros persistentes.
