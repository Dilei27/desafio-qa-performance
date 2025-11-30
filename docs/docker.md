# Docker

## Dockerfile
- Base: `grafana/k6:latest`.
- `WORKDIR /app` e `COPY . .` para trazer scripts e testes.
- `CMD ["run", "tests/load_test.js"]` mantém a execução padrão do load test.
- Inclui `handleSummary`, logo `reports/summary.html` é gerado dentro do contêiner.

## docker-compose.yml
- Serviço único `k6`:
  - `build: .` usa o `Dockerfile` local.
  - `container_name: k6-performance-test`.
  - Volume `.:/app` para compartilhar código e relatórios com a máquina host.
  - Comando padrão: `k6 run tests/load_test.js`.

## Como executar
```bash
docker build -t k6-performance .
docker run --rm -v "$(pwd)"/reports:/app/reports k6-performance
```
Ou com Docker Compose:
```bash
docker compose up --build
```
- Após a execução, consulte `reports/summary.html` e `reports/report.json` (se `--out` for usado) no diretório montado.
