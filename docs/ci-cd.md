# CI/CD

## Pipeline GitHub Actions (`.github/workflows/k6-performance.yml`)
- Acionado em pushes para `main` e manualmente via `workflow_dispatch`.
- Job único `load-test` executa em `ubuntu-latest`.

## Etapas
- **Checkout**: `actions/checkout@v4` para obter o código.
- **Install k6**: adiciona repositório oficial, instala o binário e valida com `k6 version`.
- **Run Load Test**: cria `reports/`, executa `k6 run tests/load_test.js --out json=reports/report.json` (gera também `reports/summary.html` via `handleSummary`).
- **List Artifacts**: lista o conteúdo de `reports/` para conferência de CI.
- **Upload Artifacts**: publica `reports/report.json` e `reports/summary.html` separadamente com `actions/upload-artifact@v4`.

## Onde encontrar os relatórios
- Após a execução, os artefatos `k6-json-report` e `k6-summary-html` ficam disponíveis na aba "Actions" > run do workflow.
- Localmente no runner (ou após download do artifact): `reports/report.json` para análise detalhada e `reports/summary.html` para visualização gráfica.
