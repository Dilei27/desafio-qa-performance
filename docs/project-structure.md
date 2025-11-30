# Estrutura do Projeto

## Árvore de pastas real
```
performance-blazedemo-k6/
├── tests/
│   ├── load_test.js
│   └── spike_test.js
├── scripts/
│   ├── purchase-flow.js
│   └── helpers.js
├── reports/
│   └── summary.html        # gerado automaticamente
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/k6-performance.yml
├── README.md
└── mkdocs.yml
```

## Descrição dos arquivos
- `tests/load_test.js`: teste principal com três cenários concorrentes e thresholds separados.
- `tests/spike_test.js`: teste de pico usando o fluxo de compra para avaliar resiliência.
- `scripts/purchase-flow.js`: fluxo reutilizável de compra/autenticação (usado no spike).
- `scripts/helpers.js`: função utilitária de pausa aleatória (atualmente não importada).
- `reports/`: saída automática `summary.html` (HTML) e `report.json` quando acionado com `--out`.
- `Dockerfile`: imagem baseada em `grafana/k6:latest`, copia o código e roda `tests/load_test.js`.
- `docker-compose.yml`: orquestra o contêiner K6 com bind mount do diretório do projeto.
- `.github/workflows/k6-performance.yml`: pipeline CI/CD para executar o load test e publicar artefatos.

## Cenários do teste de carga
- `public_load`: fluxo público de leitura (`GET /public/crocodiles/`) com 250 VUs estáveis por 1m.
- `auth_flow`: registra um usuário e faz login com 5 VUs por 1m (inicia em 5s).
- `private_flow`: acessa dados privados com token, 10 VUs por 1m (inicia em 10s).
- Todos os cenários compartilham a métrica `success_rate` para medir sucesso agregado.
