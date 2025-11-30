# BlazeDemo – Performance K6

## Visão geral
- Projeto de testes de performance em K6 (JavaScript) voltado para validar o fluxo do BlazeDemo.
- Meta principal: suportar 250 requisições por segundo com P90 abaixo de 2s.
- Execução local, via Docker, Docker Compose e GitHub Actions.
- Relatório HTML gerado automaticamente pelo `handleSummary` em `reports/summary.html` usando `k6-reporter`.

## Objetivo do teste técnico
- Sustentar 250 req/s de forma estável.
- Manter P90 < 2s mesmo com cenários autenticados concorrentes.
- Evidenciar resultado com relatórios HTML/JSON versionados na pasta `reports`.

## Arquitetura real do projeto
- `tests/load_test.js`: 3 cenários simultâneos (`public_load`, `auth_flow`, `private_flow`) com thresholds por cenário.
- `tests/spike_test.js`: teste de pico usando estágios graduais (20 ➝ 300 VUs).
- `scripts/purchase-flow.js`: fluxo opcional reutilizável de compra/performance para o spike.
- `scripts/helpers.js`: utilitário de pausa aleatória (não acoplado aos testes atuais).
- `Dockerfile` e `docker-compose.yml`: empacotam e executam o K6.
- `.github/workflows/k6-performance.yml`: pipeline CI/CD que instala o K6 e publica artefatos.
- `reports/`: saída automática `summary.html` (HTML) e `report.json` (quando usado `--out json`).

## Resumo dos cenários de carga (`tests/load_test.js`)
- `public_load`: `constant-vus` com 250 VUs por 1m, lendo `/public/crocodiles/` (tag `scenario:public`).
- `auth_flow`: `constant-vus` com 5 VUs por 1m (start 5s), registra usuário e faz login (tag `scenario:auth`).
- `private_flow`: `constant-vus` com 10 VUs por 1m (start 10s), acessa `/my/crocodiles/` com token (tag `scenario:private`).

## Thresholds e métricas
- `success_rate > 0.95` consolidado via métrica `Rate`.
- Públicos: `http_req_failed{scenario:public} < 1%` e `http_req_duration{scenario:public} p(90) < 2000 ms`.
- Autenticados: `http_req_failed{scenario:auth} < 20%`, `http_req_duration{scenario:auth} p(95) < 2500 ms`.
- Privados: `http_req_failed{scenario:private} < 5%`, `http_req_duration{scenario:private} p(90) < 2000 ms`.
- Falhas e tempos são avaliados por cenário graças às tags configuradas.

## Tecnologias usadas
- K6 (JavaScript ES modules).
- k6-reporter para HTML (`handleSummary`).
- Docker e Docker Compose.
- GitHub Actions.

## Como interpretar os relatórios
- `reports/summary.html`: visão gráfica (latência, throughput, taxas de erro) gerada ao final do teste.
- `reports/report.json`: export opcional (`--out json=...`) usado no CI para consulta detalhada.
- Compare métricas de latência (p90/p95) e `http_req_failed` com os thresholds declarados; qualquer violação quebra o teste.
