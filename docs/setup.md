# Setup

## Requisitos
- k6 instalado localmente (CLI oficial).
- Docker 20+ e Docker Compose (opcional para execução conteinerizada).
- Acesso à internet para baixar dependências do K6 e módulos remotos.

## Instalação do K6
```bash
sudo apt-get update && sudo apt-get install -y gnupg curl
curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install -y k6
k6 version
```

## Execução local
```bash
k6 run tests/load_test.js
```
- Gera automaticamente `reports/summary.html` via `handleSummary`.
- Para o spike test:
```bash
k6 run tests/spike_test.js
```

## Execução via Docker
```bash
docker build -t k6-performance .
docker run --rm -v "$(pwd)"/reports:/app/reports k6-performance
```
- O volume garante que `reports/summary.html` e `reports/report.json` fiquem disponíveis na máquina host.

## Execução via Docker Compose
```bash
docker compose up --build
```
- Usa o serviço `k6` definido em `docker-compose.yml` e executa `tests/load_test.js`.

## Como gerar relatório HTML
- Nenhum passo extra: `handleSummary` grava `reports/summary.html` ao fim de cada execução.
- Para abrir localmente:
```bash
python -m http.server --directory reports 8000
# ou apenas abra reports/summary.html no navegador
```
